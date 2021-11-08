import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'jhi-pdf-to-text',
  templateUrl: './pdf-to-text.component.html',
})
export class PdfToTextComponent implements OnInit {
  @Output()
  fillContentEvent = new EventEmitter<string>();

  afuConfig: any = {};

  ngOnInit(): void {
    this.afuConfig = {
      multiple: true,
      formatsAllowed: '.pdf',
      maxSize: '20',
      uploadAPI: {
        url: 'http://localhost:8080/api/extended/pdf-to-text',
        method: 'POST',
        /*        headers: {
          "Content-Type" : "text/plain;charset=UTF-8",
          "Authorization" : `Bearer ${token}`
        },*/
        params: {
          //          'page': '1'
        },
        responseType: 'json',
        withCredentials: false,
      },
      theme: 'dragNDrop',
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: true,
      fileNameIndex: false,
      autoUpload: true,
      replaceTexts: {
        selectFileBtn: 'Select Files',
        resetBtn: 'Reset',
        uploadBtn: 'Upload',
        dragNDropBox: 'Drag N Drop',
        attachPinBtn: 'Attach Files...',
        afterUploadMsg_success: 'Successfully Uploaded !',
        afterUploadMsg_error: 'Upload Failed !',
        sizeLimit: 'Size Limit',
      },
    };
  }

  textContent(value: string): void {
    this.fillContentEvent.emit(value);
  }

  fileSelected(files: any): void {
    console.warn('fileSelected: ', files);
  }

  DocUpload(response: any): void {
    if (response.status === 200) {
      console.warn('DocUpload: ', response);
      this.fillContentEvent.emit(response.body.join('\n'));
    }
  }
}
