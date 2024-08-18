import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverstaionComponent } from './converstaion.component';

describe('ConverstaionComponent', () => {
  let component: ConverstaionComponent;
  let fixture: ComponentFixture<ConverstaionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConverstaionComponent]
    });
    fixture = TestBed.createComponent(ConverstaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
