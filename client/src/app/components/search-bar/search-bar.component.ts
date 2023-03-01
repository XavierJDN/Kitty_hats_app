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
  filter = { owner: '', author: '' };

  form: FormGroup = new FormGroup({
    author: new FormControl(''),
    owner: new FormControl(''),
  });

  constructor(private availableFilter: AvailableFilterService, private communication: CommunicationService) {}

  ngOnInit(): void {
    this.getAllAuthors();
  }

  isFormChanged() {
    return (
      this.filter.author !== this.form.get('author')?.value ||
      this.filter.owner !== this.form.get('owner')?.value ||
      this.filter.author !== '' ||
      this.filter.owner !== ''
    );
  }

  updateView() {
    this.author.emit(this.form.get('author')?.value);
    this.owner.emit(this.form.get('owner')?.value);
  }

  getAllAuthors() {
    this.communication.getAllArtists().subscribe((response: HttpResponse<any>) => {
      console.log(response)
      this.authors = response.body.filter((author: string) => author !== undefined && author !== null);
    });
  }
}
