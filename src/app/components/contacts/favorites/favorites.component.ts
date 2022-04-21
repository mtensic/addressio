import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {map} from "rxjs/operators";
import {ContactsService} from "../../../shared/services/contacts.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'lastName', 'birthday', 'type', 'value'];
  dataSource: any

  constructor(
    private contactService: ContactsService
  ) { }

  @ViewChild('empTbSort') empTbSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;


  ngAfterViewInit() {
    this.retrieveContacts()
  }

  retrieveContacts(){
    this.contactService.getFavorites().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.empTbSort
      this.dataSource.paginator = this.paginator;
    });
  }
}
