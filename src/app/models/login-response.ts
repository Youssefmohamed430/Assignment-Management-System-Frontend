export class LoginResponse {
  id: string = '';
  message: string | null = null;
  isAuthenticated: boolean = false;
  username: string = '';
  email: string = '';
  roles: string[] = [];
  token: string = '';
  expiresOn: string = '';
}