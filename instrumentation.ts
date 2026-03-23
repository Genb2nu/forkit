/**
 * Next.js instrumentation hook — runs once when the server starts.
 * We configure the global undici dispatcher to skip TLS cert verification
 * so that API routes can reach Supabase through corporate TLS-inspection proxies.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setGlobalDispatcher, Agent } = await import('undici');
    setGlobalDispatcher(
      new Agent({
        connect: { rejectUnauthorized: false },
      })
    );
  }
}
