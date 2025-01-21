import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ESignSelfDeclarationComponent } from './e-sign-self-declaration.component';

describe('ESignSelfDeclarationComponent', () => {
  let component: ESignSelfDeclarationComponent;
  let fixture: ComponentFixture<ESignSelfDeclarationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ESignSelfDeclarationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ESignSelfDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
