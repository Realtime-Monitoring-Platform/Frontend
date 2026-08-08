import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../../services/api';

 const AIDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState<any>(null);

  useEffect(() => {
    fetchAIData();
  }, []);

  const fetchAIData = async () => {
    try {
      const response = await api.get('/ai/dashboard');
      setHealthScore(response.data);
    } catch (err) {
      setError('Failed to load AI insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const insights = [
    {
      title: 'Predictive Maintenance',
      count: 3,
      description: 'Devices requiring attention',
      icon: <TrendingUp className="h-5 w-5" />,
      color: '#1976d2',
    },
    {
      title: 'Failure Prediction',
      count: 2,
      description: 'High risk devices',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: '#dc004e',
    },
    {
      title: 'Recommendations',
      count: 5,
      description: 'AI suggestions',
      icon: <Lightbulb className="h-5 w-5" />,
      color: '#ed6c02',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Dashboard</h1>
        <p className="text-sm text-muted-foreground">AI-powered insights and predictions</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full border-8"
              style={{ borderColor: '#1976d2' }}
            >
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {healthScore?.overall || 87}
                </p>
                <p className="text-xs text-muted-foreground">/100</p>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold">Overall Health Score</h2>
              <p className="text-sm text-muted-foreground">
                Device Health: {healthScore?.categories?.deviceHealth || 90}/100
              </p>
              <p className="text-sm text-muted-foreground">
                Performance: {healthScore?.categories?.performance || 85}/100
              </p>
              <p className="text-sm text-muted-foreground">
                Security: {healthScore?.categories?.security || 88}/100
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center gap-2">
                <div
                  className="rounded-lg p-2"
                  style={{ backgroundColor: `${insight.color}20`, color: insight.color }}
                >
                  {insight.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{insight.count}</p>
                  <p className="text-xs text-muted-foreground">{insight.title}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                { day: 'Mon', score: 85 },
                { day: 'Tue', score: 87 },
                { day: 'Wed', score: 86 },
                { day: 'Thu', score: 88 },
                { day: 'Fri', score: 87 },
                { day: 'Sat', score: 89 },
                { day: 'Sun', score: 87 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#1976d2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIDashboardPage;