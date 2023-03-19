import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessCreateProjectComponent } from './success-create-project.component';

describe('SuccessCreateProjectComponent', () => {
  let component: SuccessCreateProjectComponent;
  let fixture: ComponentFixture<SuccessCreateProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccessCreateProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccessCreateProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
