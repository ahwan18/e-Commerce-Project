/**
 * Loading Component
 *
 * Simple loading spinner component.
 * You CAN modify the animation and styles.
 */

export const Loading = ({ message = 'Memuat...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[320px]" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-b-blue-600"></div>
      <p className="mt-4 text-slate-600 text-base">{message}</p>
    </div>
  );
};
