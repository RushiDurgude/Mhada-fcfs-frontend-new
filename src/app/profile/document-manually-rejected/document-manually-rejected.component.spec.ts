import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DocumentManuallyRejectedComponent } from './document-manually-rejected.component';

describe('DocumentManuallyRejectedComponent', () => {
  let component: DocumentManuallyRejectedComponent;
  let fixture: ComponentFixture<DocumentManuallyRejectedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentManuallyRejectedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentManuallyRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
