import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageJobGridComponent } from './manage-job-grid.component';

describe('ManageJobGridComponent', () => {
  let component: ManageJobGridComponent;
  let fixture: ComponentFixture<ManageJobGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageJobGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageJobGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
