import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Token } from '@common/token';
import { Focus } from '@app/enum/focus';
@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent implements OnInit {
  tokens: Token[] | null = [];
  id: string | undefined;
  isPrevious = true;
  isNext = true;
  focus: { owner: string; author: string } = { owner: '', author: '' };
  enumFocus: typeof Focus = Focus;
  constructor(private communication: CommunicationService) {}

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

  isView(token: Token | null) {
    if (token === null) {
      return false;
    }
    return this.focus.author === '' || this.focus.author === token.artist;
  }

  infoTokens(isNext: boolean | undefined, isNewFocus: boolean = false) {
    this.communication
      .getTokens(isNewFocus ? this.focus : undefined, isNext)
      .subscribe((tokens: HttpResponse<any>) => {
        this.tokens = tokens.body.page.map((token: Token) =>
          token.owners.map((owner) => {
            return {
              ...owner,
              contractAddress: token.address,
              name: token.name,
              img: token.img,
              artist: token.artist,
            };
          })
        );
        console.log(this.tokens);
        this.communication.pageId = !this.communication.pageId
          ? tokens.body.id
          : this.communication.pageId;
        this.isPrevious = tokens.body.isPrevious;
        this.isNext = tokens.body.isNext;
      });
  }
}
