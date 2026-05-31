import { useMemo, useState } from 'react';
import { Pencil, Plus, Search, ShieldCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PageLoader } from '@/components/ui/Spinner';
import { TD, TH, THead, TR, Table } from '@/components/ui/Table';
import { useDeleteRole, useRoles } from '@/features/roles/useRoles';
import { RoleFormModal } from '@/features/roles/RoleFormModal';
import { ApiException } from '@/api/client';
import type { Role, RoleScope, RoleType } from '@/types/api';

export default function RolesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'' | RoleType>('');
  const [scope, setScope] = useState<'' | RoleScope>('');
  const pageSize = 10;

  const params = useMemo(
    () => ({
      page,
      pageSize,
      search: search.trim() || undefined,
      type: (type || undefined) as RoleType | undefined,
      scope: (scope || undefined) as RoleScope | undefined,
    }),
    [page, search, type, scope],
  );

  const { data, isLoading, isError, error, isFetching } = useRoles(params);

  const [editing, setEditing] = useState<Role | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleting, setDeleting] = useState<Role | null>(null);
  const remove = useDeleteRole();

  async function handleDelete() {
    if (!deleting) return;
    try {
      await remove.mutateAsync(deleting.id);
      toast.success(`Role "${deleting.name}" deleted`);
      setDeleting(null);
    } catch (err) {
      if (err instanceof ApiException) toast.error(err.message);
      else toast.error('Delete failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roles</h1>
          <p className="mt-1 text-sm text-slate-400">
            {data?.meta.total ?? 0} role{(data?.meta.total ?? 0) === 1 ? '' : 's'} defined.
            System roles are locked.
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          New role
        </Button>
      </div>

      <Card>
        <CardHeader
          title="All roles"
          description="Search by name or description, filter by type/scope."
        />
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Input
              placeholder="Search roles…"
              leftIcon={<Search className="h-4 w-4" />}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="sm:col-span-2"
            />
            <Select
              value={type}
              onChange={(e) => {
                setType(e.target.value as RoleType | '');
                setPage(1);
              }}
            >
              <option value="">All types</option>
              <option value="system">system</option>
              <option value="custom">custom</option>
            </Select>
            <Select
              value={scope}
              onChange={(e) => {
                setScope(e.target.value as RoleScope | '');
                setPage(1);
              }}
            >
              <option value="">All scopes</option>
              <option value="global">global</option>
              <option value="organization">organization</option>
              <option value="project">project</option>
            </Select>
          </div>

          {isLoading ? (
            <PageLoader />
          ) : isError ? (
            <EmptyState
              icon={<ShieldCheck className="h-8 w-8" />}
              title="Couldn't load roles"
              description={(error as Error)?.message}
            />
          ) : (data?.data.length ?? 0) === 0 ? (
            <EmptyState
              icon={<ShieldCheck className="h-8 w-8" />}
              title="No roles match your filters"
              description="Try clearing the search or filters."
            />
          ) : (
            <>
              <Table>
                <THead>
                  <TR>
                    <TH>Name</TH>
                    <TH>Description</TH>
                    <TH>Type</TH>
                    <TH>Scope</TH>
                    <TH className="text-right">Actions</TH>
                  </TR>
                </THead>
                <tbody>
                  {data!.data.map((r) => (
                    <TR key={r.id}>
                      <TD>
                        <div className="font-medium text-slate-100">{r.name}</div>
                        <div className="font-mono text-[10px] text-slate-600">{r.id.slice(0, 8)}…</div>
                      </TD>
                      <TD className="max-w-xs truncate">{r.description ?? '—'}</TD>
                      <TD>
                        <Badge tone={r.type === 'system' ? 'warning' : 'brand'}>{r.type}</Badge>
                      </TD>
                      <TD>
                        <Badge tone="info">{r.scope}</Badge>
                      </TD>
                      <TD className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Pencil className="h-3.5 w-3.5" />}
                            onClick={() => setEditing(r)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={r.type === 'system'}
                            leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                            onClick={() => setDeleting(r)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TD>
                    </TR>
                  ))}
                </tbody>
              </Table>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <div>
                  Page {data!.meta.page} of {data!.meta.totalPages} · {data!.meta.total} total
                  {isFetching && <span className="ml-2 text-slate-600">updating…</span>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= data!.meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <RoleFormModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <RoleFormModal open={!!editing} onClose={() => setEditing(null)} role={editing} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete role"
        description={
          <>
            Delete role <span className="font-medium text-slate-100">"{deleting?.name}"</span>?
            All current assignments to this role will be removed too.
          </>
        }
        confirmLabel="Delete"
        destructive
        loading={remove.isPending}
      />
    </div>
  );
}
