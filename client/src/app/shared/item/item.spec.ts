import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemViewmodel } from './item';

describe('ItemViewmodel', () => {
  let component: ItemViewmodel;
  let fixture: ComponentFixture<ItemViewmodel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItemViewmodel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemViewmodel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
