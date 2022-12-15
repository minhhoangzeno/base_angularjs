import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NbDialogModule } from '@nebular/theme';
import { ThemeModule } from '../../../@theme/theme.module';
import { ComponentsModule } from '../../components.module';
import { RouterTestingModule } from '@angular/router/testing';

import { PlanningImportComponent } from './planning-import.component';

describe('PlanningImportComponent', () => {
  let component: PlanningImportComponent;
  let fixture: ComponentFixture<PlanningImportComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        imports: [
          ThemeModule.forRoot(),
          NbDialogModule.forRoot(),
          ComponentsModule,
          NoopAnimationsModule,
          RouterTestingModule,
        ],
        declarations: [PlanningImportComponent],
      }).compileComponents();
    }),
  );

  it('should create', async () => {
    fixture = TestBed.createComponent(PlanningImportComponent);
    fixture.detectChanges();

    component = fixture.componentInstance;

    await expect(component).toBeTruthy();
  });
});
