import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCandidatesComponent } from './my-candidates.component';

describe('MyCandidatesComponent', () => {
  let component: MyCandidatesComponent;
  let fixture: ComponentFixture<MyCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
