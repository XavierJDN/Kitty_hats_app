import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KittyDetailsComponent } from './kitty-details.component';

describe('KittyDetailsComponent', () => {
  let component: KittyDetailsComponent;
  let fixture: ComponentFixture<KittyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KittyDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KittyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
