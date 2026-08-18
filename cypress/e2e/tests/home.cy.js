/// <reference types="cypress" />

import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/LoginPage';
import { LogOutPage } from '../pages/LogOutPage';
import {
  TEST_PHONE_NUMBER,
  TEST_OTP_NUMBER1
} from '../../support/testData';

const homePageInstance = new HomePage();
const loginPage = new LoginPage();
const logOutPage = new LogOutPage();

describe('Home balances - UI & API Test', () => {

  beforeEach(() => {
    cy.intercept('GET', '**/wallet/v1.2/balance').as('getBalance');
    cy.intercept('GET', '**/ewano-config.json').as('getConfig');

    loginPage.successfulLogIn(
      TEST_PHONE_NUMBER,
      TEST_OTP_NUMBER1
    );

    logOutPage.logOut();

    loginPage.successfulLogIn(
      TEST_PHONE_NUMBER,
      TEST_OTP_NUMBER1
    );

    cy.wait('@getConfig');

    Cypress.on('uncaught:exception', () => false);
  });

  it('should match config wallet order with balance titles', () => {

    cy.wait('@getBalance').then(({ response: balanceResponse }) => {

      cy.get('@getConfig').then(({ response: configResponse }) => {

        const configHome =
          configResponse.body?.result?.data?.configuration?.basic?.walletTags?.home;

        expect(configHome).to.exist;
        expect(configHome).to.be.an('array').and.not.be.empty;

        const expectedKeys = configHome.map(item => item.key);

        const balances =
          balanceResponse.body?.result?.data?.balances || [];

        expect(balances).to.be.an('array').and.not.be.empty;

        const filteredBalances = balances.filter(
          balance => balance.title !== 'فعال سازی بسته'
        );

        const balanceKeys = filteredBalances.map(
          balance => balance.tags
        );

        const filteredExpectedKeys = expectedKeys.filter(key =>
          balanceKeys.includes(key)
        );

        expect(filteredExpectedKeys).to.deep.equal(balanceKeys);

      });
    });
  });
});

describe('Home Cards - UI Test', () => {

  beforeEach(() => {

    cy.intercept('GET', '**/credit/v1.0').as('getHamrahiCredit');

    loginPage.successfulLogIn(
      TEST_PHONE_NUMBER,
      TEST_OTP_NUMBER1
    );

    Cypress.on('uncaught:exception', () => false);
  });

  it('Clicking the expand icon should open the card', () => {
    homePageInstance.findCashCard();
    homePageInstance.assertOpen();
  });

  it.only('Clicking the info icon on a card should open the Info modal', () => {
    homePageInstance.findHamrahiCreditCard();
    homePageInstance.infoIcon();
    homePageInstance.assertInfo();
  });

  it('Verify the Hamrahi credit card status based on API response', () => {

    cy.wait('@getHamrahiCredit').then(({ response }) => {

      const status =
        response.body?.result?.data?.status;

      homePageInstance.checkStatusAssert(status);

    });
  });

  it('Accurate rendering of balance cards according to configured priorities', () => {

    homePageInstance.assertServiceIconsAndBottomMenuVisible();

  });
});