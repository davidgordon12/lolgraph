import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Loadout } from './loadout';

describe('Loadout', () => {
  let component: Loadout;
  let fixture: ComponentFixture<Loadout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Loadout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Loadout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
