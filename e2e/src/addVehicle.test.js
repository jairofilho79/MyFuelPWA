const server = `http://localhost:4200`;

const { getLicencePlate, verifyToastMessage } = require('./utils');

jest.setTimeout(20000);

describe('Main flow', () => {
  beforeAll(async () => {
    await page.goto(server+'/addVehicle');
  });
  it('Should verify if header is displayed', async () => {
    await page.waitForSelector("mf-header", {visible: true});
  });
  it('Should have form inputs', async () => {
    await page.waitForSelector('#vehicleColor', {visible: true});
    await page.waitForSelector('#vehicleYear', {visible: true});
    await page.waitForSelector('#vehicleTank', {visible: true});
    await page.waitForSelector('#vehicleKm', {visible: true});
    await page.waitForSelector('#vehicleBrand', {visible: true});
    await page.waitForSelector('#vehicleModel', {visible: true});
    await page.waitForSelector('#vehicleLicensePlate', {visible: true});
    await page.waitForSelector('#submitButton[disabled=true]',{visible: true});
  });
  it('Should fill form inputs', async () => {
    await page.type('#vehicleYear', '2020');
    await page.type('#vehicleTank', '55');
    await page.type('#vehicleKm', '4587.86');
    await page.type('#vehicleBrand', 'Jeep');
    await page.type('#vehicleModel', 'Compass');
    await page.type('#vehicleLicensePlate', getLicencePlate());
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
    expect(url).toContain('home');
  });
});
