import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../../services/api';
import { toast } from 'react-hot-toast';
import AuthLayout from './AuthLayout';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await api.post('/auth/forgot-password', data);

      setSubmittedEmail(data.email);
      setSuccess(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset link. Please try again.');
    }
  };

  return (
    <AuthLayout>
      {!success ? (
        <>
          {/* Heading */}
          <div className="mb-9">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm">
              <Mail className="h-6 w-6 text-slate-800" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Reset your password
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Forgot your password? No problem. Enter the email address
              associated with your account and we'll send you instructions
              to reset it.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-slate-700"
              >
                Work email
              </Label>

              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                autoFocus
                className="h-12 rounded-lg border-slate-200 bg-white px-4 shadow-sm focus-visible:ring-cyan-600"
                {...register('email')}
                aria-invalid={!!errors.email}
              />

              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              {isSubmitting ? (
                'Sending reset link...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Send reset link
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Back to login */}
          <div className="mt-8 text-center">
            <RouterLink
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-cyan-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </RouterLink>
          </div>
        </>
      ) : (
        <>
          {/* Success state */}
          <div className="mb-9">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50">
              <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              Check your inbox
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              If the address is associated with an account, password reset
              instructions will be sent to:
            </p>

            <p className="mt-3 break-all font-medium text-slate-900">
              {submittedEmail}
            </p>
          </div>

          <Alert className="border-emerald-200 bg-emerald-50 text-emerald-900">
            <AlertDescription>
              Check your inbox and spam folder for the password reset email.
              Follow the instructions in the email to continue.
            </AlertDescription>
          </Alert>

          <Button
            type="button"
            onClick={() => {
              setSuccess(false);
              setSubmittedEmail('');
            }}
            className="mt-6 h-12 w-full rounded-lg bg-slate-900 font-semibold text-white hover:bg-slate-800"
          >
            Try another email
          </Button>

          <div className="mt-8 text-center">
            <RouterLink
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-cyan-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </RouterLink>
          </div>
        </>
      )}

      {/* Security footer for this form */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4" />
        Your account security matters to us
      </div>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;