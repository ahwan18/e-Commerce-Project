import * as CounterModel from '../models/counterModel';

export const fetchCounters = async () => {
  return CounterModel.getCounters();
};

export const fetchCounterById = async (counterId) => {
  const counter = await CounterModel.getCounterById(counterId);
  if (!counter) {
    throw new Error('Counter tidak ditemukan');
  }
  return counter;
};

export const addCounter = async (name) => {
  if (!name?.trim()) {
    throw new Error('Nama counter wajib diisi');
  }
  return CounterModel.createCounter({
    name: name.trim(),
    is_active: true,
  });
};

export const setCounterActive = async (counterId, isActive) => {
  return CounterModel.updateCounter(counterId, { is_active: isActive });
};

export const editCounter = async (counterId, payload) => {
  const updates = {};
  if (typeof payload.name === 'string') {
    const name = payload.name.trim();
    if (!name) {
      throw new Error('Nama counter wajib diisi');
    }
    updates.name = name;
  }
  if (typeof payload.is_active === 'boolean') {
    updates.is_active = payload.is_active;
  }
  return CounterModel.updateCounter(counterId, updates);
};

export const removeCounter = async (counterId) => {
  return CounterModel.deleteCounter(counterId);
};

export const acquireCounterSession = async (counterId, sessionId) => {
  const result = await CounterModel.acquireSession(counterId, sessionId);
  return result || { success: false, reason: 'unknown_error' };
};

export const releaseCounterSession = async (counterId, sessionId) => {
  return CounterModel.releaseSession(counterId, sessionId);
};

export const forceEndCounterSession = async (counterId) => {
  return CounterModel.releaseSession(counterId, null);
};
