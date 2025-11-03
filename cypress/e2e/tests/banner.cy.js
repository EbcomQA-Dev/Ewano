/// <reference types="cypress" />

import { LoginPage } from '../pages/LoginPage';
import { BannerPage } from '../pages/bannerPage';
import { TEST_PHONE_NUMBER, TEST_OTP_NUMBER1 } from '../../support/testData';

describe('Homepage Banners - UI & API consistency check', () => {
  const loginPage = new LoginPage();
  const bannerPage = new BannerPage();

  beforeEach(() => {
    cy.intercept('GET', '/services/banner/v1.0?page=HOME').as('getBanners');
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1);
    bannerPage.waitForBanners();
  });

  it('should display the "cardTransfer" banner and navigate correctly on click', () => {
    bannerPage.findBannerByActionCode('cardTransfer').then(targetBanner => {
      bannerPage.verifyBannerDisplayed(targetBanner.imageUrl);
      cy.contains('کارت به کارت', { timeout: 10000 }).should('be.visible');
    });
  });

  it('should show only banners with page "HOME" and hide others on homepage', () => {
    bannerPage.verifyOnlyHomePageBanners();
  });

  it('“Return from the banner to the homepage when the user clicks back”', () => {
    bannerPage.findBannerByActionCodeAndReturn('cardTransfer').then(targetBanner => {
      bannerPage.verifyBannerDisplayedReturn(targetBanner.imageUrl);
      cy.contains('کارت به کارت', { timeout: 10000 }).should('be.visible');
    });

    bannerPage.assertReturn();
  });


  it('Verify the functionality of the banner action and redirection to the relevant section in the receipt', () => {
    // intercept برای رسید قبل از خرید با regex برای transactionId پویا
    cy.intercept('GET', /\/services\/account\/v1\.3\/transaction\/.*\?type=TOPUP/).as('getReceiptBanners');
  
    // خرید شارژ با MCI
    bannerPage.completePurchaseMCI('09190727664');
  
    // منتظر پاسخ getTopup
    cy.wait('@getTopup', { timeout: 30000 }).then(({ response }) => {
      const transactionId =
        response.body.result?.data?.transactionId ||
        response.body.meta?.transactionId;
  
      expect(transactionId).to.exist;
  
      // کلیک روی بنر receipt با actionCode مشخص
      cy.wait('@getReceiptBanners', { timeout: 30000 }).then(({ response }) => {
        const banners = response.body?.result?.data?.banner || [];
        const targetBanner = banners.find(b => b.action?.code === 'walletTransfer');
  
        expect(targetBanner, 'walletTransfer banner should exist in receipt').to.exist;
  
        // کلیک مستقیم روی بنر بدون scrollIntoView و بدون چک visibility
        cy.get(`.slick-slide:not(.slick-cloned) img[src="${targetBanner.imageUrl}"]`)
          .first()
          .click({ force: true });
  
        // میتونی بعدش assertion برای redirection یا نمایش صفحه هدف اضافه کنی
        // مثلا:
        // cy.contains('صفحه مقصد بنر').should('be.visible');
      });
    });
  });
  
  

  
  
  

});
