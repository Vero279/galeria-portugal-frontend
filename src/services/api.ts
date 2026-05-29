import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import { handleError } from '../utils/errorHandler';

type TableName = keyof typeof supabase.from;

export async function fetchFromTable<T>(
  table: TableName,
  query: (q: ReturnType<typeof supabase.from>) => Promise<{ data: T[] | null; error: any }>
): Promise<T[]> {
  try {
    const { data, error } = await query(supabase.from(table));
    if (error) throw error;
    return (data as T[]) || [];
  } catch (err) {
    logger.error(`Error fetching from ${table}`, err);
    throw handleError(err, { table });
  }
}

export async function fetchSingleFromTable<T>(
  table: TableName,
  query: (q: ReturnType<typeof supabase.from>) => Promise<{ data: T | null; error: any }>
): Promise<T | null> {
  try {
    const { data, error } = await query(supabase.from(table));
    if (error) throw error;
    return data;
  } catch (err) {
    logger.error(`Error fetching single from ${table}`, err);
    throw handleError(err, { table });
  }
}

// Additional helper for inserts/updates can be added as needed.