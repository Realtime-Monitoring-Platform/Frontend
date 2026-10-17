import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';
import AuthLayout from './AuthLayout';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmationPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmationPassword, {
    message: 'Passwords do not match',
    path: ['confirmationPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'Your new password must be different from your current password',
    path: ['newPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setError(null);

      await api.patch('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmationPassword: data.confirmationPassword,
      });

      setSuccess(true);

      // End the current session after a successful password change.
      window.setTimeout(async () => {
        try {
          await logout();
        } finally {
          navigate('/auth/login', { replace: true });
        }
      }, 2000);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response
          ?.data?.message;

      setError(
        message || 'Failed to change password. Please try again.'
      );
    }
  };

  const renderPasswordInput = (
    id: 'currentPassword' | 'newPassword' | 'confirmationPassword',
    label: string,
    placeholder: string,
    visible: boolean,
    toggleVisibility: () => void,
    autoFocus = false
  ) => {
    const fieldError = errors[id];

    return (
      <div className="space-y-2">
        <Label
          htmlFor={id}
          className="text-sm font-medium text-slate-700"
        >
          {label}
        </Label>

        <div className="relative">
          <Input
            id={id}
            type={visible ? 'text' : 'password'}
            placeholder={placeholder}
            autoComplete={
              id === 'currentPassword'
                ? 'current-password'
                : 'new-password'
            }
            autoFocus={autoFocus}
            disabled={success}
            className="h-12 rounded-lg border-slate-200 bg-white px-4 pr-12 shadow-sm focus-visible:ring-cyan-600"
            {...register(id)}
            aria-invalid={!!fieldError}
          />

          <button
            type="button"
            aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
            aria-pressed={visible}
            disabled={success}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 disabled:opacity-50"
            onClick={toggleVisibility}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {fieldError && (
          <p className="text-xs text-destructive">
            {fieldError.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8">
        <div
          className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl border shadow-sm ${
            success
              ? 'border-emerald-200 bg-emerald-50'
              : 'border-slate-200 bg-white'
          }`}
        >
          {success ? (
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          ) : (
            <KeyRound className="h-6 w-6 text-slate-800" />
          )}
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          {success ? 'Password updated' : 'Change your password'}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {success
            ? 'Your password has been changed successfully. You will be redirected to sign in.'
            : 'For your security, you must set a new password before accessing your monitoring dashboard.'}
        </p>
      </div>

      {/* Success message */}
      {success && (
        <Alert className="mb-6 border-emerald-200 bg-emerald-50 text-emerald-900">
          <ShieldCheck className="h-4 w-4" />
          <AlertDescription>
            Password changed successfully! Redirecting to sign in...
          </AlertDescription>
        </Alert>
      )}

      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Password form */}
      {!success && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {renderPasswordInput(
            'currentPassword',
            'Current password',
            'Enter your current password',
            showCurrent,
            () => setShowCurrent((previous) => !previous),
            true
          )}

          {renderPasswordInput(
            'newPassword',
            'New password',
            'Enter a new password',
            showNew,
            () => setShowNew((previous) => !previous)
          )}

          {renderPasswordInput(
            'confirmationPassword',
            'Confirm new password',
            'Confirm your new password',
            showConfirm,
            () => setShowConfirm((previous) => !previous)
          )}

          <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-700" />
            <div>
              <p className="text-sm font-medium text-slate-800">
                Keep your account secure
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Use at least 8 characters and choose a password different
                from your current one.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
          >
            {isSubmitting ? (
              'Updating password...'
            ) : (
              <span className="flex items-center justify-center gap-2">
                Update password
                <ArrowUpRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </form>
      )}

      {/* Security footer */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4" />
        Your account and device fleet are protected
      </div>
    </AuthLayout>
  );
};

export default ChangePasswordPage;