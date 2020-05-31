const server = `http://localhost:4200`;

const { getTexts, getText } = require('./utils');

const paginatorSelector = '.mat-paginator-range-label';
const loadMoreButton = '#loadMoreSupplies';
const matSelect = '.mat-select-value'
const vehicleTab = '#mat-tab-label-0-0'
const gasStationTab = '#mat-tab-label-0-1'
const vehicleList = "mf-general-list[ng-reflect-list-name='vehicle']"
const supplyList = "mf-general-list[ng-reflect-list-name='supply']";
const addVehicleButton = ".mat-button";

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
    const icons = await getTexts(page, '.mat-tab-labels mat-icon');
    expect(icons.length).toBe(2);
    expect(icons[0]).toMatch("car");
    expect(icons[1]).toMatch("gas_station");
  });

  it('Should verify if a list of vehicles is displayed', async () => {
    await page.waitForSelector(vehicleList, {visible: true});
  });

  it('Should verify if a new Vehicle button is displayed', async () => {
    await page.waitForSelector(addVehicleButton, {visible: true});
  });

  it('Should change tab on click the gas_station icon', async () => {
    await page.click(gasStationTab);
  });

  it('Should verify if a list of supplies is displayed', async () => {
    await page.waitForSelector(supplyList, {visible: true});
  });

  it('Should verify if paginator is displayed', async () => {
    await page.waitFor(1000);
    const paginator = await getText(page, paginatorSelector);
    expect(paginator).toMatch("1 – 5 of 20")
  });

  it('Should load more supplies', async () => {
    await page.waitForSelector(loadMoreButton);
    await page.click(loadMoreButton);
    await page.waitFor(1000);
    const paginator = await getText(page, paginatorSelector);
    expect(paginator).toMatch("1 – 5 of 25")
  });

  it('Should load more button desappier when it have no more supplies', async () => {
    await page.waitForSelector(loadMoreButton);
    await page.click(loadMoreButton);
    await page.waitForSelector(loadMoreButton, {hidden: true});
  });

  it('Should change the number of rows', async () => {
    await page.click(matSelect);
    await page.waitForSelector('#mat-option-4');
    await page.click('#mat-option-4');
    const suppliesRows = await getTexts(page, '.mat-row');
    expect(suppliesRows.length).toBe(10);
  });

  it.skip('Should go to add vehicle page and come back', async () => {
    //unstable for unknown reason
    await page.click(vehicleTab);
    await page.waitForSelector(addVehicleButton);
    await page.click(addVehicleButton);
    await page.waitForSelector('.title', { visible: true });
    const url = page.url();
    console.log(url);
    expect(url).toContain('addVehicle');
  })
});
