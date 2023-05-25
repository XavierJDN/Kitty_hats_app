import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Kitty } from '@app/interface/kitty';
import { HttpResponse } from '@angular/common/http';
import { KittiesManagerService } from '@app/services/kitties-manager/kitties-manager.service';
@Component({
  selector: 'app-kitty-hat',
  templateUrl: './kitty-hat.component.html',
  styleUrls: ['./kitty-hat.component.scss'],
})
export class KittyHatComponent implements OnInit {
  tokens: any[] = [];
  @Input() address: string = '';
  kittyHat: Kitty = {
    address: '',
    name: '',
    img: '',
    owner: '',
  };
  constructor(private communication: CommunicationService) {}

  ngOnInit(): void {
    this.getKittyInformation();
  }

  getKittyInformation() {
    this.getKitty();
    this.getHatKitties();
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
    };
  }

  updateStyle(style: any, newStyle: any) {
    return style != undefined ? { ...style, ...newStyle } : newStyle;
  }

  sortByBlock() {
    this.tokens.sort((curr, prev) => {
      return curr.block - prev.block;
    });
  }

  private getKitty() {
    this.communication
      .getKitty(this.address)
      .subscribe((response: HttpResponse<any>) => {
        this.kittyHat = {
          bg: response.body.background_color,
          name: response.body.name as string,
          address: this.address,
          img: response.body.image_url,
          owner: response.body.owner.address,
        };
      });
  }

  private getHatKitties() {
    this.communication
      .getHatsKitty(this.address)
      .subscribe(
        (response: HttpResponse<{ block: number; address: string }[]>) => {
          response.body?.forEach(
            (token: { block: number; address: string }) => {
              this.getToken(token);
            }
          );
        }
      );
  }

  private getToken(token: { block: number; address: string }) {
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
        this.tokens.push({
          block: token.block,
          ...tokenData.body,
        });
        this.sortByBlock();
      });
  }
}
