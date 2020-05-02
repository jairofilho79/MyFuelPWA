const server = 'http://localhost:4200/';

const { getText, exists } = require('./utils');

jest.setTimeout(30000);

describe('Main flow of user registration', () => {
  beforeAll(async () => {
    await page.goto(server+'registerUser');
  });
  it('should find the page title', async () => {
    const headerTitleSelector = '.title';
    await page.waitForSelector(headerTitleSelector, { visible: true });
    const headerTitle = await getText(page, headerTitleSelector);
    expect(headerTitle).toBe('Cadastre-se');
  })
  it('should have a form with 3 inputs', async () => {
    const userNameInputSelector = '#userName';
    const userEmailInputSelector = '#userEmail';
    const userPasswordInputSelector = '#userPassword';
    const form = '.form';
    await page.waitForSelector(form, { visible: true });
    expect(exists(page, userNameInputSelector)).resolves.toBeTruthy();
    expect(exists(page, userEmailInputSelector)).resolves.toBeTruthy();
    expect(exists(page, userPasswordInputSelector)).resolves.toBeTruthy();
  });
  it('should have a disabled submit button before fill the form', async () => {
    const disabledSubmitButtonSelector = "#submitButton[disabled]";
    await page.waitForSelector(disabledSubmitButtonSelector);
    const isDisabled = await exists(page, disabledSubmitButtonSelector)
    expect(isDisabled).toBeTruthy();
  })
  it('should fill the form and submit', async () => {
    const userNameInputSelector = '#userName';
    const userEmailInputSelector = '#userEmail';
    const userPasswordInputSelector = '#userPassword';
    const userConfirmPasswordInputSelector = '#userConfirmPassword';
    const submitButtonSelector = "#submitButton";
    await page.type(userNameInputSelector, "user1");
    await page.type(userEmailInputSelector, "user1@email.com");
    await page.type(userPasswordInputSelector, "password");
    await page.type(userConfirmPasswordInputSelector, "password");
    await page.click(submitButtonSelector);
  })
  it('should show a success message and redirect to login', async () => {
    const title = '.toast-title';
    const message = '.toast-message';
    await page.waitForSelector(title);
    const titleText = await getText(page, title);
    expect(titleText).toContain('Sucesso');
    await page.waitForSelector(message);
    const messageText = await getText(page, message);
    expect(messageText).toContain('Usuário cadastrado com sucesso');
    await page.click(message);
    await page.waitForNavigation();
    const url = page.url();
    expect(url).toContain('login');
  });
})
