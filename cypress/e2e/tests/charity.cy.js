import { charityPages } from '../pages/charityPages.js';
import { LoginPage } from '../pages/LoginPage';
import { TestData,TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1} from '../../support/testData';

describe('charity Flow', () => {
  const charity = new charityPages();
    const loginPage = new LoginPage();
    const testData = new TestData();

beforeEach(() => {
      loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
    cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
    });

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });
// پرداخت کمک موفق به یکی از خیریه های بخش مهربانی
  it('success charity pay', () => {
    charity.payCharity();
    charity.assertAPIResponseCharity()
    charity.assertAPIResponseCharity()
  });
  // پرداخت کمک به خیریه باهم و چک افزایش مبلغ کمپین این خیریه به میزان مبلغ پرداخت شده
  it('success campaing pay', () => {
    charity.payCharityForCampaing(100000);
  });
// نمایش هلپر تکست در صورت وارد کردن مبلغ نامعتبر
  it('show helper text', () => {
    charity.showHelperTextForInvalidAmountInput(100);
    charity.assertInvalidAmountUI();
  });
});
