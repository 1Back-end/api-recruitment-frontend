import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersFreelanceComponent } from './offers-freelance.component';

describe('OffersFreelanceComponent', () => {
  let component: OffersFreelanceComponent;
  let fixture: ComponentFixture<OffersFreelanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OffersFreelanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffersFreelanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
