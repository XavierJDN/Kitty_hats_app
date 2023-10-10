import { Injectable } from '@angular/core';
import { CommunicationService } from '../communication/communication.service';
import { HttpResponse } from '@angular/common/http';
import { Subject, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KittyHatService {
  $hatKitties: Subject<any> = new Subject<any>();

  constructor(private communication: CommunicationService) { }

  getHatKitties(address: string)  {
  this.communication
    .getHatsKitty(address)
    .subscribe((response: HttpResponse<{block: number, address: string}[]>) => {
      response.body?.forEach(
            (token: { block: number; address: string }) => {
              this.getToken(token, address);
            }
          );
    });
  }

  getToken(token: { block: number; address: string }, address: string) {
  const kittyAddress = address;
  const isMainHat = (img: any) =>
    img.id === undefined ? false : img.id === 'main';
  this.communication
    .getToken(token.address, true)
    .subscribe((tokenData: any) => {
      const img = tokenData.body.img;
      const mainHatToken = img.find(isMainHat);
      mainHatToken.style =
        mainHatToken.style === undefined
          ? undefined
          : this.createStyle(mainHatToken.style);
      img[img.findIndex(isMainHat)] = mainHatToken;
      tokenData.body.img = img;
      this.$hatKitties.next({
        kittyAddress,
        block: token.block,
        ...tokenData.body,
      });
    });
  }

  createStyle(refStyle: {
    size: { width: number; height: number };
    dimension: { width: number; height: number };
    position: { top: number; left: number };
  }) {
    return {
      top: `${(refStyle.position.top / refStyle.size.height) * 300}px`,
      left: `${(refStyle.position.left / refStyle.size.width) * 300}px`,
      width: `${(refStyle.dimension.width / refStyle.size.width) * 300}px`,
      height: `${(refStyle.dimension.height / refStyle.size.height) * 300}px`,
  }
  }
}
