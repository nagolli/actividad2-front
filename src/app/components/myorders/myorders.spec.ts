import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrders } from './myorders';

describe('Myorders', () => {
  let component: MyOrders;
  let fixture: ComponentFixture<MyOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOrders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
