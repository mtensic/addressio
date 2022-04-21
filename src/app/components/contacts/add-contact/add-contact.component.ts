import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IContact} from "../../../shared/interfaces/icontact";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcherService} from "../../../shared/services/my-error-state-matcher.service";
import {ContactsService} from "../../../shared/services/contacts.service";


@Component({
  selector: 'app-edit-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.scss']
})
export class AddContactComponent implements OnInit {
  types: String[] = ['mobile', 'phone', 'email', 'pager']
  newContacts: IContact[] = []

  contactInfo= new FormGroup({
    name: new FormControl('',
      Validators.compose([
        Validators.required,
        Validators.maxLength(20)
      ])),
    lastName: new FormControl('',
      Validators.compose([Validators.required,
        Validators.maxLength(30)]
      )),
    type: new FormControl(Validators.required),
    birthday: new FormControl('', Validators.required),
    value: new FormControl('', Validators.required),
  })
  matcher = new MyErrorStateMatcherService();
  maxDate: any
  panelOpenState: boolean = false

  constructor(
    private dialogRef: MatDialogRef<AddContactComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private contactService: ContactsService
  ) { }

  ngOnInit(): void {
    const today = new Date()
    this.maxDate = new Date()
    this.maxDate.setUTCFullYear(today.getFullYear() - 18, today.getMonth(), today.getDate())
    this.maxDate.setDate(this.maxDate.getDate())
  }

  create(){
    if (this.newContacts.length > 0 && this.contactInfo.valid) {
      this.createMultipleContacts();
      this.createSingleContact();
    } else if (this.newContacts.length > 0 && !this.contactInfo.valid) {
      this.createMultipleContacts();
    } else {
      this.createSingleContact();
    }
  }

  private createMultipleContacts() {
    for (let con of this.newContacts) {
      let newContact = {
        name: con.name,
        lastName: con.lastName,
        type: con.type,
        birthday: con.birthday.toString(),
        value: con.value
      }
      this.contactService.create(newContact)
    }
  }

  private createSingleContact() {
    let contact = {
      name: this.contactInfo.get('name')?.value,
      lastName: this.contactInfo.get('lastName')?.value,
      type: this.contactInfo.get('type')?.value,
      birthday: this.contactInfo.get('birthday')?.value.toString(),
      value: this.contactInfo.get('value')?.value
    }
    this.contactService.create(contact)
    this.dialogRef.close()
  }

  addToContactList() {
    if (this.contactInfo.valid){
      let contact = {
        name: this.contactInfo.get('name')?.value,
        lastName: this.contactInfo.get('lastName')?.value,
        type: this.contactInfo.get('type')?.value,
        birthday: this.contactInfo.get('birthday')?.value,
        value: this.contactInfo.get('value')?.value
      }

      this.newContacts.push(contact)
      this.contactInfo.reset()
    }
  }

  removeContactFromList(contact: IContact) {
    this.newContacts = this.newContacts.filter(obj => {return obj !== contact});
  }

  close(){
    this.dialogRef.close()
  }
}
