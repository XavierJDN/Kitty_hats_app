import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Kitty } from '@app/interface/kitty';
import { CommunicationService } from '@app/services/communication/communication.service';
import { KittiesManagerService } from '@app/services/kitties-manager/kitties-manager.service';

@Component({
  selector: 'app-kitties',
  templateUrl: './kitties.component.html',
  styleUrls: ['./kitties.component.scss'],
})
export class KittiesComponent {
  kitties: Kitty[] = [];

  constructor(private communication: CommunicationService, public kittiesManager: KittiesManagerService) {}

  ngOnInit(): void {
    this.kitties = [];
    this.kittiesManager.$kitty.subscribe((kitty: Kitty) => {
      this.kitties.push(kitty);
    });
    this.kittiesManager.getAllHatsKitties();
  }

  nextPage(){
    this.kitties = [];
    this.kittiesManager.next();
  }

  previousPage(){
    this.kitties = [];
    this.kittiesManager.previous();
  }
}
