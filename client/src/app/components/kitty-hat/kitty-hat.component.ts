import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Kitty } from '@app/interface/kitty';
import { HttpResponse } from '@angular/common/http';
import { KittiesManagerService } from '@app/services/kitties-manager/kitties-manager.service';
import { KittyHatService } from '@app/services/kitty-hat/kitty-hat.service';
@Component({
  selector: 'app-kitty-hat',
  templateUrl: './kitty-hat.component.html',
  styleUrls: ['./kitty-hat.component.scss'],
})
export class KittyHatComponent implements OnInit {
  tokens: any[] = [];
  @Input() address: string = '';
  previewTokens:  {
    contractAddress: string,
    name: string,
    img: { src: string, format: string, style: string },
    artist: string,
    owner: { address: string, quantity: number},
  }[] = [];

  kittyHat: Kitty = {
    address: '',
    name: '',
    img: '',
    owner: '',
  };
  constructor(private communication: CommunicationService, private kittyHatService: KittyHatService) {
    this.kittyHatService.$hatKitties.subscribe((token: any) => {
      if(token.kittyAddress != this.address) {
        return;
      }
      this.tokens.push(token);
    });

  }

  ngOnInit(): void {
    this.getKittyInformation();
  }

  getKittyInformation() {
    this.getKitty();
    this.getHatKitties();
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
    this.kittyHatService.getHatKitties(this.address);
  }
}
