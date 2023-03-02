import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KittiesComponent } from './kitties.component';

describe('KittiesComponent', () => {
  let component: KittiesComponent;
  let fixture: ComponentFixture<KittiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KittiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KittiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
