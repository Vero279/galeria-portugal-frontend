import { logger } from './logger';

export type AppError = {
  message: string;
  originalError?: unknown;
  context?: Record<string, unknown>;
};

export function handleError(error: unknown, context?: Record<string, unknown>): AppError {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(message, { error, context });

  // Return a safe error object – do not expose internal details to the user.
  return {
    message: 'Ocorreu um erro. Por favor, tente novamente mais tarde.',
    originalError: import.meta.env.DEV ? error : undefined,
    context,
  };
}

export function showUserError(message: string) {
  // In a real app, use a toast notification. For simplicity, we use alert.
  alert(message);
}

export async function safeAsync<T>(
  promise: Promise<T>,
  context?: Record<string, unknown>
): Promise<{ data: T | null; error: AppError | null }> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (err) {
    const error = handleError(err, context);
    showUserError(error.message);
    return { data: null, error };
  }
}