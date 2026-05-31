import { useMemo, useState } from 'react';
import { Search, ShieldPlus, UserX, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { PageLoader } from '@/components/ui/Spinner';
import { TD, TH, THead, TR, Table } from '@/components/ui/Table';
import { useUnassignRole, useUserRoles, useUsers } from '@/features/users/useUsers';
import { AssignRoleModal } from '@/features/users/AssignRoleModal';
import { ApiException } from '@/api/client';
import type { User } from '@/types/api';

function UserRoles({ user }: { user: User }) {
  const { data, isLoading } = useUserRoles(user.id);
  const unassign = useUnassignRole(user.id);

  async function handleRemove(roleId: string, name: string) {
    try {
      await unassign.mutateAsync(roleId);
      toast.success(`Removed "${name}" from ${user.fullName}`);
    } catch (err) {
      if (err instanceof ApiException) toast.error(err.message);
      else toast.error('Unassign failed');
    }
  }

  if (isLoading) return <span className="text-xs text-slate-500">Loading…</span>;
  if (!data || data.data.length === 0)
    return <span className="text-xs text-slate-500">No roles assigned</span>;

  return (
    <div className="flex flex-wrap gap-1.5">
      {data.data.map((a) => (
        <span
          key={a.id}
          className="group inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-0.5 text-xs text-brand-200 ring-1 ring-inset ring-brand-500/30"
        >
          {a.role.name}
          <button
            onClick={() => handleRemove(a.roleId, a.role.name)}
            className="rounded-full p-0.5 text-brand-300/70 hover:bg-brand-500/20 hover:text-brand-100"
            title="Remove role"
            disabled={unassign.isPending}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
    </div>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [assigningTo, setAssigningTo] = useState<User | null>(null);
  const { data, isLoading, isError } = useUsers();

  const filtered = useMemo(() => {
    const list = data?.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q),
    );
  }, [data, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage role assignments. Users are seeded — assignments are persisted.
        </p>
      </div>

      <Card>
        <CardHeader title="Directory" description={`${data?.meta?.total ?? 0} users seeded.`} />
        <CardBody className="space-y-4">
          <Input
            placeholder="Search by name or email…"
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {isLoading ? (
            <PageLoader />
          ) : isError ? (
            <EmptyState
              icon={<UserX className="h-8 w-8" />}
              title="Couldn't load users"
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<Search className="h-8 w-8" />}
              title="No users match"
              description="Try a different search term."
            />
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>User</TH>
                  <TH>Status</TH>
                  <TH>Roles</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <tbody>
                {filtered.map((u) => (
                  <TR key={u.id}>
                    <TD>
                      <div className="flex items-center gap-3">
                        {u.avatarUrl ? (
                          <img
                            src={u.avatarUrl}
                            alt=""
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700"
                          />
                        ) : (
                          <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-xs text-slate-400">
                            {u.fullName
                              .split(' ')
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-slate-100">{u.fullName}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </div>
                      </div>
                    </TD>
                    <TD>
                      <Badge tone={u.active ? 'success' : 'danger'}>
                        {u.active ? 'active' : 'inactive'}
                      </Badge>
                    </TD>
                    <TD className="max-w-xl">
                      <UserRoles user={u} />
                    </TD>
                    <TD className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<ShieldPlus className="h-3.5 w-3.5" />}
                        onClick={() => setAssigningTo(u)}
                        disabled={!u.active}
                      >
                        Assign role
                      </Button>
                    </TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <AssignRoleModal
        open={!!assigningTo}
        onClose={() => setAssigningTo(null)}
        user={assigningTo}
      />
    </div>
  );
}
