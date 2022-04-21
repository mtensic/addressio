import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {MatSort, Sort} from '@angular/material/sort';
import {AngularFireDatabase, AngularFireList} from "@angular/fire/compat/database";
import {IContact} from "../../shared/interfaces/icontact";
import {ContactsService} from "../../shared/services/contacts.service";
import { map } from 'rxjs/operators';
import {MatDialog} from "@angular/material/dialog";
import {AddContactComponent} from "./add-contact/add-contact.component";
import {IFavorite} from "../../shared/interfaces/ifavorite";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'lastName', 'birthday', 'type', 'value', 'action', 'favorites'];
  dataSource: any
  contactsRef$: AngularFireList<IContact>;
  favorites: IContact[] = [];
  data: IContact[] = [];

  constructor(
    private authService: AuthService,
    private realtimeDb: AngularFireDatabase,
    public dialog: MatDialog,
    private contactService: ContactsService
  ) {
    this.contactsRef$ = realtimeDb.list('Contact')

  }

  @ViewChild('empTbSort') empTbSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  searchFormControl = new FormControl()

  ngAfterViewInit() {
    this.retrieveContacts()
    this.retrieveFavorites()
  }

  retrieveContacts(){
    this.contactService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.data = data as IContact[]
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.empTbSort;
      this.dataSource.paginator = this.paginator;
    });
  }

  refresh(): void {
    this.retrieveContacts();
  }


  delete(contact: IContact): void {
    if (contact.key){
      this.contactService.addToFavorites(contact, this.favorites)
      this.contactService.delete(contact.key.toString())
        .then(() => {
          this.refresh()
        })
        .catch(err => console.log(err))
    }
  }

  addNewContact() {
    this.openModal(AddContactComponent)
  }

  openModal (component: any) {
    let newUserId = this.dataSource.length
    const dialogRef = this.dialog.open(component, {
      data: newUserId,
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
    this.retrieveFavorites()
  }

  retrieveFavorites(){
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

  retrieveFilteredContacts(){
    let val = this.searchFormControl.value.toLowerCase()

    let newData: any[] = []
    if (this.data) {
      this.data.filter(value => {
        if (value && value?.name?.toLowerCase().includes(val)) {
          newData.push(value)
        } else if (value?.lastName?.toLowerCase().includes(val)){
          newData.push(value)
        } else if (value?.type?.toLowerCase().includes(val)){
          newData.push(value)
        } else if (value?.value?.toLowerCase().includes(val)){
          newData.push(value)
        } else if (value?.birthday?.includes(val)){
          newData.push(value)
        }})
      }

    this.dataSource = new MatTableDataSource(newData);
    this.dataSource.sort = this.empTbSort;
    this.dataSource.paginator = this.paginator;
  }
}
