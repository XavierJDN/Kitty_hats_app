import { Component, Inject, OnInit } from '@angular/core';
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
  kittyHat: Kitty = {
    address: '',
    name: '',
    img: '',
    owner: '',
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { address: string },
    private communication: CommunicationService
  ) {}

  ngOnInit(): void {
    this.getKitty();
  }

  getKitty(){
    this.communication
    .getKitty(this.data.address)
    .subscribe((response: HttpResponse<any>) => {
      this.kittyHat = {
        bg: response.body.background_color,
        name: response.body.name as string,
        address: this.data.address,
        img: response.body.image_url,
        owner: response.body.owner.address,
      }
      console.log(this.kittyHat)
    });

    this.communication.getHatsKitty(this.data.address).subscribe((response: HttpResponse<{ block: number, address: string}[]>) => {
      response.body?.forEach((token: { block: number, address: string}) => {
          this.communication.getToken(token.address, true).subscribe((tokenData: any) => {
            this.tokens.push({
              block: token.block,
              ...tokenData.body
            });
            this.sortByBlock();
            console.log(this.tokens);
          });
        });
      });
  }

  isTokenAsSpec(token: any, name: string){
    return token.class.includes(name);
  }
  sortByBlock(){
    this.tokens.sort((curr, prev) => {
      return curr.block - prev.block;
    });

  }
}
