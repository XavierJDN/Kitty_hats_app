import { Component, Input, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication/communication.service';
import { Token } from '@common/token';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent {
  @Input()
  token = {
    contractAddress: '',
    name: '',
    img: { src: '', format: '' },
    artist: '',
    owner: { address: '', quantity: 0},
  };
}
