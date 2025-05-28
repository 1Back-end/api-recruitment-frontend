import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatesCreateAccountsComponent } from './candidates-create-accounts.component';

describe('CandidatesCreateAccountsComponent', () => {
  let component: CandidatesCreateAccountsComponent;
  let fixture: ComponentFixture<CandidatesCreateAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidatesCreateAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidatesCreateAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
