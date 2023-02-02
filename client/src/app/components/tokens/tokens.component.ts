import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Token } from '@common/token';
@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {
  tokens: Token[] = [];
  constructor( private communication: CommunicationService) { }

  ngOnInit(): void {
    this.communication.getTokens().subscribe((tokens: Token[]) => (this.tokens = tokens));
  }

}
