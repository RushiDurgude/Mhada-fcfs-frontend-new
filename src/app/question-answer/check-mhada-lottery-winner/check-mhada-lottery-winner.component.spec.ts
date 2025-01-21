import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CheckMhadaLotteryWinnerComponent } from './check-mhada-lottery-winner.component';

describe('CheckMhadaLotteryWinnerComponent', () => {
  let component: CheckMhadaLotteryWinnerComponent;
  let fixture: ComponentFixture<CheckMhadaLotteryWinnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckMhadaLotteryWinnerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckMhadaLotteryWinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
