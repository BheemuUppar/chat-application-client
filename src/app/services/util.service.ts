import { Injectable, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FilePreviewComponent } from '../components/shared/file-preview/file-preview.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from './socket.service';
@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private _snackBar = inject(MatSnackBar);
  private msgSentAudio = new Audio('../../assets/media/sentAudio.mp3');
  private incomingMessageAudio = new Audio(
    '../../assets/media/incoming-msg.mp3'
  );
  private notifationAudio = new Audio('../../assets/media/notification.mp3');
  public typingUsers = [];

  fileTypeMap: any = {
    // Video files
    mp4: 'video',
    avi: 'video',
    mov: 'video',
    mkv: 'video',
    flv: 'video',
    wmv: 'video',
    webm: 'video',
    mpg: 'video',
    mpeg: 'video',
    '3gp': 'video',
    rm: 'video',
    rmvb: 'video',
    ts: 'video',
    mts: 'video',
    m2ts: 'video',
    ogv: 'video',
    drc: 'video',
    xvid: 'video',
    divx: 'video',
    vob: 'video',
    asf: 'video',
    h264: 'video',
    h265: 'video',
    m4v: 'video',

    // Image files
    jpg: 'image',
    jpeg: 'image',
    png: 'image',
    gif: 'image',
    bmp: 'image',
    tiff: 'image',
    svg: 'image',
    ico: 'image',
    webp: 'image',

    // Document files
    pdf: 'document',
    doc: 'document',
    docx: 'document',
    xls: 'document',
    xlsx: 'document',
    ppt: 'document',
    pptx: 'document',
    txt: 'document',
    rtf: 'document',
    odt: 'document',
    ods: 'document',
    odp: 'document',

    // Audio files
    mp3: 'audio',
    wav: 'audio',
    ogg: 'audio',
    aac: 'audio',
    flac: 'audio',
    m4a: 'audio',
    wma: 'audio',
    alac: 'audio',

    // Archive files
    zip: 'archive',
    rar: 'archive',
    tar: 'archive',
    gz: 'archive',
    '7z': 'archive',
    bz2: 'archive',
    iso: 'archive',

    // Code files
    html: 'code',
    css: 'code',
    js: 'code',
    json: 'code',
    xml: 'code',
    java: 'code',
    py: 'code',
    c: 'code',
    cpp: 'code',
    h: 'code',
    rb: 'code',
    php: 'code',
    sh: 'code',
  };

  constructor(private dialog: MatDialog) {
    this.loadTheme();
  }

  downloadFile(base64String: string, fileName: string, fileType: string) {
    // Remove any headers, if present (e.g., "data:application/pdf;base64,")
    const cleanedBase64 = base64String.split(',')[1] || base64String;

    try {
      // Decode the base64 string to binary data
      const byteCharacters = atob(cleanedBase64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileType });

      // Create a link element and set the href to the blob URL
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;

      // Append the link to the body, trigger the click, and remove the link
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error decoding base64 string:', error);

      this.openSnackBar('failed to download');
    }
  }

  formatBytes(bytes: number): string {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
  }

  getFileType(file_type: string) {
    return this.fileTypeMap[file_type] ? this.fileTypeMap[file_type] : '';
  }

  openPreview(
    file: string,
    fileName: string,
    fileType: string,
    mimeType: string
  ) {
    let dialogRef = this.dialog.open(FilePreviewComponent, {
      disableClose: true,
      hasBackdrop: true,
      height: '97vh',
      width: '98vw',
      maxWidth: '98vw',
      data: {
        file: file,
        fileName: fileName,
        fileType: fileType,
        mimeType: mimeType,
      },
    });
  }

  openSnackBar(message: string, action: string = 'close') {
    this._snackBar.open(message, action, {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
    this.playNotificationSound();
  }
  playMessageSent() {
    this.msgSentAudio.play();
  }

  playIncomingMessage() {
    this.incomingMessageAudio.play();
  }
  playNotificationSound() {
    this.notifationAudio.play();
  }
  theme = localStorage.getItem('theme') ?? 'dark';

  loadTheme() {
    console.log(this.theme);
    if (this.theme == 'light-theme') {
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light-theme');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }
  toggleTheme() {
    console.log(this.theme);
    if (this.theme == 'dark') {
      this.theme = 'light-theme';
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light-theme');
    } else {
      this.theme = 'dark';
      document.body.classList.remove('light-theme');
      localStorage.setItem('theme', 'dark');
    }
  }
  getTypingUsers(inbox_id: number): any[] {
    let obj = this.typingUsers.filter((obj: any) => {
      return obj.inbox_id == inbox_id;
    });
    return obj;
  }
}
