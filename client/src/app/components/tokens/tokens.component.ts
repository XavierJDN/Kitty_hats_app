import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Token } from '@common/token';
import { Focus } from '@app/enum/focus';
import { WalletService } from '@app/services/wallet/wallet.service';
@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent implements OnInit {
  tokens: any[] | null = [];
  id: string | undefined;
  isPrevious = true;
  isNext = true;
  type = 'all';
  focus: { owner: string; author: string } = { owner: '', author: '' };
  enumFocus: typeof Focus = Focus;
  constructor(private communication: CommunicationService, private wallet: WalletService) {}

  ngOnInit(): void {
    this.infoTokens(undefined);
  }

  updateFocus(typeFocus: Focus, newFocus: string) {
    switch (typeFocus) {
      case Focus.Author:
        this.focus.author = newFocus;
        break;
      case Focus.Owner:
        this.focus.owner = newFocus;
        break;
      default:
        break;
    }
    this.infoTokens(undefined, true);
  }

  isView(token: any) {
    if (token === null) {
      return false;
    }
    return this.focus.author === '' || this.focus.author === token.artist;
  }

  infoTokens(isNext: boolean | undefined, isNewFocus: boolean = false) {
    this.communication
      .getTokens(isNewFocus ? this.focus : undefined, isNext)
      .subscribe((tokens: HttpResponse<any>) => {
        console.log(tokens);
        this.tokens = tokens.body.page.map((token: Token) =>
          token.owners.map((owner) => {
            return {
              owner,
              contractAddress: token.address,
              name: token.name,
              img: token.img,
              artist: token.artist,
            };
          })
        ).flat();
        this.communication.pageId = !this.communication.pageId
          ? tokens.body.id
          : this.communication.pageId;
        this.isPrevious = tokens.body.isPrevious;
        this.isNext = tokens.body.isNext;
      });
  }

  typePageChange(type: string){
    if(type === 'all'){
      this.focus.owner = '';
      this.infoTokens(undefined);
    } else {
      this.focus.owner = this.wallet.address;
      this.infoTokens(undefined, true);
    }
  }

}
