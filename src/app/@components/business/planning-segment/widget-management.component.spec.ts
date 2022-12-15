import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WidgetManagementDialogComponent } from './widget-management.component';

/* TODO: This test was auto-created by the ng command. Need to implement the real test.*/
xdescribe('WidgetManagementComponent', () => {
  let component: WidgetManagementDialogComponent;
  let fixture: ComponentFixture<WidgetManagementDialogComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [WidgetManagementDialogComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetManagementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });
});
