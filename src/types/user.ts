export interface User {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  role: 'USER' | 'APPROVER' | 'ADMIN';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export type UserRole = 'USER' | 'APPROVER' | 'ADMIN';