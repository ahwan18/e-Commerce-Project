import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';

const SettingsContext = createContext(undefined);

export const SettingsProvider = ({ children }) => {
  const [uiMode, setUiMode] = useState('mode1'); // default to mode1
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();

    // Optional: Subscribe to changes in settings table for real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'store_settings',
        },
        (payload) => {
          if (payload.new && payload.new.key === 'ui_mode') {
            setUiMode(payload.new.value);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('store_settings')
        .select('value')
        .eq('key', 'ui_mode')
        .single();

      if (error) {
        if (error.code !== 'PGRST116') { // Ignore row not found error initially
          console.error('Error fetching settings:', error);
        }
      } else if (data) {
        setUiMode(data.value);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUiMode = async (newMode) => {
    try {
      // Optimistic update
      setUiMode(newMode);
      
      const { error } = await supabase
        .from('store_settings')
        .upsert({ key: 'ui_mode', value: newMode, description: 'Customer UI Mode' }, { onConflict: 'key' });

      if (error) throw error;
      
    } catch (err) {
      console.error('Failed to update settings:', err);
      // Revert on failure
      fetchSettings();
    }
  };

  return (
    <SettingsContext.Provider value={{ uiMode, updateUiMode, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
