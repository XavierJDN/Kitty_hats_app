import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KittyHatComponent } from './kitty-hat.component';

describe('KittyHatComponent', () => {
  let component: KittyHatComponent;
  let fixture: ComponentFixture<KittyHatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KittyHatComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KittyHatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
