import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as CounterController from '../controllers/counterController';

const ACTIVE_COUNTER_KEY = 'active_counter_session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const CounterContext = createContext();

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useCounter = () => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error('useCounter must be used within CounterProvider');
  }
  return context;
};

export const CounterProvider = ({ children }) => {
  const location = useLocation();
  const [counter, setCounter] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdminRoute = location.pathname.startsWith('/admin');

  const persistSession = (data) => {
    localStorage.setItem(ACTIVE_COUNTER_KEY, JSON.stringify(data));
  };

  const clearPersistedSession = () => {
    localStorage.removeItem(ACTIVE_COUNTER_KEY);
  };

  const releaseSession = async () => {
    if (!counter?.id || !sessionId) return;
    try {
      await CounterController.releaseCounterSession(counter.id, sessionId);
    } catch (releaseError) {
      console.error('Failed to release counter session:', releaseError);
    } finally {
      setCounter(null);
      setSessionId(null);
      clearPersistedSession();
    }
  };

  useEffect(() => {
    if (isAdminRoute) {
      setLoading(false);
      setError(null);
      return;
    }

    let mounted = true;

    const init = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(location.search);
        const counterIdFromUrl = params.get('counter_id');
        const persisted = localStorage.getItem(ACTIVE_COUNTER_KEY);
        const persistedSession = persisted ? JSON.parse(persisted) : null;

        const counterId = counterIdFromUrl || persistedSession?.counterId;
        if (!counterId) {
          throw new Error('Akses menu hanya melalui QR counter');
        }

        const nextSessionId = persistedSession?.sessionId || createSessionId();
        const result = await CounterController.acquireCounterSession(
          counterId,
          nextSessionId
        );

        if (!result?.success) {
          if (result?.reason === 'counter_in_use') {
            throw new Error('Counter sedang digunakan perangkat lain');
          }
          if (result?.reason === 'inactive_counter') {
            throw new Error('Counter tidak aktif');
          }
          throw new Error('Counter tidak valid');
        }

        const counterData = await CounterController.fetchCounterById(counterId);

        if (mounted) {
          setCounter(counterData);
          setSessionId(nextSessionId);
          persistSession({
            counterId: counterId,
            sessionId: nextSessionId,
          });
        }
      } catch (initError) {
        if (mounted) {
          setCounter(null);
          setSessionId(null);
          clearPersistedSession();
          setError(initError.message || 'Gagal mengakses counter');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, [isAdminRoute, location.search]);

  useEffect(() => {
    if (isAdminRoute) return undefined;

    const handleBeforeUnload = () => {
      if (!counter?.id || !sessionId) return;
      CounterController.releaseCounterSession(counter.id, sessionId).catch(() => {});
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [counter?.id, isAdminRoute, sessionId]);

  useEffect(() => {
    if (isAdminRoute || !counter?.id || !sessionId) return undefined;

    let timeoutId;
    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        releaseSession().catch(() => {});
      }, SESSION_TIMEOUT_MS);
    };

    const events = ['click', 'keydown', 'touchstart'];
    events.forEach((eventName) => {
      window.addEventListener(eventName, resetTimeout);
    });
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      events.forEach((eventName) => {
        window.removeEventListener(eventName, resetTimeout);
      });
    };
  }, [counter?.id, isAdminRoute, sessionId]);

  const value = useMemo(
    () => ({
      counter,
      counterId: counter?.id || null,
      counterName: counter?.name || null,
      sessionId,
      loading,
      error,
      hasActiveCounterSession: Boolean(counter?.id && sessionId),
      releaseSession,
    }),
    [counter, error, loading, sessionId]
  );

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
};
