import { KpiFormattingPipe } from './kpi-formatting.pipe';

describe('KpiFormattingPipe', () => {
  it('create an instance', async () => {
    const pipe = new KpiFormattingPipe();
    await expect(pipe).toBeTruthy();
  });
});
