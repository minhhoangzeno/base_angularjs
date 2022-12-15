import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadScenarioComponent } from './download-scenario.component';

describe('DownloadScenarioComponent', () => {
  let component: DownloadScenarioComponent;
  let fixture: ComponentFixture<DownloadScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadScenarioComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });
});
