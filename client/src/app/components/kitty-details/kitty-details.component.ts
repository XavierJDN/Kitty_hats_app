import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WalletService } from '@app/services/wallet/wallet.service';
import { CommunicationService } from '@app/services/communication/communication.service';
@Component({
  selector: 'app-kitty-details',
  templateUrl: './kitty-details.component.html',
  styleUrls: ['./kitty-details.component.scss']
})
export class KittyDetailsComponent {
  activeAccount: string = '';
  constructor (
    @Inject(MAT_DIALOG_DATA) public data: any,
    private wallet: WalletService,
    private communication: CommunicationService) {
  this.kitty = data;
  this.activeAccount = this.wallet.address;
}

tokens: {
  contractAddress: string,
  name: string,
  img: { src: string, format: string },
  artist: string,
  owner: { address: string, quantity: number},
}[] = [];

kitty = {
  address: '',
  name: '',
  img: '',
  owner: '',
};

previews: {
  contractAddress: string,
  name: string,
  img: { src: string, format: string },
  artist: string,
  owner: { address: string, quantity: number},
}[] = [];

getTokens() {
  this.communication.getTokens({author: '', owner: this.activeAccount}, false).subscribe((tokens: any) => {
    this.tokens = tokens;
  });
}
}
