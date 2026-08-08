import { Card, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';

 const AuditLogsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-sm text-muted-foreground">Track all system activities</p>
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <History className="mx-auto mb-4 h-16 w-16 text-primary" />
          <h2 className="text-xl font-semibold">Audit Trail</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This page will display all audit logs with filtering and export capabilities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogsPage;