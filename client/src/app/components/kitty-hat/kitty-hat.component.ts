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
    this.getKitty();
  }

  getKitty() {
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

    this.communication
      .getHatsKitty(this.address)
      .subscribe(
        (response: HttpResponse<{ block: number; address: string }[]>) => {
          response.body?.forEach(
            (token: { block: number; address: string }) => {
              this.communication
                .getToken(token.address, true)
                .subscribe((tokenData: any) => {
                  tokenData.body.img.map((img: any, ) =>
                    (img.style !== undefined) ? 
                      {...img, style: this.createStyle(img.style)} : img);
                  this.tokens.push({
                    block: token.block,
                    ...tokenData.body,
                  });
                  this.sortByBlock();
                });
            }
          );
        }
      );
  }
  createStyle(style: {
    type: string;
    spec: any;
    ref: number;
    dimension: string;
  }) {
    switch (style.type) {
      case 'position':
        style.spec = Object.fromEntries(
          Object.entries(style.spec).map(([att, value]: [string, any]) => {
            return [
              att,
              (((value as number) / style.ref) * 300).toString() +
                style.dimension,
            ];
          })
        );
        break;
      default:
        break;
    }
    return style;
  }

  updateStyle(style: any, newStyle: any) {
    return style != undefined ? { ...style, ...newStyle} : newStyle;
  }

  sortByBlock() {
    this.tokens.sort((curr, prev) => {
      return curr.block - prev.block;
    });
  }
}
