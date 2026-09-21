export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface JwtPayload {
  userId: number;
  role: 'USER' | 'APPROVER' | 'ADMIN';
}