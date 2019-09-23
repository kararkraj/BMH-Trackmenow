import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate } from '@angular/router';
import { HttpService } from '../services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public http: HttpService) { }

  canActivate(): boolean {
    return this.http.isAuthenticated();
  }
}
