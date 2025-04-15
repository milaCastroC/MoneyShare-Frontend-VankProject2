import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinShareComponent } from './join-share.component';

describe('JoinShareComponent', () => {
  let component: JoinShareComponent;
  let fixture: ComponentFixture<JoinShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinShareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
