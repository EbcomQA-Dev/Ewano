/// <reference types="cypress" />

export class BannerPage {
    // عناصر
    getCardTransferBanner = () => cy.contains('کارت به کارت');
    allBannersImages = () => cy.get('.slick-slide:not(.slick-cloned) img');
    getGoBackButton = () => cy.get('button.goBack');
    homePage = () => cy.contains('خرید شارژ');
    buyChargeButton      = () => cy.contains('خرید شارژ');
    phoneNumberSelect    = () => cy.get('[data-testid="selectNumber"]');
    confirmButton        = () => cy.contains('تایید');
    continueButton       = () => cy.get('[data-testid="continueButton"]');
    continueAndPay       = () => cy.contains('ادامه و پرداخت');
    confirmAndContinue   = () => cy.contains('تایید و ادامه');
    selectMCI     = () => cy.get('[data-testid="mci"]');
    wait = (ms = 2000) => cy.wait(ms);
  
    // متدها
    waitForBanners() {
      cy.intercept('GET', '/services/banner/v1.0?page=HOME').as('getBanners');
      cy.wait('@getBanners', { timeout: 10000 });
    }
    typePhoneNumber(phoneNumber) {
        this.phoneNumberInput().then($input => {
          cy.wrap($input)
            .should('be.visible')
            .clear({ force: true })
            .type(phoneNumber, { force: true });
        });
      }
      phoneNumberInput = () => cy.contains('label', 'شماره همراه')
      .invoke('attr', 'for')
      .then(id => cy.get(`#${CSS.escape(id)}`));
    getBannersFromResponse() {
      return cy.wait('@getBanners').then(({ response }) => {
        return response.body?.result?.data?.result || [];
      });
    }
  
    findBannerByActionCode(actionCode) {
      return this.getBannersFromResponse().then(banners => {
        const targetBanner = banners.find(b => b.action?.code === actionCode);
        expect(targetBanner, `${actionCode} banner should exist`).to.exist;
        return targetBanner;
      });
    }
  
    findBannerByActionCodeAndReturn(actionCode) {
      return this.getBannersFromResponse().then(banners => {
        const targetBanner = banners.find(b => b.action?.code === actionCode);
        expect(targetBanner, `${actionCode} banner should exist`).to.exist;
        return targetBanner;
      });
    }
  
    verifyBannerDisplayedReturn(targetImageUrl) {
      this.allBannersImages().then($images => {
        let targetIndex = -1;
        $images.each((i, el) => {
          const src = el.getAttribute('src');
          if (src === targetImageUrl && targetIndex === -1) {
            targetIndex = i;
          }
        });
  
        expect(targetIndex, 'index of target banner in UI').to.be.gte(0);
  
        cy.get('.slick-slide:not(.slick-cloned) img')
          .eq(targetIndex)
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
      });
    }
  
    assertReturn() {
      this.getGoBackButton().click();
      this.homePage().should('be.visible');
    }
  
    verifyBannerDisplayed(targetImageUrl) {
      this.allBannersImages().then($images => {
        let targetIndex = -1;
        $images.each((i, el) => {
          const src = el.getAttribute('src');
          if (src === targetImageUrl && targetIndex === -1) {
            targetIndex = i;
          }
        });
  
        expect(targetIndex, 'index of target banner in UI').to.be.gte(0);
  
        cy.get('.slick-slide:not(.slick-cloned) img')
          .eq(targetIndex)
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });
      });
    }
  
    verifyOnlyHomePageBanners() {
      this.getBannersFromResponse().then(banners => {
        const homeBannerImageUrls = banners
          .filter(b => b.page === 'HOME')
          .map(b => b.imageUrl);
  
        this.allBannersImages()
          .should('have.length.greaterThan', 0)
          .each($img => {
            const src = $img.attr('src');
            expect(
              homeBannerImageUrls,
              `Banner with src ${src} should be from page=HOME`
            ).to.include(src);
          });
      });
    }






    completePurchaseMCI(phoneNumber) {
        cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=TOPUP/).as('getTopup');
    
        this.buyChargeButton().click();
        this.phoneNumberSelect().click();
        this.typePhoneNumber(phoneNumber);
        cy.wrap(phoneNumber).as('testPhoneNumber');
        this.confirmButton().click();
        this.selectMCI().click();
        this.wait();
        this.continueButton().click();
        this.continueAndPay().click();
        this.confirmAndContinue().click();
      }




      // پیدا کردن بنر در رسید بر اساس actionCode
findReceiptBannerByActionCode(actionCode) {
    return cy.wait('@getReceiptBanners', { timeout: 30000 }).then(({ response }) => {
      const banners = response.body?.result?.data?.banner || [];
      const targetBanner = banners.find(b => b.action?.code === actionCode);
      expect(targetBanner, `${actionCode} banner should exist in receipt`).to.exist;
      return targetBanner;
    });
  }
  
  // کلیک روی بنر رسید
  clickReceiptBanner(targetBanner) {
    cy.get(`img[src="${targetBanner.imageUrl}"]`)
      .first()
      .scrollIntoView()
      .should('be.visible')
      .click({ force: true });
  }
  
  }
  