import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock } from 'lucide-react';

 const UnauthorizedPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/auth/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <Lock className="mx-auto mb-6 h-16 w-16 text-warning" />

          <Alert variant="default" className="mb-6 text-left">
            <AlertTitle>Unauthorized Access</AlertTitle>
            <AlertDescription>
              Please sign in to access this page.
            </AlertDescription>
          </Alert>

          <p className="mb-6 text-sm text-muted-foreground">
            You will be redirected to the login page in 5 seconds...
          </p>

          <Button size="lg" onClick={() => navigate('/auth/login')}>
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};


export default UnauthorizedPage;