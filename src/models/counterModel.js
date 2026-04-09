import { supabase } from '../services/supabaseClient';

export const getCounters = async () => {
  const { data, error } = await supabase
    .from('counters')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const getCounterById = async (id) => {
  const { data, error } = await supabase
    .from('counters')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const createCounter = async (counterData) => {
  const { data, error } = await supabase
    .from('counters')
    .insert([counterData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCounter = async (id, updates) => {
  const { data, error } = await supabase
    .from('counters')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCounter = async (id) => {
  const { error } = await supabase.from('counters').delete().eq('id', id);
  if (error) throw error;
  return true;
};

export const acquireSession = async (counterId, sessionId) => {
  const { data, error } = await supabase.rpc('acquire_counter_session', {
    p_counter_id: counterId,
    p_session_id: sessionId,
  });

  if (error) throw error;
  return data;
};

export const releaseSession = async (counterId, sessionId) => {
  const { data, error } = await supabase.rpc('release_counter_session', {
    p_counter_id: counterId,
    p_session_id: sessionId ?? null,
  });

  if (error) throw error;
  return data;
};
