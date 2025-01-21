import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectSchemeComponent } from './select-scheme.component';

describe('SelectSchemeComponent', () => {
  let component: SelectSchemeComponent;
  let fixture: ComponentFixture<SelectSchemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectSchemeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectSchemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
