import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserGridComponent } from './manage-user-grid.component';

describe('ManageUserGridComponent', () => {
  let component: ManageUserGridComponent;
  let fixture: ComponentFixture<ManageUserGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUserGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
