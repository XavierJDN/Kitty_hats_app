import { HttpResponse, HttpStatusCode } from '@angular/common/http';
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
  constructor( private communication: CommunicationService) { }

  ngOnInit(): void {
    this.communication.getTokens().subscribe((response: HttpResponse<Token[]>) => {
      this.tokens = response.status === HttpStatusCode.Ok ? response.body : [];
      console.log(this.tokens!.find(token => token.address === '0x54616a975dec9256f8fe26a99b2fcd6affbf6eaf'))
    });
  }

}
