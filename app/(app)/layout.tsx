import { AppNav } from '@/components/layout/AppNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { AuthPromptModal } from '@/components/auth/AuthPromptModal';
import { NavigationProgress } from '@/components/ui/NavigationProgress';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavigationProgress />
      <AppNav />
      <main className="min-h-screen pb-16 md:pb-0">{children}</main>
      <BottomNav />
      <AuthPromptModal />
    </>
  );
}
