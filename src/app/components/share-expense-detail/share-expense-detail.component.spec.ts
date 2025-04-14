import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareExpenseDetailComponent } from './share-expense-detail.component';

describe('ShareExpenseDetailComponent', () => {
  let component: ShareExpenseDetailComponent;
  let fixture: ComponentFixture<ShareExpenseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareExpenseDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareExpenseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
