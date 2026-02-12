"use client";

import { Sidebar } from '@/components/Sidebar';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/auth-context';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const resendVerificationEmail = async () => {
    try {
      const response = await api.post('/email/resend-verification-email');
      if (response.status === 200) {
        toast.success('Verification email sent successfully');
      }
    } catch (error) {
      toast.error('Failed to send verification email');
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-propulsion-orange border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null; // Will be handled by the context redirect
  }

  if (!user.is_email_verified) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="max-w-md w-full p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-foreground">Verify your email</h1>
            <p className="text-muted-foreground font-medium tracking-tight">
              We've sent a verification link to <span className="text-foreground font-bold">{user.email}</span>. Please check your inbox to continue.
            </p>
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              onClick={resendVerificationEmail}
              variant="orange"
              className="w-full py-6 rounded-2xl font-bold uppercase tracking-widest text-xs"
            >
              Resend verification email
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="ghost"
              className="w-full py-6 rounded-2xl font-bold text-muted-foreground hover:text-foreground"
            >
              I've verified my email
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground selection:bg-propulsion-orange/30 selection:text-white overflow-hidden">
      <div className="fixed inset-0 propulsion-gradient opacity-[0.05] pointer-events-none" />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <Navbar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar p-6 lg:p-10 bg-background/50">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
