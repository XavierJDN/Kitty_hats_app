import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Token } from '@common/token';
@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {
  tokens: Token[] | null = [];
  id: string | undefined;
  isPrevious = true;
  isNext = true;
  constructor( private communication: CommunicationService) { }

  ngOnInit(): void {
    this.communication.getTokens(this.id).subscribe((tokens: HttpResponse<any>) => {
      this.tokens = tokens.body.page;
      this.isPrevious = tokens.body.isPrevious;
      this.isNext = tokens.body.isNext;
      this.id = tokens.body.id;
    });
  }
  changePage(isNext: boolean) {
    this.communication.getTokens(this.id , isNext).subscribe((tokens: HttpResponse<any>) => {
      console.log(tokens.body);
      this.tokens = tokens.body.page;
      this.isPrevious = tokens.body.isPrevious;
      this.isNext = tokens.body.isNext;
    });
  }
}
