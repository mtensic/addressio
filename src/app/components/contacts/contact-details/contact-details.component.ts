import { Component, OnInit } from '@angular/core';
import {IContact} from "../../../shared/interfaces/icontact";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcherService} from "../../../shared/services/my-error-state-matcher.service";
import {ContactsService} from "../../../shared/services/contacts.service";
import {ActivatedRoute, Router} from "@angular/router";
import {map} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {EditContactComponent} from "../edit-contact/edit-contact.component";

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {

  types: String[] = ['mobile', 'phone', 'email', 'pager']
  newContacts: IContact[] = []

  matcher = new MyErrorStateMatcherService();
  maxDate: any
  key: string = ''
  contacts: IContact[] = []
  currentContact: IContact = {birthday: "", lastName: "", name: "", type: "", value: ""}

  constructor(
    private contactService: ContactsService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router
  ) {
    router.events.subscribe((val) => {
      this.key = this.route.snapshot.paramMap.get('key') || ''
    })
  }

  ngOnInit(): void {
    const today = new Date()
    this.maxDate = new Date()
    this.maxDate.setUTCFullYear(today.getFullYear() - 18, today.getMonth(), today.getDate())
    this.maxDate.setDate(this.maxDate.getDate())

    this.contactService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.contacts = data as IContact[];
      if (this.contacts.find(s => s.key === this.key.toString())){
        this.currentContact = this.contacts.find(s => s.key === this.key.toString()) as IContact
      }
    });
  }

  update(){
    const dialogRef = this.dialog.open(EditContactComponent, {
      data: this.currentContact,
      panelClass: 'matDialog-panelClass',
      restoreFocus: false
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result)
      }
    })
  }

  close() {
    this.router.navigate(['/contacts'])
  }

  delete() {
    this.contactService.delete(this.key).finally(() => {
      this.close()
    })
  }
}
