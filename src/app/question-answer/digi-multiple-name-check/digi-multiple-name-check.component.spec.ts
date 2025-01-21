import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DigiMultipleNameCheckComponent } from './digi-multiple-name-check.component';

describe('DigiMultipleNameCheckComponent', () => {
  let component: DigiMultipleNameCheckComponent;
  let fixture: ComponentFixture<DigiMultipleNameCheckComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DigiMultipleNameCheckComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DigiMultipleNameCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
