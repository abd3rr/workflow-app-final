import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateTaskDetailsComponent } from './validate-task-details.component';

describe('ValidateTaskDetailsComponent', () => {
  let component: ValidateTaskDetailsComponent;
  let fixture: ComponentFixture<ValidateTaskDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateTaskDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateTaskDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
