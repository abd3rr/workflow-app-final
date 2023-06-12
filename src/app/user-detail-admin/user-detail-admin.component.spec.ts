import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailAdminComponent } from './user-detail-admin.component';

describe('UserDetailAdminComponent', () => {
  let component: UserDetailAdminComponent;
  let fixture: ComponentFixture<UserDetailAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDetailAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
