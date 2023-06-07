import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListUserComponent } from './task-list-user.component';

describe('TaskListUserComponent', () => {
  let component: TaskListUserComponent;
  let fixture: ComponentFixture<TaskListUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskListUserComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
