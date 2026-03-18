import Link from 'next/link';

interface EmptyStateProps {
  emoji: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  emoji,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <span className="text-5xl mb-4">{emoji}</span>
      <h3 className="font-display font-bold text-lg text-cream mb-2">
        {title}
      </h3>
      <p className="text-text-2 text-sm mb-6 max-w-xs">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-fire to-ember px-6 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-fire/25 transition-all"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
