import { SwipeDeck } from '@/components/recipe/SwipeDeck';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

interface DiscoverPageProps {
  searchParams: Promise<{ country?: string }>;
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const { country } = await searchParams;

  let countryInfo: { name: string; flag: string } | null = null;
  if (country) {
    const supabase = await createClient();
    const { data } = await supabase
      .from('countries')
      .select('name, flag')
      .eq('code', country)
      .single();
    countryInfo = data;
  }

  return (
    <div className="min-h-screen bg-bg-base text-cream px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 max-w-sm mx-auto">
        <div>
          {countryInfo ? (
            <>
              <div className="flex items-center gap-2">
                <Link
                  href="/discover"
                  className="text-muted-custom text-sm hover:text-cream transition-colors"
                >
                  ← All
                </Link>
                <span className="text-muted-custom text-sm">•</span>
                <span className="text-sm text-cream font-medium">
                  {countryInfo.flag} {countryInfo.name}
                </span>
              </div>
              <h1 className="font-display font-bold text-xl text-cream mt-0.5">
                Discover <span className="text-muted-custom">•</span> {countryInfo.name} recipes
              </h1>
            </>
          ) : (
            <h1 className="font-display font-bold text-xl text-cream">
              Discover <span className="text-muted-custom">•</span> What&apos;s next?
            </h1>
          )}
        </div>
      </div>

      {/* Swipe deck */}
      <ErrorBoundary>
        <SwipeDeck country={country} />
      </ErrorBoundary>
    </div>
  );
}
