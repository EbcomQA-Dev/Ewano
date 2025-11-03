/// <reference types="cypress" />
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/LoginPage';
import { LogOutPage } from '../pages/LogOutPage';
import { TEST_PHONE_NUMBER , TEST_OTP_NUMBER1 } from '../../support/testData';

describe('Home balances - UI & API Test', () => {
  const homePageInstance = new HomePage();
  const loginPage = new LoginPage();
  const logOutPage = new LogOutPage();

  beforeEach(() => {
    cy.intercept('GET', '**/wallet/v1.2/balance').as('getBalance');
    cy.intercept('GET', '**/ewano-config.json').as('getConfig');

    // لاگین اول
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)

    // لاگ اوت
    logOutPage.logOut();

    // لاگین دوم
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)

    // صبر برای رسیدن درخواست کانفیگ
    cy.wait('@getConfig');

    // جلوگیری از خطاهای جاوااسکریپت ناشناخته
    Cypress.on('uncaught:exception', () => false);
  });


  it('should match config wallet order with balance titles (via intercept)', () => {
    cy.get('@getConfig').then(({ response }) => {
      const configHome = response.body?.result?.data?.configuration?.basic?.walletTags?.home;
      expect(configHome).to.exist;
      expect(configHome).to.be.an('array').and.not.be.empty;
    
      const expectedKeys = configHome.map(item => item.key);
    
      cy.get('@getBalance').then(({ response }) => {
        const balances = response.body?.result?.data?.balances || [];
        expect(balances).to.be.an('array').and.not.be.empty;
    
        // فیلتر کردن آیتم‌هایی که title آنها "فعال سازی بسته" است (نادیده گرفتن آنها)
        const filteredBalances = balances.filter(b => b.title !== 'فعال سازی بسته');
    
        const balanceKeys = filteredBalances.map(b => b.tags);
    
        // حالا مقایسه با expectedKeys
        const filteredExpectedKeys = expectedKeys.filter(key => balanceKeys.includes(key));
    
        expect(filteredExpectedKeys).to.deep.equal(balanceKeys);
    
        cy.log('✅ ترتیب نمایش کیف پول‌ها درست است (با حذف فعال سازی بسته)');
      });
    });
    

  });
});

describe('Home balances - UI & API Test', () => {
  const homePageInstance = new HomePage();
  const loginPage = new LoginPage();
  const logOutPage = new LogOutPage();
  beforeEach(() => {
    cy.intercept('GET', '**/credit/v1.0').as('getHamrahiCredit');
   
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)
    Cypress.on('uncaught:exception', () => false);
  });

  it('Clicking the expand icon should open the card', () => {
    homePageInstance.findCashCard();
    homePageInstance.assertOpen();
  });

  it('Clicking the info icon on a card should open the Info modal', () => {
    homePageInstance.findHamrahiCreditCard();
    homePageInstance.infoIcon();
    homePageInstance.assertInfo();
  });



  it('Verify the Hamrahi credit card status based on the status value returned by the service', () => {


    cy.wait('@getHamrahiCredit').then(({ response }) => {

      const status = response.body?.result?.data?.status;

      homePageInstance.checkStatusAssert(status)
      
    });    
  });


  it('Accurate rendering of balance cards according to the configured priorities.', () => {
    
    homePageInstance.assertServiceIconsAndBottomMenuVisible()


  
  });
  





});

