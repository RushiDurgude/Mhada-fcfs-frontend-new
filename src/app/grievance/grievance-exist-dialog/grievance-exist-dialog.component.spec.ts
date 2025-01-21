import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrievanceExistDialogComponent } from './grievance-exist-dialog.component';

describe('GrievanceExistDialogComponent', () => {
  let component: GrievanceExistDialogComponent;
  let fixture: ComponentFixture<GrievanceExistDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceExistDialogComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrievanceExistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
