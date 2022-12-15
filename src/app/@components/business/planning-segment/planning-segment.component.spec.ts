import { TestBed } from '@angular/core/testing';
import { PlanningSegmentComponent } from './planning-segment.component';
import { ComponentsModule } from '../../components.module';
import { ThemeModule } from '../../../@theme/theme.module';
import { By } from '@angular/platform-browser';
import { NbDatepickerModule, NbDialogModule, NbPopoverModule } from '@nebular/theme';

/**TODO @Dat: Check why these test failed. Maybe related to the Widgets or Segments Management components */
xdescribe('PlanningSegmentComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanningSegmentComponent],
      imports: [
        ThemeModule.forRoot(),
        ComponentsModule,
        NbDatepickerModule.forRoot(),
        NbDialogModule.forRoot(),
        NbPopoverModule,
      ],
      providers: [],
    });
  });

  describe('generateDatePlaceholder', () => {
    it('generates date placholder based on plan', () => {
      const fixture = TestBed.createComponent(PlanningSegmentComponent);
      fixture.detectChanges();

      const component = fixture.componentInstance;
      component.plan = {} as any; // typed as 'any' so we don't need to specify all fields.
    });
  });

  it('is empty if there are no segments', async () => {
    const fixture = TestBed.createComponent(PlanningSegmentComponent);
    fixture.detectChanges();
    await expect(fixture.debugElement.queryAll(By.css('cel-tree-multiselect')).length).toBe(3);
  });
});
