import { useQuery } from '@tanstack/react-query';
import { healthApi } from '@/api/health.api';
import { Badge } from '@/components/ui/Badge';

export function Header() {
  const { data, isError } = useQuery({
    queryKey: ['liveness'],
    queryFn: () => healthApi.liveness(),
    refetchInterval: 15_000,
    refetchIntervalInBackground: false,
  });
  const online = !!data && !isError;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 backdrop-blur lg:px-6">
      <Badge tone={online ? 'success' : 'danger'}>
        <span
          className={
            'inline-block h-1.5 w-1.5 rounded-full ' +
            (online ? 'bg-emerald-400 animate-pulse_dot' : 'bg-red-400')
          }
        />
        {online ? 'API connected' : 'API unreachable'}
      </Badge>
    </header>
  );
}
