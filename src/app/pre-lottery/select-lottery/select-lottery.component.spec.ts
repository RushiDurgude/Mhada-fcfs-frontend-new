import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectLotteryComponent } from './select-lottery.component';

describe('SelectLotteryComponent', () => {
  let component: SelectLotteryComponent;
  let fixture: ComponentFixture<SelectLotteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectLotteryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectLotteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
