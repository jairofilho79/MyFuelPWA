const { server, clickElementByTextInside, vehicleList } = require('./utils');

const supplyList = "mf-general-list[listname='vehicleSupply']"

jest.setTimeout(5000);

describe('Main flow', () => {
  beforeAll(async () => {
    await page.goto(server+'/home');
  });
  it('Should verify if a list of vehicles is displayed', async () => {
    await page.waitForSelector(vehicleList, {visible: true});
  });
  it('Should click in first vehicle', async () => {
    await clickElementByTextInside(page, '.mat-row', 'JSF-7914');
  })
  it('Should have a list of supplies', async () => {
    await page.waitForSelector(supplyList, {visible: true});
  })
  it('Should have loadMore button and add new', async () => {
    await clickElementByTextInside(page, '.mat-icon', 'cloud_download');
    await clickElementByTextInside(page, '.mat-icon', 'add');
    await page.goBack();
  });
  it('Should go to info tab', async () => {
    await clickElementByTextInside(page, '.mat-icon', 'info');
  });
  it('Should have vehicle infomations', async () => {
    await page.waitForSelector('#brand-model-year', {visible: true});
    await page.waitForSelector('#license-plate', {visible: true});
    await page.waitForSelector('#km', {visible: true});
    await page.waitForSelector('#tank', {visible: true});
    await page.waitForSelector('#color', {visible: true});
  });
});
