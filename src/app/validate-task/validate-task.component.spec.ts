import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateTaskComponent } from './validate-task.component';

describe('ValidateTaskComponent', () => {
  let component: ValidateTaskComponent;
  let fixture: ComponentFixture<ValidateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidateTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
