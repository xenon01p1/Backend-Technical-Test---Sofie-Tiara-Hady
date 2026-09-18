export interface User {
  id: number;
  username: string;
  email: string;
  phone: string | null;
  role: 'STAFF' | 'APPROVER';
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}