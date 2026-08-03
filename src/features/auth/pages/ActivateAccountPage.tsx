import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { api } from '../../../services/api';
import { toast } from 'react-hot-toast';

export const ActivateAccountPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const activateAccount = async () => {
      try {
        if (!token) {
          setError('Invalid activation token');
          setLoading(false);
          return;
        }

        await api.post('/auth/activate', { token });
        toast.success('Account activated successfully!');
        setTimeout(() => navigate('/auth/login'), 2000);
      } catch (err) {
        setError('Failed to activate account. Token may be expired or invalid.');
        setLoading(false);
      }
    };

    activateAccount();
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">
            Account Activation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : (
            <>
              <Alert>
                <AlertDescription>
                  Activating your account...
                </AlertDescription>
              </Alert>
              <p className="text-center text-sm text-muted-foreground mt-2">
                Redirecting to login...
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
