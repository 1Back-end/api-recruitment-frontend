import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsOffersComponent } from './jobs-offers.component';

describe('JobsOffersComponent', () => {
  let component: JobsOffersComponent;
  let fixture: ComponentFixture<JobsOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobsOffersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobsOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
