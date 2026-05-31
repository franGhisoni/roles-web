export type RoleType = 'system' | 'custom';
export type RoleScope = 'global' | 'organization' | 'project';

export interface Role {
  id: string;
  name: string;
  description: string | null;
  type: RoleType;
  scope: RoleScope;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  active: boolean;
  createdAt: string;
}

export interface Assignment {
  id: string;
  userId: string;
  roleId: string;
  assignedAt: string;
  assignedBy: string | null;
}

export interface AssignmentWithRole extends Assignment {
  role: Role;
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  data: T[];
  meta: Pagination;
}

export interface ListResponse<T> {
  data: T[];
  meta?: { total: number };
}

export interface ItemResponse<T> {
  data: T;
}

export interface ApiError {
  error: { code: string; message: string; details?: Record<string, unknown> };
  requestId?: string;
}

export interface StatusSnapshot {
  status: string;
  service: string;
  version: string;
  env: string;
  startedAt: string;
  now: string;
  uptime: { ms: number; human: string };
  runtime: { node: string; platform: string; arch: string; pid: number };
  memory: { rssMb: number; heapUsedMb: number; heapTotalMb: number };
  counts: { roles: number; users: number; assignments: number };
}
