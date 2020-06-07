const { server, clickElementByTextInside, vehicleList } = require('./utils');

jest.setTimeout(10000);

describe('Main flow', () => {
  beforeAll(async () => {
    await page.goto(server+'/home');
  });

  it('Should have an button to logout', async () => {
    await clickElementByTextInside(page, '.mat-icon', 'power_settings_new');
    // escape dialog
  })

  it.skip('Should display the username', async () => {
    await page.waitForSelector('#username');
  })

  it('Should display the logo', async () => {
    await page.waitForSelector('#logo');
  });

  it('Should verify if a list of vehicles is displayed', async () => {
    await page.waitForSelector(vehicleList, {visible: true});
  });

  it('Should click in first vehicle', async () => {
    await clickElementByTextInside(page, '.mat-row', 'JSF-7914');
  });

  it('Should come back to home page', async () => {
    await clickElementByTextInside(page, '.mat-icon', 'arrow_back');
  });

  it('Should be at home page', async () => {
    await page.waitForSelector(vehicleList, {visible: true});
  });
});
