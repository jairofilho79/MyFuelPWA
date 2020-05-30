const server = `http://localhost:4200`;

const { getTexts, getText } = require('./utils');

const paginatorSelector = '.mat-paginator-range-label';

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
    await page.waitForSelector("mf-general-list[ng-reflect-list-name='vehicle']", {visible: true});
  });

  it('Should verify if a new Vehicle button is displayed', async () => {
    await page.waitForSelector(".mat-button", {visible: true});
  });

  it('Should change tab on click the gas_station icon', async () => {
    await page.click('#mat-tab-label-0-1');
  });

  it('Should verify if a list of supplies is displayed', async () => {
    await page.waitForSelector("mf-general-list[ng-reflect-list-name='supply']", {visible: true});
  });

  it('Should verify if paginator is displayed', async () => {
    await page.waitForSelector('#loadMoreSupplies');
    await page.waitForSelector(paginatorSelector);
    const paginator = await getText(page, paginatorSelector);
    expect(paginator).toMatch("1 – 5 of 20")
  });

  it('Should load more supplies', async () => {
    await page.waitForSelector('#loadMoreSupplies');
    await page.click('#loadMoreSupplies');
    await page.waitFor(1000);
    const paginator = await getText(page, paginatorSelector);
    expect(paginator).toMatch("1 – 5 of 25")
  });

  it('Should load more button desappier when it have no more supplies', async () => {
    await page.waitForSelector('#loadMoreSupplies');
    await page.click('#loadMoreSupplies');
    await page.waitForSelector('#loadMoreSupplies', {hidden: true});
  });

  it('Should change the number of rows', async () => {
    await page.click('.mat-select-value');
    await page.waitForSelector('#mat-option-4');
    await page.click('#mat-option-4');
    const suppliesRows = await getTexts(page, '.mat-row');
    expect(suppliesRows.length).toBe(10);
  });
});
