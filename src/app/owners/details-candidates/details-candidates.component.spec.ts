import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsCandidatesComponent } from './details-candidates.component';

describe('DetailsCandidatesComponent', () => {
  let component: DetailsCandidatesComponent;
  let fixture: ComponentFixture<DetailsCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
