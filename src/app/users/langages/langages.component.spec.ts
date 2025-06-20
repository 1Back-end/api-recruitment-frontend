import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangagesComponent } from './langages.component';

describe('LangagesComponent', () => {
  let component: LangagesComponent;
  let fixture: ComponentFixture<LangagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LangagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LangagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
