import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AvailableFilterService } from '@app/services/avalaible-filter/available-filter.service';
import { CommunicationService } from '@app/services/communication/communication.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent {
  @Output() author = new EventEmitter<string>();
  @Output() owner = new EventEmitter<string>();

  authors: string[] = [];
  owners: string[] = [];
  filter = { owner: undefined, author: undefined };

  form: FormGroup = new FormGroup({
    author: new FormControl(''),
    owner: new FormControl(''),
  });

  constructor(private availableFilter: AvailableFilterService, private communication: CommunicationService) {}

  ngOnInit(): void {
    this.getAllAuthors();
    this.getAllOwners();
  }

  isOwnerChanged() {
    return this.filter.owner !== this.form.get('owner')?.value;
  }
  isArtistChanged() {
    return this.filter.author !== this.form.get('author')?.value;
  }
  updateView() {
    if(this.isOwnerChanged()) {
      this.filter.owner = this.form.get('owner')?.value;
      this.owner.emit(this.form.get('owner')?.value);
    }
    if(this.isArtistChanged()) {
      this.filter.author = this.form.get('author')?.value;
      this.author.emit(this.form.get('author')?.value);
    }
  }

  getAllAuthors() {
    this.communication.getAllArtists().subscribe((response: HttpResponse<any>) => {
      console.log(response)
      this.authors = response.body.filter((author: string) => author !== undefined && author !== null);
    });
  }

  getAllOwners() {
    this.communication.getAllOwners().subscribe((response: HttpResponse<any>) => {
      this.owners = response.body.filter((owner: string) => owner !== undefined && owner !== null);
    });
  }
    
}
