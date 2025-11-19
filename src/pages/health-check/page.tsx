import { useQuery } from '@tanstack/react-query';
import { healthCheck } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Activity } from 'lucide-react';
import { Loading, Error } from '@/components/custom';

export default function HealthCheck() {
  const {
    data: healthResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['health'],
    queryFn: healthCheck,
  });

  const healthData = healthResponse?.data;
  const isHealthy = healthResponse?.success && healthData?.ok;

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (isLoading) return <Loading message='Checking system health...' />;
  if (error)
    return (
      <Error
        title='Health Check Failed'
        message='Unable to connect to the system.'
      />
    );

  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold flex items-center gap-2'>
          <Activity className='h-8 w-8' />
          System Health
        </h1>
        <p className='text-muted-foreground'>
          Monitor system status and performance
        </p>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              {isHealthy ? (
                <CheckCircle className='h-5 w-5 text-green-600' />
              ) : (
                <XCircle className='h-5 w-5 text-red-600' />
              )}
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium'>API Status</span>
                <Badge variant={isHealthy ? 'default' : 'destructive'}>
                  {isLoading
                    ? 'Checking...'
                    : isHealthy
                      ? 'Healthy'
                      : 'Unhealthy'}
                </Badge>
              </div>

              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium'>Version</span>
                <Badge variant='outline'>
                  {healthData?.version || 'Unknown'}
                </Badge>
              </div>

              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium'>Environment</span>
                <Badge
                  variant={
                    healthData?.environment === 'production'
                      ? 'default'
                      : 'secondary'
                  }
                >
                  {healthData?.environment || 'Unknown'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium'>Server Uptime</span>
                <span className='text-sm font-mono'>
                  {healthData?.uptime
                    ? formatUptime(healthData.uptime)
                    : 'Unknown'}
                </span>
              </div>

              <div className='flex justify-between items-center'>
                <span className='text-sm font-medium'>Server Time</span>
                <span className='text-sm'>
                  {healthData?.timestamp
                    ? new Date(healthData.timestamp).toLocaleString()
                    : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
