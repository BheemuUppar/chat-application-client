import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

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
      alert(
        'Failed to decode the base64 string. Please ensure the format is correct.'
      );
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
}
