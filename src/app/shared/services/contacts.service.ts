import { Injectable } from '@angular/core';
import {IContact} from "../interfaces/icontact";
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {IFavorite} from "../interfaces/ifavorite";

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  contactsRef$: AngularFireList<IContact>;
  favoritesRef$: AngularFireList<IContact>;

  constructor(private db: AngularFireDatabase) {
    this.contactsRef$ = db.list('Contact')
    this.favoritesRef$ = db.list('Favorites')
  }

  getAll(): AngularFireList<IContact> {
    return this.contactsRef$;
  }

  getFavorites(): AngularFireList<IContact> {
    return this.favoritesRef$;
  }

  search() {
    // return this.contactsRef$.query(ref)
  }

  addToFavorites(contact: IFavorite, favorites: IContact[]) {
    let favorite = {
      name: contact.name,
      lastName: contact.lastName,
      value: contact.value,
      type: contact.type,
      birthday: contact.birthday
    }

    let element = favorites.find(s => s.name === contact.name && s.lastName === contact.lastName && s.value === contact.value)
    if (element){
      this.removeFromFavorites(element.key || '')
    } else {
      this.createFavorite(favorite)
    }
  }

  createFavorite(contact: IContact): any {
    return this.favoritesRef$.push(contact);
  }

  removeFromFavorites(key: string): Promise<void> {
    return this.favoritesRef$.remove(key);
  }

  create(contact: IContact): any {
    return this.contactsRef$.push(contact);
  }
  update(key: string, value: any): Promise<void> {
    return this.contactsRef$.update(key, value);
  }
  delete(key: string): Promise<void> {
    return this.contactsRef$.remove(key);
  }
  deleteAll(): Promise<void> {
    return this.contactsRef$.remove();
  }
}
