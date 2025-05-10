import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated'

const baseUrl = 'http://localhost:3000/api'

@Injectable({ providedIn: 'root' })
export class AuthService {

  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private httpClient = inject(HttpClient);

  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });
  user = computed(() => this._user());
  token = computed(() => this._token());

  checkStatusResource = rxResource({
    loader: () => this.checkStatus()
  });

  login(email: string, password: string): Observable<boolean> {
    return this.httpClient.post<AuthResponse>(`${baseUrl}/auth/login`, {
      email: email,
      password: password,
    })
      .pipe(
        map(resp => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    return this.httpClient.get<AuthResponse>(`${baseUrl}/auth/check-status`
    ) .pipe(
        map(resp => this.handleAuthSuccess(resp)),
        catchError((error: any) => this.handleAuthError(error)),
      );
  }

  logout() {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: AuthResponse) {

    this._authStatus.set('authenticated');
    this._user.set(resp.user);
    this._token.set(resp.token);
    localStorage.setItem('token', resp.token);
    return true;
  }

  private handleAuthError(error: any) {
    this.logout();
    return of(false);
  }
}
