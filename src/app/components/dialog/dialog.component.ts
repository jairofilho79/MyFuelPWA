import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}


// export class DialogComponent implements OnInit {

//   constructor(public dialog: MatDialog) {}

//   ngOnInit() {
//   }

//   openDialog(): void {
//     const dialogRef = this.dialog.open(GenericDialog, {
//       width: '50vw',
//       data: {}
//     });

//     dialogRef.afterClosed().subscribe(() => {
//       this.onTruthyChoice.emit(true);
//     });
//   }

// }
