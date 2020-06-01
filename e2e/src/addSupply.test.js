const server = `http://localhost:4200`;

const { clickElementByTextInside, verifyToastMessage } = require('./utils');

const vehicleList = "mf-general-list[ng-reflect-list-name='vehicle']"

jest.setTimeout(5000);

describe('Main Flow', () => {
  beforeAll(async () => {
    await page.goto(server+'/home');
  });
  it('Should verify if a list of vehicles is displayed', async () => {
    await page.waitForSelector(vehicleList, {visible: true});
  });
  it('Should click in first vehicle', async () => {
    await clickElementByTextInside(page, '.mat-row', 'JSF-1009');
  })
  it('Should go to add supply page', async () => {
    await clickElementByTextInside(page, '.mat-icon', 'add');
  });
  it('Should have form inputs', async () => {
    await page.waitForSelector('#supplyPrice', {visible: true});
    await page.waitForSelector('#supplyPriceSupply', {visible: true});
    await page.waitForSelector('#supplyKm', {visible: true});
    await page.waitForSelector('#supplyGasStation', {visible: true});
    await page.waitForSelector('#submitButton[disabled=true]',{visible: true});
  })
  it('Should fill the form inputs', async () => {
    await page.type('#supplyPrice', '100');
    await page.type('#supplyPriceSupply', '5');
    await page.type('#supplyKm', '5254.65');
    await page.type('#supplyGasStation', 'Posto Ipiranga');
  });
  it('Should click at submit button', async () => {
    await page.waitForSelector('#submitButton[disabled]',{hidden: true});
    await page.click('#submitButton');
  })
  it('Should appear a successful toast', async () => {
    await verifyToastMessage(page, expect, 'Sucesso');
    await page.click('.toast-title');
    await page.waitForNavigation();
    const url = page.url();
    expect(url).toContain('vehicleDetail');
  });
});
