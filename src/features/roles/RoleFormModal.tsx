import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { useCreateRole, useUpdateRole } from '@/features/roles/useRoles';
import { ApiException } from '@/api/client';
import type { Role, RoleScope, RoleType } from '@/types/api';

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'At least 2 characters')
    .max(60, 'At most 60 characters')
    .regex(/^[a-zA-Z0-9 _-]+$/, 'Only letters, numbers, spaces, _ and -'),
  description: z.string().trim().max(500).optional(),
  type: z.enum(['system', 'custom']),
  scope: z.enum(['global', 'organization', 'project']),
});

interface Props {
  open: boolean;
  onClose: () => void;
  role?: Role | null;
}

interface FormState {
  name: string;
  description: string;
  type: RoleType;
  scope: RoleScope;
}

const empty: FormState = {
  name: '',
  description: '',
  type: 'custom',
  scope: 'global',
};

export function RoleFormModal({ open, onClose, role }: Props) {
  const isEdit = !!role;
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const create = useCreateRole();
  const update = useUpdateRole();
  const busy = create.isPending || update.isPending;

  useEffect(() => {
    if (open) {
      setForm(
        role
          ? {
              name: role.name,
              description: role.description ?? '',
              type: role.type,
              scope: role.scope,
            }
          : empty,
      );
      setErrors({});
    }
  }, [open, role]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: typeof errors = {};
      for (const issue of parsed.error.issues) {
        next[issue.path[0] as keyof FormState] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    try {
      if (isEdit && role) {
        await update.mutateAsync({
          id: role.id,
          payload: {
            name: parsed.data.name,
            description: parsed.data.description || null,
            scope: parsed.data.scope,
            ...(role.type !== 'system' ? { type: parsed.data.type } : {}),
          },
        });
        toast.success(`Role "${parsed.data.name}" updated`);
      } else {
        await create.mutateAsync({
          name: parsed.data.name,
          description: parsed.data.description || null,
          type: parsed.data.type,
          scope: parsed.data.scope,
        });
        toast.success(`Role "${parsed.data.name}" created`);
      }
      onClose();
    } catch (err) {
      if (err instanceof ApiException) toast.error(err.message);
      else toast.error('Operation failed');
    }
  }

  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onClose}
      title={isEdit ? 'Edit role' : 'Create role'}
      description={
        isEdit
          ? 'Update the role definition. System roles have type locked.'
          : 'Define a new role. Name must be unique (case insensitive).'
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={busy} type="submit">
            {isEdit ? 'Save changes' : 'Create role'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          placeholder="e.g. Editor"
        />
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          error={errors.description}
          placeholder="Short summary of what this role can do"
        />
        <div className="grid grid-cols-2 gap-3">
          <Select
            label="Type"
            name="type"
            value={form.type}
            disabled={isEdit && role?.type === 'system'}
            onChange={(e) => setForm({ ...form, type: e.target.value as RoleType })}
            error={errors.type}
            hint={isEdit && role?.type === 'system' ? 'System roles cannot change type' : undefined}
          >
            <option value="custom">custom</option>
            <option value="system">system</option>
          </Select>
          <Select
            label="Scope"
            name="scope"
            value={form.scope}
            onChange={(e) => setForm({ ...form, scope: e.target.value as RoleScope })}
            error={errors.scope}
          >
            <option value="global">global</option>
            <option value="organization">organization</option>
            <option value="project">project</option>
          </Select>
        </div>
      </form>
    </Modal>
  );
}
