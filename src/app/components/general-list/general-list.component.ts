import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog } from "@angular/material";
import { Observable, Subscription } from "rxjs";
import { DialogComponent } from "../dialog/dialog.component";

@Component({
  selector: 'mf-general-list',
  templateUrl: './general-list.component.html',
  styleUrls: ['./general-list.component.css']
})
export class GeneralListComponent implements OnInit {
  @Input() data;
  @Input() listName;
  @Input() displayedColumns: string[];
  @Input() onDataChange: Observable<any>
  private eventsSubscription: Subscription;

  @Output() onRemoveEvent = new EventEmitter();
  @Output() onClickEvent = new EventEmitter();

  defaultColor = '#F0FF78';
  dataSource;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  /**
   * data = [
   *  {
   *   text1: "text1",
   *   text2: "text2",
   *  }
   * ]
   */

  constructor(
    private dialog: MatDialog
  ) {
   }

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    if(this.onDataChange) {
      this.eventsSubscription = this.onDataChange.subscribe((data) => {
        this.dataSource.data = data;
      });
    }
  }

  ngOnDestroy() {
    if(this.onDataChange) {
      this.eventsSubscription.unsubscribe();
    }
  }

  removeEvent(localIndex) {
    const index = this.paginator.pageSize * this.paginator.pageIndex + localIndex;
    const logoutDialog = this.dialog.open(DialogComponent, {
      width: '50vw',
      data: { reason: 'Você quer mesmo deletar este item?'}
    })
    logoutDialog.afterClosed().subscribe((result) => result && this.onRemoveEvent.emit(index));
  }

  clickEvent(localIndex) {
    const index = this.paginator.pageSize * this.paginator.pageIndex + localIndex;
    this.onClickEvent.emit(index);
  }

}
