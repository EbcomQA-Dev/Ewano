/// <reference types="cypress" />

export class PurchaseChargePage {
  // عناصر عمومی
  buyChargeButton      = () => cy.contains('خرید شارژ');
  phoneNumberSelect    = () => cy.get('[data-testid="selectNumber"]');
  confirmButton        = () => cy.contains('تایید');
  continueButton       = () => cy.get('[data-testid="continueButton"]');
  continueAndPay       = () => cy.contains('ادامه و پرداخت');
  confirmAndContinue   = () => cy.contains('تایید و ادامه');
  customAmountButton   = () => cy.contains('مبلغ دلخواه');
  paymentButton        = () => cy.contains('پرداخت');
  receiptCard          = (opts = {}) => cy.get('.MuiCard-root', opts);
  toast                = () => cy.get('.Toastify__toast--error');
  allToast             = () => cy.get('.toast-container');
  sharingReceiptButton = () => cy.contains('اشتراک گذاری');
  sharingReceiptText   = () => cy.contains('متنی');
  getCategoryTitle     = () => cy.contains('شگفت‌انگیز');
  getSuperchargeTitle  = () => cy.contains('فوق العاده');
  getTopupAmount       = () => cy.contains('50,000');

  // انتخاب اپراتورها
  selectMCI     = () => cy.get('[data-testid="mci"]');
  selectMTN     = () => cy.get('[data-testid="mtn"]');
  selectTaliya  = () => cy.get('[data-testid="tly"]');

  // ورودی شماره و مبلغ
  phoneNumberInput = () => cy.contains('label', 'شماره همراه')
    .invoke('attr', 'for')
    .then(id => cy.get(`#${CSS.escape(id)}`));

  customAmountInput = () => cy.get('[data-testid="customPriceInput"] input');

  // متد کمکی برای تایپ شماره
  typePhoneNumber(phoneNumber) {
    this.phoneNumberInput().then($input => {
      cy.wrap($input)
        .should('be.visible')
        .clear({ force: true })
        .type(phoneNumber, { force: true });
    });
  }

  wait = (ms = 2000) => cy.wait(ms);
  print = text => cy.log(text);

  // خرید برای هر اپراتور
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

  completePurchaseMTN(phoneNumber) {
    cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=TOPUP/).as('getTopup');

