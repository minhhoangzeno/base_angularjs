import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExternalRGeneratedContentComponent } from './external-r-generated-content.component';

describe('ExternalRGeneratedContentComponent', () => {
  let component: ExternalRGeneratedContentComponent;
  let fixture: ComponentFixture<ExternalRGeneratedContentComponent>;

  beforeEach(
    waitForAsync(async () => {
      await TestBed.configureTestingModule({
        declarations: [ExternalRGeneratedContentComponent],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalRGeneratedContentComponent);
    component = fixture.componentInstance;
  });

  it('should create', async () => {
    await expect(component).toBeTruthy();
  });
  it('should send message to iframe', async () => {
    const v = await component.msg.toPromise();
    await expect(v).toEqual({ foo: 'bar' });

    const script = `window.parent.postMessage('{"foo": "bar"}', '*')`;
    component.src = `data:text/html,<script>${script}</script>`;
    fixture.detectChanges();
    // component.send(event);
  });
  it('should receive message from iframe', async () => {
    const v = await component.msg.toPromise();
    await expect(v).toEqual({ foo: 'bar', from: 'iframe' });
    const script = `
      window.addEventListener('message', e => {
        const msg = JSON.parse(e.data);
        msg.from = 'iframe';
        window.parent.postMessage(JSON.stringify(msg), '*');
      })`;
    component.src = `data:text/html,<script>${script}</script>`;
    fixture.detectChanges();
    component.send({ foo: 'bar' });
  });
});
