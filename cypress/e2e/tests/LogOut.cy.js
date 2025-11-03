import { LogOutPage } from '../pages/LogOutPage'
import { LoginPage } from '../pages/LoginPage';
import { TEST_PHONE_NUMBER  , TEST_OTP_NUMBER1} from '../../support/testData';

describe('Login Test', () => {
  const logOutPage = new LogOutPage()
  const loginPage = new LoginPage();
  beforeEach(() => {
    cy.intercept('GET', '**/ewano-config.json').as('getConfig');
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1);
    cy.wait('@getConfig');
    Cypress.on('uncaught:exception', () => false);
  });

  it('log out', () => {

    logOutPage.logOut();
    
  });






});