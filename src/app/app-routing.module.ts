import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {ContactsComponent} from "./components/contacts/contacts.component";
import {AuthGuard} from "./shared/guard/auth.guard";
import {ContactDetailsComponent} from "./components/contacts/contact-details/contact-details.component";
import {FavoritesComponent} from "./components/contacts/favorites/favorites.component";
import {DirectoryComponent} from "./components/directory/directory.component";

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'contacts/favorites', component: FavoritesComponent, canActivate: [AuthGuard]},
  { path: 'contacts/:key', component: ContactDetailsComponent, canActivate: [AuthGuard]},
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuard]},
  { path: 'directory', component: DirectoryComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
