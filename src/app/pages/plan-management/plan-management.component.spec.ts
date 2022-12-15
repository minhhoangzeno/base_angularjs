import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NbDialogModule, NbDialogRef, NbToastrModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { PlanManagementStateService } from './plan-management-state.service';

import { PlanManagementComponent } from './plan-management.component';
import { PlanManagementModule } from './plan-management.module';

describe('PlanManagementComponent', () => {
  let component: PlanManagementComponent;
  let fixture: ComponentFixture<PlanManagementComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        imports: [
          ThemeModule.forRoot(),
          NbDialogModule.forRoot(),
          PlanManagementModule,
          NbToastrModule.forRoot(),
        ],
        declarations: [PlanManagementComponent],
        providers: [
          // Mock problematic services assigned value of dumb objects.
          { provide: PlanManagementStateService, useValue: {} },
          { provide: NbDialogRef, useValue: {} },
        ],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });
});
