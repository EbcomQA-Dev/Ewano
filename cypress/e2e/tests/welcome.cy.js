import { welcomePage } from '../pages/welcomePage.js';
import { LoginPage } from '../pages/LoginPage';
import { TestData, TEST_PHONE_NUMBER5, TEST_OTP_NUMBER1 } from '../../support/testData';

describe('Welcome Flow', () => {
  const welcome = new welcomePage();
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER5, TEST_OTP_NUMBER1);
    cy.wrap(TEST_PHONE_NUMBER5).as('testPhone');
  });

  // جلوگیری از fail شدن تست روی خطاهای غیرمرتبط
  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('520') || err.message.includes('deleteRule')) {
      return false;
    }
  });

  it('should show and validate welcome card and active welcome package', () => {
    welcome.getWelcomePackage();
    welcome.assertGetWelcomePackageAPIResponse();
    welcome.assertWelcomePackageUI();
    welcome.activateWelcomeGiftPackage()
  });
 it('should show and validate welcome card after 3th and 7th transaction and active welcome package', () => {
  welcome.getAndActivateWelcomeGiftPackageFor3thAnd7th();
  welcome.confirmSeventhAndThirdGiftPackage()
  });
});
