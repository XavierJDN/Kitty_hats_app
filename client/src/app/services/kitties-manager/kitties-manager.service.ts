import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Kitty } from '@app/interface/kitty';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class KittiesManagerService {
  private offset: number = 0;
  private limit: number = 9;
  $kitty: Subject<Kitty> = new Subject();
  private hatsKitties: Map<string, string[]> = new Map();

  constructor(private communication: CommunicationService) {}

  private getKitties(kitties: string[]) {
    kitties.forEach((kitty: string) =>
      this.communication
        .getKitty(kitty)
        .subscribe((response: HttpResponse<any>) => {
          this.$kitty.next({
            name: response.body.name as string,
            address: kitty,
            img: response.body.image_url,
            owner: response.body.owner.address,
          });
        })
    );
  }

  next() {
    this.offset += this.limit;
    return this.current();
  }

  private current() {
    return this.getKitties(
      Array.from(this.hatsKitties.keys()).slice(
        this.offset,
        this.offset + this.limit
      )
    );
  }
  isNext() {
    return this.offset + this.limit < this.hatsKitties.size;
  }

  isPrevious() {
    return this.offset > 0;
  }
  previous() {
    this.offset -= this.limit;
    return this.current();
  }

  getAllHatsKitties() {
    return this.communication
      .getHatsKitties()
      .subscribe((response: HttpResponse<any>) => {
        this.hatsKitties = new Map(Object.entries(response.body));
        this.current();
      });
  }

  getKitty(kitty: string) {
    return this.communication
      .getKitty(kitty)
      .subscribe((response: HttpResponse<any>) => {
        console.log(response.body);
        return {
          bg: response.body.background_color,
          name: response.body.name,
          address: kitty,
          img: response.body.image_url,
          owner: response.body.owner.address,
          hats: this.hatsKitties.get(kitty),
        };
      });
  }
}
