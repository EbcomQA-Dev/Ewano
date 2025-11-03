import { AccountInformationPage } from '../pages/AccountInformationPage.js';
import { LoginPage } from '../pages/LoginPage';
import { TestData, TEST_PHONE_NUMBER4 ,TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1 } from '../../support/testData';

describe('Account information Flow', () => {
  const accountInfoPage = new AccountInformationPage();
  const loginPage = new LoginPage();
  const testData = new TestData();

 beforeEach(() => {
  loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
  cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
  cy.intercept('GET', '**/services/user/**/profile').as('getProfile');
});

 Cypress.on('uncaught:exception', (err) => {
   if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });
 // نمایش اطلاعات حساب کاربری
  it('should show account information and validate UI', () => {
   accountInfoPage.showAccountInformation();
   accountInfoPage.assertShowInformationAccountUI();
 });


//  ثبت ایمیل غیر تکراری
it('should save and show email correctly', () => {
  const random = Math.floor(Math.random() * 100000); // عدد تصادفی
 const randomEmail = `test+${random}@gmail.com`;    // ایمیل یونیک
 accountInfoPage.saveEmailInAccountInformation(randomEmail);
 accountInfoPage.assertShowToastForSaveEmailUI();
});

  //  خروج از حساب کاربری
 it('should exit in account', () => {
  accountInfoPage.exitInAccount();
  accountInfoPage.assertExitAccountUI();
 });


  //  انصراف از خروج از حساب کاربری
  it('should cancel exit in account', () => {
   accountInfoPage.cancelExitInAccount();
   accountInfoPage.assertCancelExitAccountUI();
  });
});

describe('Account information Flow', () => {
  const accountInfoPage = new AccountInformationPage();
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER4,TEST_OTP_NUMBER1);
    cy.wrap(TEST_PHONE_NUMBER4).as('testPhone')
    cy.intercept('GET', '**/services/user/**/profile').as('getProfile');
 });

  Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });

  // قابل ادیت بودن فیلدهای نام و نام خانوادگی برای کاربران غیر همراه اولی
 it('should show account information and editable field', () => {
   accountInfoPage.editableAccountInformation();
   accountInfoPage.assertFieldsAreEditable();
 });
// وارد کردن نام با فرمت نامعتبر و نمایش هلپر تکست
 it('should show helpertext', () => {
   accountInfoPage.wrongFormatInputDataInAccountInformation('7');
    accountInfoPage.assertHelperTextUI();
  });

});
