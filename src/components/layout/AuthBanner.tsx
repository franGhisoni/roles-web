import { useQuery } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { rolesApi } from '@/api/roles.api';
import { ApiException } from '@/api/client';
import { config } from '@/lib/config';

export function AuthBanner() {
  const { error } = useQuery({
    queryKey: ['auth-probe'],
    queryFn: () => rolesApi.list({ page: 1, pageSize: 1 }),
    retry: false,
    refetchOnMount: false,
  });

  const missing = !config.apiToken;
  const unauthorized = error instanceof ApiException && error.status === 401;

  if (!missing && !unauthorized) return null;

  return (
    <div className="border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 lg:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <strong className="font-semibold">API auth misconfigured.</strong>{' '}
          {missing
            ? 'No VITE_API_TOKEN set at build time — every request will be rejected.'
            : 'Backend rejected the configured token. Check VITE_API_TOKEN matches API_TOKEN on the server.'}
        </div>
      </div>
    </div>
  );
}
