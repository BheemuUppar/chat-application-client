import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css'],
})
export class FilePreviewComponent {
  constructor(
    private dialogRef: MatDialogRef<FilePreviewComponent>,
    public utilService :UtilService,
    @Inject(MAT_DIALOG_DATA)
    public data: { file: string; fileName: string; fileType: string, mimeType:string }
  ) {
    console.log(data);
  }

  closeDialog(){
    this.dialogRef.close();
  }
}
