/// <reference types="cypress" />
import jalaali from 'jalaali-js';
import { LoginPage } from '../pages/LoginPage';
import { MpgPage } from '../pages/MpgPage';
import { TransactionPage } from '../pages/transactionPage';
import { TEST_OTP_NUMBER2, TEST_PHONE_NUMBER3 } from '../../support/testData';

describe('Transaction Page - Wallet and Card-to-Card Transactions', () => {
  const loginPage = new LoginPage();
  const gPage = new MpgPage();

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.intercept('GET', '**/ewano-config.json').as('getConfig');
    loginPage.successfulLogIn(TEST_PHONE_NUMBER3, TEST_OTP_NUMBER2);
  });

  it('Successful wallet balance top-up via in-app payment gateway', () => {
    gPage.increaseWalletBalanceWithExistingCard('674', '0440034922');
  });

  it('Should show warning when less than 5 characters are entered', () => {
    gPage.assetIncreaseWalletBalance('67', '1234');
  });

  it.only('Fail purchase via in-app gateway with wrong CVV2 and show error snackbar', () => {
    gPage.failPurchaseWithWrongCVV2('675', '0440034922');
  });

  it('Fail purchase via in-app gateway with wrong dynamic password and show error snackbar', () => {
    gPage.failPurchaseWithWrongDynamicPassword('675', '0440034923');
  });

  it('Fail purchase with card not belonging to logged-in user and show authentication error snackbar', () => {
    gPage.failPurchaseWithUnauthorizedCard('675', '0440034923');
  });

  it('Fail purchase via in-app gateway when card balance is insufficient and show error snackbar', () => {
    gPage.failPurchaseWithInsufficientBalance('674', '0440034922');
  });

  it('Successful in-app payment and service purchase via selected card', () => {
    gPage.successfulInAppPaymentForService('09190727664', '674', '0440034922');
  });


  it('should enforce minAmountMpg validation in MPG payment flow', () => {


  });

});





