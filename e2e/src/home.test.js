const server = `http://localhost:4200`;
const { getElements } = require('./utils');
jest.setTimeout(20000);

describe('Main flow', () => {
  beforeAll(async () => {
    await page.goto(server+'/home');
  });

  it('Should verify if header is displayed', async () => {
    await page.waitForSelector("mf-header", {visible: true});
  });

  it('Should verify if tabs is displayed', async () => {
    // expect(exists(page, 'mat-')).resolves.toBeTruthy();
    await page.waitForSelector(".mat-tab-labels");
    const icons = await getElements(page, '.mat-tab-labels mat-icon');
    expect(icons.length).toBe(2);
    expect(icons[0]).toMatch("car");
    expect(icons[1]).toMatch("gas_station");
  });

  it('Should verify if a list of vehicles is displayed', async () => {
    await page.waitForSelector("mat-list", {visible: true});
  });

  it('Should verify if a new Vehicle button is displayed', async () => {
    await page.waitForSelector(".mat-button", {visible: true});
  });
});
