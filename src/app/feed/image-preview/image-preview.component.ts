import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { FeedProviderService } from '../services/feed.provider.service';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent implements OnInit, OnDestroy {
  public myUploadForm: FormGroup;
  public img: any;
  private subs: Subscription[] = []

  constructor(private formBuilder: FormBuilder,
    public loadingController: LoadingController,
    private modalController: ModalController, private feedService: FeedProviderService) { }

  ngOnDestroy() {
    URL.revokeObjectURL(this.img)
    for (const abo of this.subs) {
      abo.unsubscribe()
    }
  }

  ngOnInit() {
    
    this.myUploadForm = this.formBuilder.group({
      url: new FormControl('', [Validators.required, Validators.pattern(/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?\.(?:jpg|jpeg|png)$/i
      )
      ])
    });

    this.subs.push(
      this.feedService.proccessedImg$.subscribe(
        res => {
          // console.log(res);
          this.img = res
          // this.img = this.arrayBufferToBase64(res);
          this.loadingController.dismiss()
        }
      )
    )
  }

  async onSubmit($event) {
    $event.preventDefault();
    const loader = await this.loadingController.create({message: "Processing ..."});
    loader.present()

    if (!this.myUploadForm.valid) { return; }
    this.loadProccessedImg(this.myUploadForm.controls.url.value)
  }

  public loadProccessedImg(imgUrl: string) {
    this.feedService.getProccessedImg(imgUrl)
  }

  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    const imageSrc = 'data:image/jpeg;base64,' + window.btoa(binary);

    console.log(imageSrc);
    return imageSrc;
  }

}
