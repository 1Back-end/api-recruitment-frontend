import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJobOffersUsersComponent } from './my-job-offers-users.component';

describe('MyJobOffersUsersComponent', () => {
  let component: MyJobOffersUsersComponent;
  let fixture: ComponentFixture<MyJobOffersUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyJobOffersUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyJobOffersUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
