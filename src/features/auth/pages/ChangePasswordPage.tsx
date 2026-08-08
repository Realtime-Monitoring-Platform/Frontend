import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../hooks/useAuth';
import { api } from '../../../services/api';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmationPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmationPassword, {
    message: 'Passwords do not match',
    path: ['confirmationPassword'],
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
      console.log(api.defaults.headers.common['Authorization']  );
      console.log('Submitting change password form with data:', data);
    
      await api.patch('/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmationPassword: data.confirmationPassword,
      }).then((response) => { 
      console.log("Change password response:", response.headers.getAuthorization);
      })
      
      
      setSuccess(true);
      setTimeout(() => {
        logout();
        navigate('/auth/login');
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">Change Your Password</CardTitle>
          <CardDescription>
            For security reasons, you must set a new password on your first login.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-4 border-green-600 text-green-600">
              <ShieldCheck className="h-4 w-4" />
              <AlertDescription>
                Password changed successfully! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Enter your current password"
                  autoFocus
                  {...register('currentPassword')}
                  aria-invalid={!!errors.currentPassword}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNew ? 'text' : 'password'}
                  placeholder="Enter a new password"
                  {...register('newPassword')}
                  aria-invalid={!!errors.newPassword}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-destructive">{errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmationPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmationPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  {...register('confirmationPassword')}
                  aria-invalid={!!errors.confirmationPassword}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.confirmationPassword && (
                <p className="text-xs text-destructive">{errors.confirmationPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};


export default ChangePasswordPage;