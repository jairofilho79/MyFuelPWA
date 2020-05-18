// const server = `http://localhost:${process.env.ENV === 'prod' ? '8080' : '4200'}`;
const server = `http://localhost:4200`;

const { getText, getUniqueString, clearForm } = require('./utils');

jest.setTimeout(20000);

async function pageTitle() {
  const headerTitleSelector = '.title';
  await page.waitForSelector(headerTitleSelector, { visible: true });
  const headerTitle = await getText(page, headerTitleSelector);
  expect(headerTitle).toBe('Cadastre-se');
}

async function formsInput() {
  const userNameInputSelector = '#userName';
  const userEmailInputSelector = '#userEmail';
  const userPasswordInputSelector = '#userPassword';
  const userConfirmPasswordInputSelector = '#userConfirmPassword';
  const form = '.form';
  await page.waitForSelector(form, { visible: true });
  await page.waitForSelector(userNameInputSelector, { visible: true });
  await page.waitForSelector(userEmailInputSelector, { visible: true });
  await page.waitForSelector(userPasswordInputSelector, { visible: true });
  await page.waitForSelector(userConfirmPasswordInputSelector, { visible: true });
}

async function disabledSubmitButton() {
  const disabledSubmitButtonSelector = "#submitButton[disabled]";
  await page.waitForSelector(disabledSubmitButtonSelector);
}

async function fillForm(name, email, password, confirmPassword) {
  const userNameInputSelector = '#userName';
  const userEmailInputSelector = '#userEmail';
  const userPasswordInputSelector = '#userPassword';
  const userConfirmPasswordInputSelector = '#userConfirmPassword';
  await page.type(userNameInputSelector, name);
  await page.type(userEmailInputSelector, email);
  await page.type(userPasswordInputSelector, password);
  await page.type(userConfirmPasswordInputSelector, confirmPassword);
}

async function submitForm() {
  const submitButtonSelector = "#submitButton";
  await page.click(submitButtonSelector);
}

async function verifyToastMessage(titleMessage) {
  const title = '.toast-title';
  await page.waitForSelector(title);
  const titleText = await getText(page, title);
  expect(titleText).toContain(titleMessage);
}

describe('Main flow of user registration', () => {
  beforeAll(async () => {
    await page.goto(server+'/registerUser');
  });
  it('should find the page title', pageTitle);
  it('should have a form with 4 inputs', formsInput);
  it('should have a disabled submit button before fill the form', disabledSubmitButton);
  it('should fill the form and submit', async () => {
    await fillForm("user1", getUniqueString()+"@email.com", "password", "password");
    await submitForm();
  })
  it('should show a success message and redirect to login', async () => {
    await verifyToastMessage('Sucesso');
    await page.click('.toast-title');
    await page.waitForNavigation();
    const url = page.url();
    expect(url).toContain('login');
  });
})

describe('Invalid Data flow of user registration', () => {
  beforeAll(async () => {
    await page.goto(server+'/registerUser');
  });
  beforeEach(async () => {
    await clearForm(page, '.form');
  });
  it('should have a form with 4 inputs', formsInput);
  it('should fill partially the form and have a disabled submit button', async () => {
    const userNameInputSelector = '#userName';
    const userEmailInputSelector = '#userEmail';
    const userPasswordInputSelector = '#userPassword';
    const userConfirmPasswordInputSelector = '#userConfirmPassword';
    await page.type(userNameInputSelector, "");
    await disabledSubmitButton();
    await page.type(userNameInputSelector, "user2");
    await page.type(userEmailInputSelector, "user1");
    await disabledSubmitButton();
    await page.type(userPasswordInputSelector, "");
    await disabledSubmitButton();
    await page.type(userPasswordInputSelector, "pas");
    await page.type(userConfirmPasswordInputSelector, "pas");
    await disabledSubmitButton();
    await page.type(userPasswordInputSelector, "passwordpassword");
    await page.type(userConfirmPasswordInputSelector, "passwordpassword");
    await disabledSubmitButton();
  });
  it('should return a business rule error', async () => {
    await fillForm("user", "user@mail.com", "password", "password");
    await submitForm();
    await verifyToastMessage("Erro");
  });
})
