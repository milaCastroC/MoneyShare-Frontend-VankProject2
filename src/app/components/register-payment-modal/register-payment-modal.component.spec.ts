import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPaymentModalComponent } from './register-payment-modal.component';

describe('RegisterPaymentModalComponent', () => {
  let component: RegisterPaymentModalComponent;
  let fixture: ComponentFixture<RegisterPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterPaymentModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
