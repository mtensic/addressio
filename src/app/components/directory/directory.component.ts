import {AfterViewInit, Component, OnInit} from '@angular/core';
import {map} from "rxjs/operators";
import {IContact} from "../../shared/interfaces/icontact";
import {ContactsService} from "../../shared/services/contacts.service";
import {EditContactComponent} from "../contacts/edit-contact/edit-contact.component";
import {MatDialog} from "@angular/material/dialog";
import {IFavorite} from "../../shared/interfaces/ifavorite";

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss']
})
export class DirectoryComponent implements AfterViewInit {
  contacts: IContact[] = [];
  favorites: IContact[] = [];

  constructor(
    public dialog: MatDialog,
    private contactService: ContactsService
  ) { }

  ngAfterViewInit(): void {
    this.retrieveFavoritesAndContacts()
  }

  retrieveFavoritesAndContacts(){
    this.contactService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.contacts = data as IContact[];
    });

    this.contactService.getFavorites().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.favorites = data as IContact[];
    });
  }

  checkIfFavorite(contact: IContact) {
    if (this.favorites.find(s => s.name === contact.name && s.lastName === contact.lastName && s.value === contact.value)){
      return 'favorite'
    } else {
      return 'star'
    }
  }

  deleteContact(fav: string) {
    return this.contactService.delete(fav)
  }

  editContact(fav: IContact) {
    const dialogRef = this.dialog.open(EditContactComponent, {
      data: fav,
      panelClass: 'matDialog-panelClass',
      restoreFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
      }
    })
  }

  addToFavorites(contact: IFavorite, favorites: IContact[]) {
    this.contactService.addToFavorites(contact, favorites)
    this.retrieveFavoritesAndContacts()
  }
}
