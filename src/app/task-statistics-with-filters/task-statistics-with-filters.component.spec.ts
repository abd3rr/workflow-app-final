import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskStatisticsWithFiltersComponent } from './task-statistics-with-filters.component';

describe('TaskStatisticsWithFiltersComponent', () => {
  let component: TaskStatisticsWithFiltersComponent;
  let fixture: ComponentFixture<TaskStatisticsWithFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskStatisticsWithFiltersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskStatisticsWithFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
