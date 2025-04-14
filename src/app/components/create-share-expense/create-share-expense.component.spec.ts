import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShareExpenseComponent } from './create-share-expense.component';

describe('CreateShareExpenseComponent', () => {
  let component: CreateShareExpenseComponent;
  let fixture: ComponentFixture<CreateShareExpenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateShareExpenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateShareExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
