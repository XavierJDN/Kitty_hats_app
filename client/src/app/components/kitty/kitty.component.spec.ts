import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KittyComponent } from './kitty.component';

describe('KittyComponent', () => {
  let component: KittyComponent;
  let fixture: ComponentFixture<KittyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KittyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KittyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
