import {Component, Inject, OnInit} from '@angular/core';
import {IContact} from "../../../shared/interfaces/icontact";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MyErrorStateMatcherService} from "../../../shared/services/my-error-state-matcher.service";
import {ContactsService} from "../../../shared/services/contacts.service";
import {ActivatedRoute} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss']
})
export class EditContactComponent implements OnInit {

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
  contacts: IContact[] = []

  constructor(
    private contactService: ContactsService,
    private route: ActivatedRoute,
    private dialogRef: MatDialogRef<EditContactComponent>,
    @Inject(MAT_DIALOG_DATA) public currentContact: IContact,
  ) {
  }

  ngOnInit(): void {
    const today = new Date()
    this.maxDate = new Date()
    this.maxDate.setUTCFullYear(today.getFullYear() - 18, today.getMonth(), today.getDate())
    this.maxDate.setDate(this.maxDate.getDate())

    this.contactInfo.get('name')?.setValue(this.currentContact.name)
    this.contactInfo.get('lastName')?.setValue(this.currentContact.lastName)
    this.contactInfo.get('birthday')?.setValue(new Date(this.currentContact.birthday))
    this.contactInfo.get('type')?.patchValue(this.currentContact.type)
    this.contactInfo.get('value')?.patchValue(this.currentContact.value)
  }

  update(){
    this.changeContactInfo();
    if (this.currentContact.key){
      this.contactService.update(this.currentContact.key, this.currentContact).finally(() => {
          this.dialogRef.close()
        }
      )
    }
  }

  private changeContactInfo() {
    this.currentContact.type = this.contactInfo.get('type')?.value
    this.currentContact.lastName = this.contactInfo.get('lastName')?.value
    this.currentContact.name = this.contactInfo.get('name')?.value
    this.currentContact.birthday = this.contactInfo.get('birthday')?.value.toString()
    this.currentContact.value = this.contactInfo.get('value')?.value
  }

  close() {
    this.dialogRef.close()
  }

}
