import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

 const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <ShieldAlert className="mx-auto mb-6 h-16 w-16 text-destructive" />

          <Alert variant="destructive" className="mb-6 text-left">
            <AlertTitle>Access Forbidden</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page. Please contact your administrator if you believe this is an error.
            </AlertDescription>
          </Alert>

          <Button size="lg" onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForbiddenPage;