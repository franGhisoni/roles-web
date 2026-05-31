import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Activity, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import { healthApi } from '@/api/health.api';
import { rolesApi } from '@/api/roles.api';
import { usersApi } from '@/api/users.api';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

function StatCard({
  to,
  icon,
  label,
  value,
  hint,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="card-hover group flex items-center justify-between px-5 py-5"
    >
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight">{value}</div>
        {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
      </div>
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-brand-500/10 text-brand-300 ring-1 ring-inset ring-brand-500/30 transition group-hover:scale-105">
        {icon}
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const status = useQuery({
    queryKey: ['status'],
    queryFn: () => healthApi.status(),
    refetchInterval: 10_000,
  });

  const roles = useQuery({
    queryKey: ['roles-dashboard'],
    queryFn: () => rolesApi.list({ page: 1, pageSize: 5 }),
  });

  const users = useQuery({
    queryKey: ['users-dashboard'],
    queryFn: () => usersApi.list(),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            Live snapshot of your RBAC universe.
          </p>
        </div>
        <Badge tone={status.data ? 'success' : 'danger'}>
          {status.data ? 'online' : 'unreachable'}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          to="/roles"
          icon={<ShieldCheck className="h-6 w-6" />}
          label="Roles"
          value={status.data?.counts.roles ?? '—'}
          hint="Click to manage"
        />
        <StatCard
          to="/users"
          icon={<Users className="h-6 w-6" />}
          label="Users"
          value={status.data?.counts.users ?? '—'}
          hint={`${status.data?.counts.assignments ?? 0} assignments`}
        />
        <StatCard
          to="/status"
          icon={<Activity className="h-6 w-6" />}
          label="Uptime"
          value={status.data?.uptime.human ?? '—'}
          hint={status.data ? `node ${status.data.runtime.node}` : ''}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Recent roles"
            description="Latest entries from the catalog."
            action={
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight className="h-4 w-4" />}
                onClick={() => null}
              >
                <Link to="/roles">View all</Link>
              </Button>
            }
          />
          <CardBody>
            <ul className="divide-y divide-slate-800">
              {(roles.data?.data ?? []).slice(0, 5).map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-slate-100">{r.name}</div>
                    <div className="text-xs text-slate-500">{r.description ?? '—'}</div>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge tone={r.type === 'system' ? 'warning' : 'brand'}>{r.type}</Badge>
                    <Badge tone="info">{r.scope}</Badge>
                  </div>
                </li>
              ))}
              {(roles.data?.data.length ?? 0) === 0 && (
                <li className="py-6 text-center text-sm text-slate-500">No roles yet</li>
              )}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Users at a glance"
            description="Click into Users to manage role assignments."
          />
          <CardBody>
            <ul className="divide-y divide-slate-800">
              {(users.data?.data ?? []).slice(0, 5).map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-3">
                  {u.avatarUrl ? (
                    <img
                      src={u.avatarUrl}
                      alt=""
                      className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-800" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-100">{u.fullName}</div>
                    <div className="truncate text-xs text-slate-500">{u.email}</div>
                  </div>
                  <Badge tone={u.active ? 'success' : 'danger'}>
                    {u.active ? 'active' : 'inactive'}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
