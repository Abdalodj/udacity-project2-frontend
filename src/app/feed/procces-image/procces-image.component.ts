import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'app-procces-image',
  templateUrl: './procces-image.component.html',
  styleUrls: ['./procces-image.component.scss'],
})
export class ProccesImageComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}


  async presentUploadForm(ev: any) {
    const modal = await this.modalController.create({
      component: ImagePreviewComponent,
    });
    return await modal.present();
  }
}
