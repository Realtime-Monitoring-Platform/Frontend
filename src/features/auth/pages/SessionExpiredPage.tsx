import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../../hooks/useAuth';

export const SessionExpiredPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Session Expired</CardTitle>
          <CardDescription>
            Your session has expired. Please sign in again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="warning">
            <AlertTitle>Session Expired</AlertTitle>
            <AlertDescription>
              Your session has expired. Please sign in again.
            </AlertDescription>
          </Alert>

          <p className="text-sm text-muted-foreground">
            You will be redirected to the login page in 5 seconds...
          </p>

          <Button className="w-full" onClick={() => navigate('/auth/login')}>
            Sign In Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