    this.buyChargeButton().click();
    this.phoneNumberSelect().click();
    this.typePhoneNumber(phoneNumber);
    cy.wrap(phoneNumber).as('testPhoneNumber');
    this.confirmButton().click();
    this.selectMTN().click();
    this.getTopupAmount().click();
    this.continueButton().click();
    this.continueAndPay().click();
    this.confirmAndContinue().click();
  }

  completePurchaseTaliya(phoneNumber) {
    cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=TOPUP/).as('getTopup');

    this.buyChargeButton().click();
    this.phoneNumberSelect().click();
    this.typePhoneNumber(phoneNumber);
    cy.wrap(phoneNumber).as('testPhoneNumber');
    this.confirmButton().click();
    this.selectTaliya().click();
    this.continueButton().click();
    this.continueAndPay().click();
    this.confirmAndContinue().click();
  }

  // خرید شارژ فوق العاده MCI
  completeMciSuperchargePurchase(phoneNumber) {
    cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=TOPUP/).as('getTopup');
    cy.wrap(phoneNumber).as('testPhoneNumber');

    this.buyChargeButton().click();
    this.phoneNumberSelect().click();
    this.typePhoneNumber(phoneNumber);
    this.confirmButton().click();

    this.getSuperchargeTitle().click();
    this.wait();
    this.continueButton().click();
    this.continueAndPay().click();
    this.confirmAndContinue().click();
  }

  // خرید شارژ با مبلغ دلخواه MCI
  PurchaseMCICustomAmount(phoneNumber) {
    cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=TOPUP/).as('getTopup');
    cy.wrap(phoneNumber).as('testPhoneNumber');

    this.buyChargeButton().click();
    this.phoneNumberSelect().click();
    this.typePhoneNumber(phoneNumber);
    this.confirmButton().click();
    this.wait();
    this.customAmountButton().click();
    this.continueButton().click();
    this.customAmountInput().clear({ force: true }).type('50000', { force: true });
    this.paymentButton().click();
    this.continueAndPay().click();
    this.confirmAndContinue().click();
  }


  nonThousandMultipleToast(phoneNumber){
    cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=TOPUP/).as('getTopup');
    cy.wrap(phoneNumber).as('testPhoneNumber');

    this.buyChargeButton().click();
    this.phoneNumberSelect().click();
    this.typePhoneNumber(phoneNumber);
    this.confirmButton().click();
    this.wait();
    this.customAmountButton().click();
    this.continueButton().click();
    this.customAmountInput().clear({ force: true }).type('55000', { force: true });
    this.paymentButton().click();
    
  }

  PurchaseMCICustomAmountUpEdage(phoneNumber) {
    this.buyChargeButton().click();
    this.phoneNumberSelect().click();
    this.typePhoneNumber(phoneNumber);
    this.confirmButton().click();
    this.wait();
    this.customAmountButton().click();
    this.continueButton().click();
    this.customAmountInput().clear({ force: true }).type('5000000', { force: true });
  }

  PurchaseMCICustomAmountDownEdage(phoneNumber) {
    this.buyChargeButton().click();
    this.phoneNumberSelect().click();
    this.typePhoneNumber(phoneNumber);
    this.confirmButton().click();
    this.wait();
    this.customAmountButton().click();
    this.continueButton().click();
    this.customAmountInput().clear({ force: true }).type('1000', { force: true });
    this.paymentButton().click();
  }

  // اعتبارسنجی رسید و API
  assertReceiptAndAPI(expectedPrice) {
    cy.wait('@getTopup', { timeout: 30000 }).then(({ response }) => {
      const result = response.body.result;

      // بررسی کارت رسید
      this.receiptCard({ timeout: 15000 })
        .should('be.visible')
        .and('contain.text', 'عملیات موفق')
        .and('contain.text', 'شارژ');

      // بررسی API
      expect(result.status.code).to.eq(200);
      expect(result.data.status).to.eq('COMPLETED');
      expect(result.data.title).to.eq('شارژ');

      const items = result.data.data;
      const price   = items.find(i => i.title === 'مبلغ (ریال)');
      const service = items.find(i => i.title === 'نوع خدمت');
      const phone   = items.find(i => i.title === 'شماره تلفن همراه');

      const cleanString = str => str.replace(/‌/g, '').trim();
      expect(price.value.toString()).to.eq(expectedPrice);
      expect(['شارژ عادی', 'شارژ فوق العاده'].map(cleanString))
        .to.include(cleanString(service.value));

      cy.get('@testPhoneNumber').then(testPhone => {
        expect(phone.value).to.eq(testPhone);
      });
    });

    this.sharingReceiptButton().should('be.visible').click();
    this.sharingReceiptText().should('be.visible');
    this.print('خرید شارژ موفق بود');
  }

  // Toast validations
  assertToastsVisible(expectedMessages = []) {
    this.allToast().should('be.visible').each(($toast, index) => {
      if (expectedMessages[index]) {
        cy.wrap($toast).should('contain.text', expectedMessages[index]);
      }
    });
  }
  

  assertPhoneRestrictionToastVisible() {
    cy.get('.Toastify__toast--error .Toastify__toast-body')
      .should('contain.text', 'شماره‌ای که وارد کرده‌اید محدودیت دارد')
      .and('contain.text', 'به کیف پول شما بر‌می‌گردد');
    this.print('محدودیت خرید شارژ برای خط ثابت درست چک شد');
  }

  assertToast() {
    this.toast().should('be.visible')
      .and('contain.text', '4131')
      .and('contain.text', 'اگر مبلغی از حساب شما کسر شده باشد');
  }
}
