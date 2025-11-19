import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { getLinks, createLink, deleteLink } from '@/api';
import { type Link, type CreateLinkRequest } from '@/api/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Search, Trash2, Eye, Activity } from 'lucide-react';
import { Loading, Error } from '@/components/custom';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const columnHelper = createColumnHelper<Link>();

export default function Dashboard() {
  const [globalFilter, setGlobalFilter] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newLink, setNewLink] = useState<CreateLinkRequest>({
    targetUrl: '',
    code: '',
  });
  const [urlError, setUrlError] = useState('');
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: linksResponse, isLoading, error } = useQuery({
    queryKey: ['links'],
    queryFn: getLinks,
  });

  const createMutation = useMutation({
    mutationFn: createLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      setIsAddDialogOpen(false);
      setNewLink({ targetUrl: '', code: '' });
      toast.success('Link created successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to create link');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to delete link');
    },
  });

  const columns = [
    columnHelper.accessor('code', {
      header: 'Short Code',
      cell: info => (
        <Badge variant='secondary' className='font-mono'>
          {info.getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor('targetUrl', {
      header: 'Target URL',
      cell: info => (
        <div className='max-w-xs truncate' title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('clicks', {
      header: 'Total Clicks',
      cell: info => <Badge variant='outline'>{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('lastClicked', {
      header: 'Last Clicked',
      cell: info => {
        const value = info.getValue();
        return value ? new Date(value).toLocaleString() : 'Never';
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' size='sm' className='cursor-pointer'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => navigate(`/code/${info.row.original.code}`)}
              className='cursor-pointer'
            >
              <Eye className='h-4 w-4 mr-2' />
              View Stats
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => deleteMutation.mutate(info.row.original.code)}
              className='text-red-600 cursor-pointer'
            >
              <Trash2 className='h-4 w-4 mr-2' />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ];

  const links = linksResponse?.data ?? [];
  
  const table = useReactTable({
    data: links,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError('URL is required');
      return false;
    }
    
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setUrlError('URL must start with http:// or https://');
        return false;
      }
      if (!urlObj.hostname || urlObj.hostname.length < 3) {
        setUrlError('Please enter a valid domain');
        return false;
      }
      setUrlError('');
      return true;
    } catch {
      setUrlError('Please enter a valid URL');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUrl(newLink.targetUrl)) return;
    
    createMutation.mutate({
      targetUrl: newLink.targetUrl,
      ...(newLink.code && { code: newLink.code }),
    });
  };

  if (isLoading) return <Loading message="Loading your links..." />;
  if (error) return <Error onRetry={() => queryClient.invalidateQueries({ queryKey: ['links'] })} />;



  return (
    <div className='container mx-auto p-6'>
      <div className='mb-6 flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>TinyLink Dashboard</h1>
        <Button 
          variant='outline' 
          onClick={() => navigate('/healthz')}
          className='cursor-pointer'
        >
          <Activity className='h-4 w-4 mr-2' />
          Check App Health
        </Button>
      </div>
      <Card>
        <CardHeader>
          <div className='flex justify-between items-center'>
            <CardTitle>Dashboard</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className='cursor-pointer'>
                  <Plus className='h-4 w-4 mr-2' />
                  Add Link
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Link</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                    <label className='text-sm font-medium'>Target URL</label>
                    <Input
                      placeholder='https://example.com'
                      value={newLink.targetUrl}
                      onChange={e => {
                        setNewLink({ ...newLink, targetUrl: e.target.value });
                        if (urlError) setUrlError('');
                      }}
                      className={urlError ? 'border-red-500' : ''}
                      required
                    />
                    {urlError && (
                      <p className='text-sm text-red-500 mt-1'>{urlError}</p>
                    )}
                  </div>
                  <div>
                    <label className='text-sm font-medium'>Custom Code</label>
                    <Input
                      placeholder='Abc123'
                      value={newLink.code}
                      onChange={e =>
                        setNewLink({ ...newLink, code: e.target.value })
                      }
                    />
                  </div>
                  <Button type='submit' disabled={createMutation.isPending} className='cursor-pointer'>
                    {createMutation.isPending ? 'Creating...' : 'Create Link'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className='mb-4'>
            <div className='relative'>
              <Search className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search by code or URL...'
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {globalFilter ? 'No links match your search.' : 'No links found. Create your first link!'}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </CardContent>
      </Card>
    </div>
  );
}
