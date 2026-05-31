import { useQuery } from '@tanstack/react-query';
import { Activity, AlertCircle, CheckCircle2, Cpu, MemoryStick, Server } from 'lucide-react';
import { healthApi } from '@/api/health.api';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { PageLoader } from '@/components/ui/Spinner';

function Metric({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
      <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500">
        {icon}
        {label}
      </div>
      <div className="text-lg font-medium text-slate-100">{value}</div>
      {hint && <div className="mt-0.5 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

function MemoryBar({ used, total }: { used: number; total: number }) {
  const pct = Math.min(100, Math.round((used / total) * 100));
  return (
    <div className="mt-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-brand-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-slate-500">
        <span>{used.toFixed(1)} MB used</span>
        <span>{total.toFixed(1)} MB total</span>
      </div>
    </div>
  );
}

export default function StatusPage() {
  const { data, isLoading, isError, dataUpdatedAt } = useQuery({
    queryKey: ['status'],
    queryFn: () => healthApi.status(),
    refetchInterval: 3_000,
    refetchIntervalInBackground: true,
  });

  if (isLoading) return <PageLoader />;
  if (isError || !data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold tracking-tight">Status</h1>
        <Card>
          <CardBody className="flex items-center gap-3 text-red-300">
            <AlertCircle className="h-5 w-5" />
            API unreachable
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Status</h1>
          <p className="mt-1 text-sm text-slate-400">
            Live snapshot — refreshes every 3 seconds.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse_dot"
            aria-hidden
          />
          Last poll {new Date(dataUpdatedAt).toLocaleTimeString()}
        </div>
      </div>

      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>{data.service}</span>
              <Badge tone="success">{data.status}</Badge>
              <Badge tone="neutral">v{data.version}</Badge>
              <Badge tone="info">{data.env}</Badge>
            </div>
          }
          description={`Started ${new Date(data.startedAt).toLocaleString()}`}
        />
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric
              icon={<Activity className="h-3 w-3" />}
              label="Uptime"
              value={data.uptime.human}
              hint={`${(data.uptime.ms / 1000).toFixed(0)} seconds`}
            />
            <Metric
              icon={<Server className="h-3 w-3" />}
              label="Runtime"
              value={`Node ${data.runtime.node}`}
              hint={`${data.runtime.platform}/${data.runtime.arch} · pid ${data.runtime.pid}`}
            />
            <Metric
              icon={<Cpu className="h-3 w-3" />}
              label="RSS Memory"
              value={`${data.memory.rssMb.toFixed(1)} MB`}
            />
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <MemoryStick className="h-5 w-5 text-slate-400" /> Heap
              </span>
            }
            description="Node.js V8 heap usage"
          />
          <CardBody>
            <div className="text-3xl font-semibold tracking-tight">
              {data.memory.heapUsedMb.toFixed(1)}{' '}
              <span className="text-base font-normal text-slate-500">
                / {data.memory.heapTotalMb.toFixed(1)} MB
              </span>
            </div>
            <MemoryBar used={data.memory.heapUsedMb} total={data.memory.heapTotalMb} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Entity counts" description="Live from the persistence layer." />
          <CardBody>
            <div className="grid grid-cols-3 gap-3">
              <Metric label="Roles" value={data.counts.roles} />
              <Metric label="Users" value={data.counts.users} />
              <Metric label="Assignments" value={data.counts.assignments} />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
