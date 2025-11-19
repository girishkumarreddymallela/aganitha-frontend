import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getLinkStats } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Copy, BarChart3 } from 'lucide-react';
import { Loading, Error } from '@/components/custom';

export default function Statistic() {
  const { code } = useParams<{ code: string }>();

  const { data: statsResponse, isLoading, error } = useQuery({
    queryKey: ['linkStats', code],
    queryFn: () => getLinkStats(code!),
    enabled: !!code,
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) return <Loading message="Loading link statistics..." />;
  if (error) return <Error title="Failed to load statistics" onRetry={() => window.location.reload()} />;
  if (!statsResponse?.success) {
    return <Error title="Link Not Found" message="The requested link does not exist." />;
  }

  const stats = statsResponse.data!;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart3 className="h-8 w-8" />
          Link Statistics
        </h1>
        <p className="text-muted-foreground">Detailed analytics for your shortened link</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Link Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Short Code</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="font-mono text-base px-3 py-1">
                  {stats.code}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(stats.code)}
                  className="cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Short URL</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-muted px-2 py-1 rounded text-sm flex-1">
                  {stats.shortenUrl}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(stats.shortenUrl)}
                  className="cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Target URL</label>
              <div className="flex items-center gap-2 mt-1">
                <code className="bg-muted px-2 py-1 rounded text-sm flex-1 truncate">
                  {stats.targetUrl}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(stats.targetUrl, '_blank')}
                  className="cursor-pointer"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Total Clicks</label>
              <div className="mt-1">
                <Badge variant="outline" className="text-2xl px-4 py-2">
                  {stats.clicks.toLocaleString()}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Last Clicked</label>
              <div className="mt-1">
                <p className="text-sm">
                  {stats.lastClicked
                    ? new Date(stats.lastClicked).toLocaleString()
                    : 'Never clicked'}
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Created</label>
              <div className="mt-1">
                <p className="text-sm">
                  {new Date(stats.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
