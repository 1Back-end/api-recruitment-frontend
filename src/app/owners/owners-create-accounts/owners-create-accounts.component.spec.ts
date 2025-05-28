import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnersCreateAccountsComponent } from './owners-create-accounts.component';

describe('OwnersCreateAccountsComponent', () => {
  let component: OwnersCreateAccountsComponent;
  let fixture: ComponentFixture<OwnersCreateAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnersCreateAccountsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OwnersCreateAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
