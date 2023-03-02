import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Kitty } from '@app/interface/kitty';
import { CommunicationService } from '@app/services/communication/communication.service';

@Component({
  selector: 'app-kitties',
  templateUrl: './kitties.component.html',
  styleUrls: ['./kitties.component.scss'],
})
export class KittiesComponent {
  kitties: Kitty[] = [];
  constructor(private communication: CommunicationService) {}
  ngOnInit(): void {
    this.kitties = [];
    this.communication
      .getHatsKitties()
      .subscribe((response: HttpResponse<string[]>) => {
        response.body!.forEach((kitty: string) => {
          this.communication
            .getKitty(kitty)
            .subscribe((response: HttpResponse<any>) => {
              this.kitties.push({
                name: response.body.name,
                address: kitty,
                img: response.body.image_url,
                owner: response.body.owner.address,
              });
            });
        });
      });
  }
}
