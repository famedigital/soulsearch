'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { AdminPwaRegister } from '@/components/admin/AdminPwaRegister';
import { useCompanyBrand } from '@/hooks/use-company-brand';
import { BrandMark } from '@/components/public/BrandMark';

function safeAdminRedirect(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith('/admin')) return null;
  if (raw.startsWith('//')) return null;
  return raw;
}

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const brand = useCompanyBrand();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const redirect = safeAdminRedirect(searchParams.get('redirect'));
        let destination = redirect || '/admin/dashboard';

        try {
          const setupRes = await fetch('/api/admin/setup', { credentials: 'same-origin' });
          if (setupRes.ok) {
            const setup = await setupRes.json();
            if (!setup.completed) {
              destination = '/admin/setup';
            }
          }
        } catch {
          /* fall through to dashboard/redirect */
        }

        router.push(destination);
        router.refresh();
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <BrandMark
              name={brand.name}
              logo={brand.logo}
              size="xl"
              showName={!brand.logo}
              className="justify-center"
            />
          </div>
          <h1 className="font-heading mb-2 text-3xl font-semibold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground">{brand.name}</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                  <AlertCircle className="size-5 shrink-0 text-destructive" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder=""
                    autoComplete="username"
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    key={showPassword ? 'text' : 'password'}
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="pr-10 pl-8"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute top-1/2 right-2.5 z-10 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input type="checkbox" className="size-4 rounded border-input" />
                  Remember me
                </label>
                <Link href="/admin/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password or login email?
                </Link>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Back to Website
              </Link>
            </div>

            <AdminPwaRegister />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted p-4">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
