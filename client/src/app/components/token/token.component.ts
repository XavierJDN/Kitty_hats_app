import { Component, Input, OnInit } from '@angular/core';
import { CommunicationService } from '@app/services/communication/communication.service';

@Component({
  selector: 'app-token',
  templateUrl: './token.component.html',
  styleUrls: ['./token.component.scss'],
})
export class TokenComponent {
  @Input()
  token: { address: string; name: string; img: string; artist: string } = {
    address: '',
    name: '',
    img: '',
    artist: '',
  };
}
