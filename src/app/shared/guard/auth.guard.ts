import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  routeURL: string;

  constructor(private authService: AuthService, private router: Router) {
    this.routeURL = this.router.url;
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem('X-token') && this.routeURL !== '/login') {
        this.routeURL = '/login';
        this.router.navigate(['/login'])
        return resolve(false);
      }else {
        this.routeURL = this.router.url;
        return resolve(true);
      }
    });
  }

}
