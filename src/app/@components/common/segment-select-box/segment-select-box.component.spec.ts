import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentSelectBoxComponent } from './segment-select-box.component';

describe('SegmentSelectBoxComponent', () => {
  let component: SegmentSelectBoxComponent;
  let fixture: ComponentFixture<SegmentSelectBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SegmentSelectBoxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentSelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });
});
