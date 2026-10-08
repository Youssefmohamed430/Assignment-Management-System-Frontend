export class AuthResponse {
  id: string = '';
  iD?: string = '';
  message: string | null = null;
  isAuthenticated: boolean = false;
  username: string = '';
  email: string = '';
  roles: string[] = [];
  token: string = '';
  expiresOn: string = '';
  refreshToken: string = '';
  refreshTokenExpiresOn: string = '';
}
