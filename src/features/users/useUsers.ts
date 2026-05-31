import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/users.api';

export const usersKeys = {
  all: ['users'] as const,
  list: () => [...usersKeys.all, 'list'] as const,
  detail: (id: string) => [...usersKeys.all, 'detail', id] as const,
  roles: (id: string) => [...usersKeys.all, 'roles', id] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.list(),
    queryFn: () => usersApi.list(),
  });
}

export function useUserRoles(userId: string | null) {
  return useQuery({
    queryKey: usersKeys.roles(userId ?? '_'),
    queryFn: () => usersApi.listRoles(userId as string),
    enabled: !!userId,
  });
}

export function useAssignRole(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => usersApi.assignRole(userId, roleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.roles(userId) });
      qc.invalidateQueries({ queryKey: ['liveness'] });
    },
  });
}

export function useUnassignRole(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (roleId: string) => usersApi.unassignRole(userId, roleId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: usersKeys.roles(userId) });
    },
  });
}
