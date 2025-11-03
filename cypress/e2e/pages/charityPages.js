/// <reference types="cypress" />

/* ---------- selector ---------- */
export class charityPages {
    servicesButton     = () => cy.get('.MuiBottomNavigation-root > :nth-child(2)', { timeout: 10000 })
    charityTab = () => cy.contains("مهربانی")
    charityButton = () => cy.contains('خیریه')
    charityCard = () => cy.get('.MuiCard-root').eq(0)
    selectCharity = () => cy.contains ('خیریه صبح رویش')
    selectAmount =() => cy.get('h6 > p').contains('50,000').should('be.visible');
    amountInput = () => cy.get('input[inputmode="numeric"][type="text"].MuiInputBase-input');
    paymentButton = () => cy.contains ('پرداخت')
    countinueAndPay = () => cy.contains ('ادامه و پرداخت')
    confirmAndCountinue = () => cy.contains ('تایید و ادامه')
    backToHome = () => cy.contains ('بازگشت به خانه')

    receiptCard = (opts = {}) => cy.get('#layout-content', opts); // رسید خرید موفق
          
          


  /* ---------- flows ---------- */
  // پرداخت کمک موفق به یکی از خیریه های بخش مهربانی
  payCharity() {
    cy.intercept('POST', '**/services/charity/v1.0/**/participate').as('postCharityParticipate');
    cy.intercept('GET', '**/transaction/**?type=CHARITY').as('getCharity');


    this.servicesButton().click();
    cy.wait(500);
    this.charityTab().click();
    cy.wait(500);
    this.charityButton().click();
    cy.wait(500);
    this.selectCharity().click();

    cy.wait(500);

        this.selectAmount().click();
        cy.wait(500);
        this.paymentButton().click();
        cy.wait(500)
        this.countinueAndPay().click()
        cy.wait(500)
        this.confirmAndCountinue().click()
        cy.wait('@postCharityParticipate', { timeout: 15000 });

        cy.wait('@getCharity', { timeout: 10000 });
        
        
  }
// پرداخت کمک به خیریه باهم و چک افزایش مبلغ کمپین این خیریه به میزان مبلغ پرداخت شده
  payCharityForCampaing(amount) {
    cy.intercept('GET', '**/services/charity/v1.0?status=ACTIVE**').as('getCharityList'); // آدرس دقیق‌تری برای API
    cy.intercept('POST', '**/services/charity/v1.0/**/participate').as('postCharityParticipate');
    cy.intercept('GET', '**/transaction/**?type=CHARITY').as('getCharity');
  
    // مرحله 1: گرفتن usedAmount قبل از پرداخت
    this.servicesButton().click();
    cy.wait(500);
    this.charityTab().click();
    cy.wait(500);
    this.charityButton().click();
    cy.wait('@getCharityList').then((interception) => {
      const data = interception.response.body.result.data;
      const yalda = data.find(item => item.title.includes("باهم") && item.campaign?.title === "شب یلدا");
  
      expect(yalda).to.exist;
      const initialUsedAmount = yalda.campaign.usedAmount;
      cy.wrap(initialUsedAmount).as('initialUsedAmount');
    });
  
    // مرحله 2: ورود به کارت خیریه و پرداخت
  this.charityCard().click(); // خیریه‌ای که کمپین "شب یلدا" داره
  cy.wait(500);
  this.amountInput().clear().type(amount);
   cy.wrap(amount).as('testAmount');
  cy.wait(500);
  this.paymentButton().click();
    cy.wait(500);
    this.countinueAndPay().click();
   cy.wait(500);
   this.confirmAndCountinue().click();
   cy.wait('@postCharityParticipate', { timeout: 15000 });
   cy.wait('@getCharity', { timeout: 15000 });
  
    // مرحله 3: بازگشت به صفحه اصلی و ورود مجدد به خیریه
   cy.wait(1000);
   this.backToHome().click();
   this.servicesButton().click();
  cy.wait(500);
  this.charityTab().click();
   cy.wait(500);
   this.charityButton().click();
  
    // مرحله 4: گرفتن usedAmount جدید و بررسی تغییر
   cy.wait('@getCharityList').then((interception) => {
   const data = interception.response.body.result.data;
   const yalda = data.find(item => item.title.includes("باهم") && item.campaign?.title === "شب یلدا");
  
    expect(yalda).to.exist;
     const updatedUsedAmount = yalda.campaign.usedAmount;
  
     cy.get('@initialUsedAmount').then(initial => {
     cy.get('@testAmount').then(amount => {
      expect(updatedUsedAmount).to.eq(initial + Number(amount));
     });
    });
   });
  }
  // نمایش هلپر تکست در صورت وارد کردن مبلغ نامعتبر
  showHelperTextForInvalidAmountInput(amount) {
    cy.intercept('GET', '**/services/charity/v1.0?status=ACTIVE**').as('getCharityList'); // آدرس دقیق‌تری برای API
  
    // مرحله 1: گرفتن usedAmount قبل از پرداخت
    this.servicesButton().click();
    cy.wait(500);
    this.charityTab().click();
    cy.wait(500);
    this.charityButton().click();
    cy.wait('@getCharityList').then((interception) => {
      const data = interception.response.body.result.data;
      const yalda = data.find(item => item.title.includes("باهم") && item.campaign?.title === "شب یلدا");
  
      expect(yalda).to.exist;
      const initialUsedAmount = yalda.campaign.usedAmount;
      cy.wrap(initialUsedAmount).as('initialUsedAmount');
    });
  
    // مرحله 2: ورود به کارت خیریه و پرداخت
  this.charityCard().click(); // خیریه‌ای که کمپین "شب یلدا" داره
  cy.wait(500);
  this.amountInput().clear().type(amount);
  }

  /* ---------- assertions ---------- */

  assertAPIResponseCharity() {
    cy.get('@postCharityParticipate').then((interception) => {
      const result = interception.response.body.result;
      expect(result.status.code).to.eq(200);
    });
    cy.wait(500)
    cy.get('@getCharity').then((interception) => {
        const result = interception.response.body.result;
        expect(result.status.code).to.eq(200);
        expect(result.data.status).to.eq('COMPLETED');
        expect(result.data.title).to.eq('همراه مهربانی');
    
        const items = result.data.data;
        const service = items.find(i => i.title === 'نوع خدمت');
        const phone   = items.find(i => i.title === 'نام موسسه');

        });
      }

  assertReceiptUI() {
    cy.get('@getCharity');
    this.receiptCard({ timeout: 30000 })
      .should('be.visible')
      .and('contain.text', 'عملیات موفق')
      .and('contain.text', 'همراه مهربانی');
  }

  // مشاهده هلپر تکست خطا در صورت وارد کردن شماره کارت نامعتبر
  assertInvalidAmountUI() {
    cy.get('.MuiFormHelperText-root').should('contain.text', 'نمیشه که! مبلغ کمتر از هزار تومن نمیشه باشه.');
  }
}
