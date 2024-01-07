import { initProject } from "@/lib/init";

describe('build', () => {
  it('should build correctly', async () => {
    await initProject('./__app_example_1', 'js-single');
  })
})
