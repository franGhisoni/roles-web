import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Search } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { useRoles } from '@/features/roles/useRoles';
import { useAssignRole, useUserRoles } from '@/features/users/useUsers';
import { ApiException } from '@/api/client';
import type { User } from '@/types/api';

export function AssignRoleModal({
  open,
  onClose,
  user,
}: {
  open: boolean;
  onClose: () => void;
  user: User | null;
}) {
  const [search, setSearch] = useState('');
  const { data: rolesPage } = useRoles({
    page: 1,
    pageSize: 100,
    search: search.trim() || undefined,
  });
  const { data: assigned } = useUserRoles(user?.id ?? null);
  const assign = useAssignRole(user?.id ?? '');

  const assignedIds = useMemo(
    () => new Set((assigned?.data ?? []).map((a) => a.roleId)),
    [assigned],
  );
  const available = (rolesPage?.data ?? []).filter((r) => !assignedIds.has(r.id));

  async function handleAssign(roleId: string, roleName: string) {
    try {
      await assign.mutateAsync(roleId);
      toast.success(`Assigned "${roleName}"`);
    } catch (err) {
      if (err instanceof ApiException) toast.error(err.message);
      else toast.error('Assign failed');
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={user ? `Assign roles to ${user.fullName}` : 'Assign roles'}
      description="Pick a role from the catalog. Already-assigned roles are hidden."
      size="lg"
      footer={
        <Button variant="ghost" onClick={onClose}>
          Done
        </Button>
      }
    >
      <div className="space-y-4">
        <Input
          placeholder="Search roles…"
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="max-h-80 overflow-y-auto rounded-lg border border-slate-800">
          {available.length === 0 ? (
            <EmptyState
              title="No roles available"
              description="All matching roles are already assigned to this user."
              className="border-0"
            />
          ) : (
            <ul className="divide-y divide-slate-800">
              {available.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-100">{r.name}</span>
                      <Badge tone={r.type === 'system' ? 'warning' : 'brand'}>
                        {r.type}
                      </Badge>
                      <Badge tone="info">{r.scope}</Badge>
                    </div>
                    {r.description && (
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    loading={assign.isPending && assign.variables === r.id}
                    onClick={() => handleAssign(r.id, r.name)}
                  >
                    Assign
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
}
