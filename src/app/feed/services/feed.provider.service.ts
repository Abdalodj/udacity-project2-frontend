import { Injectable } from '@angular/core';
import { FeedItem, feedItemMocks } from '../models/feed-item.model';
import { BehaviorSubject, Subject } from 'rxjs';

import { ApiService } from '../../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class FeedProviderService {
  currentFeed$: BehaviorSubject<FeedItem[]> = new BehaviorSubject<FeedItem[]>([]);
  proccessedImg$: Subject<any> = new Subject<any>();

  constructor(private api: ApiService) { }

  async getFeed(): Promise<BehaviorSubject<FeedItem[]>> {
    const req = await this.api.get('/feed');
    const items = <FeedItem[]> req.rows;
    this.currentFeed$.next(items);
    return Promise.resolve(this.currentFeed$);
  }

  async uploadFeedItem(caption: string, file: File): Promise<any> {
    const res = await this.api.upload('/feed', file, {caption: caption, url: file.name});
    const feed = [res, ...this.currentFeed$.value];
    this.currentFeed$.next(feed);
    return res;
  }

  getProccessedImg(imgUrl: string) {
    this.api.customGet(`/filtered-image?url=${imgUrl}`).subscribe(
      res => {
        if (res) {
          // console.log(res.data);
          this.proccessedImg$.next(res.data)
        }
      }
    ),
    err => {
      console.log(err);
    }
  }
}

// async getFeed() {
//   const url = `${API_HOST}/feed`;

//   const req = this.http.get(url, this.httpOptions).pipe(
//     map(this.extractData));
//     // catchError(this.handleError));
//   const resp = <any> (await req.toPromise());
//   return resp.rows;
// }
