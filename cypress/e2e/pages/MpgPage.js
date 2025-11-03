/// <reference types="cypress" />

export class MpgPage {
  // --- المنت‌ها ---
  buyChargeButton = () => cy.contains('خرید شارژ');
  phoneNumberSelect = () => cy.get('[data-testid="selectNumber"]');
  confirmButton = () => cy.contains('تایید');
  continueButton = () => cy.get('[data-testid="continueButton"]');
  continueAndPay = () => cy.contains('ادامه و پرداخت');
  confirmAndContinue = () => cy.contains('تایید و ادامه');
  customAmountButton = () => cy.contains('مبلغ دلخواه');
  paymentButton = () => cy.contains('پرداخت', { force: true });
  receiptCard = (opts = {}) => cy.contains('عملیات ناموفق', opts);
  toast = () => cy.get('.Toastify__toast--error');
  allToast = () => cy.get('.toast-container');
  sharingReceiptButton = () => cy.contains('اشتراک گذاری');
  sharingReceiptText = () => cy.contains('متنی');
  selectCard = () =>  cy.get('.MuiTypography-root.MuiTypography-body.css-6ttbmy')
  .contains('پاسارگاد')  // اطمینان از اینکه متن "پاسارگاد" در آن وجود دارد
  myCards = () => cy.get('img[alt="button"]')

  getCategoryTitle = () => cy.contains('شگفت‌انگیز');
  selectMCI = () => cy.get('[data-testid="mci"]');
  // کارت رسید کلی
receiptCard = () => cy.get('.MuiPaper-root.MuiCard-root', { timeout: 10000 });

// تیتر عملیات ناموفق
failOperationCard = () =>
  this.receiptCard();

// سرویس (نوع خدمت: افزایش موجودی)
failOperationServiceType = () =>
  this.receiptCard();

// مبلغ ریال
failOperationAmount = (amount) =>
  this.receiptCard().contains('div', amount, { timeout: 10000 });



  phoneNumberInput = () =>
    cy.contains('label', 'شماره همراه')
      .closest('.MuiFormControl-root')
      .find('input');

  customAmountInput = () => cy.get('input[type="tel"]').eq(1);                                                                                     

  ccv2Input = () =>
    cy.contains('label', 'CCV2')
      .closest('.MuiFormControl-root')
      .find('input');

  dynamicPasswordInput = () =>
    cy.contains('label', 'رمز پویا')
      .parent()
      .find('input');

  requestDynamicPasswordButton = () =>
    cy.get('button')
  .contains('دریافت رمز پویا')



  saveCardCheckbox = () =>
    cy.contains('ذخیره کردن اطلاعات کارت')
      .closest('label')
      .find('input[type="checkbox"]');

  cardNumberInput = () =>
    cy.contains('label', 'شماره کارت')
      .closest('.MuiFormControl-root')
      .find('input');

  cardNumberError = () =>
    cy.contains('label', 'شماره کارت')
      .closest('.MuiFormControl-root')
      .find('span.MuiTypography-root');

  ccv2Error = () =>
    cy.contains('label', 'CCV2')
      .closest('.MuiFormControl-root')
      .find('span.MuiTypography-root');

  minLengthError = () => cy.contains('span', 'حداقل ۵ کاراکتر لازمه');
  increaseBalanceButton() {
    return cy.contains('button', 'افزایش وجه');
  }
  
  increaseBalance = () => cy.contains('افزایش وجه');
  inAppGatewayOption = () => cy.contains('درگاه درون برنامه ای');
  confirmModalButton = () => cy.contains('button', 'تایید');
  confirmAndContinueButton = () => cy.contains('button', 'تایید و ادامه');
  payModalButton = () => cy.contains('button', 'پرداخت' , {timeout : 1000000}).should("be.visible");

  amountFiveMillion = () => cy.get('h6.boxTitle').contains('5,000,000');

  failOperationCard = () => cy.get('.MuiCard-root').contains('h6', 'عملیات ناموفق', { timeout: 100000 })

  paymentContainer = () => cy.get('div.jss19');
  uncheckedSavedCards = () =>
    cy.get('div.animate__animated').find(
      'input[type="checkbox"]:checked:not(:disabled)'
    );

  inAppGatewayCard = () =>
    cy.get('#increase-list')
      .contains('p', 'درگاه درون برنامه ای')
      .closest('div[id^="increase-"]');

  // --- متدهای کمکی ---
  wait(ms = 1000) {
    cy.wait(ms);
  }

  typePhoneNumber(phoneNumber) {
    this.phoneNumberInput()
      .should('be.visible')
      .clear({ force: true })
      .type(phoneNumber, { force: true });
  }

  findCardWithText(searchText, maxAttempts = 10) {
    cy.get('.MuiCard-root', { timeout: 10000 })
      .should('have.length.greaterThan', 0)
      .should('be.visible')
      .then(cards => {
        const cardsArr = [...cards];
        const container = cards[0].parentElement;
        container.scrollLeft = 0;

        function scrollRight() {
          return new Cypress.Promise(resolve => {
            container.scrollBy({ left: 200, behavior: 'smooth' });
            setTimeout(resolve, 500);
          });
        }

        function scrollUntilFound() {
          return new Cypress.Promise(async (resolve, reject) => {
            let attempts = 0;
            let card = null;
            while (attempts < maxAttempts) {
              card = cardsArr.find(c => c.textContent.includes(searchText));
              if (card) return resolve(card);
              await scrollRight();
              attempts++;
            }
            reject(
              `کارت با متن "${searchText}" پیدا نشد بعد از ${maxAttempts} بار اسکرول`
            );
          });
        }

        return scrollUntilFound().then(card =>
          cy.wrap(card).click({ force: true })
        );
      });
  }

  // --- متدهای اصلی ---
  increaseWalletBalanceWithExistingCard(ccv2, dynamicPassword) {
    this.findCardWithText('موجودی نقدی');
    this.increaseBalance().should('be.visible').click();
    this.increaseBalanceButton().click();
    this.inAppGatewayOption().should('be.visible').click();
   
    this.confirmModalButton().click();
    this.myCards().click();
     this.selectCard().click();
   
    this.ccv2Input().should('be.visible').type(ccv2);
    this.requestDynamicPasswordButton().click();

    this.dynamicPasswordInput().type(dynamicPassword);
    this.payModalButton().should('be.visible').click();
  }

  failPurchaseWithUnauthorizedCard(ccv2, dynamicPassword) {
    this.findCardWithText('موجودی نقدی');
    this.increaseBalance().should('be.visible').click();
    this.increaseBalanceButton().click();
    this.inAppGatewayOption().should('be.visible').click();
    this.confirmModalButton().click();
    this.cardNumberInput()
      .should('be.visible')
      .clear({ force: true })
      .type('504182564856', { force: true });

    this.cardNumberError()
      .should('contain.text', 'شماره کارت وارد شده معتبر نمی‌باشد.')
      .and('be.visible');
  }

  assetIncreaseWalletBalance(ccv2, dynamicPassword) {
 this.findCardWithText('موجودی نقدی');
    this.increaseBalance().should('be.visible').click();
    this.increaseBalanceButton().click();
    this.inAppGatewayOption().should('be.visible').click();
    this.confirmModalButton().click();
    this.myCards().click();
     this.selectCard().click();
    this.ccv2Input().should('be.visible').type(ccv2);
    this.requestDynamicPasswordButton().click();
    this.dynamicPasswordInput().should('be.visible').type(dynamicPassword);
    this.minLengthError().should('be.visible');
    this.saveCardCheckbox().should('be.checked').and('be.disabled');
    this.ccv2Error()
      .should('contain.text', 'حداقل ۳ کاراکتر لازمه')
      .and('be.visible');
  }

  failPurchaseWithWrongCVV2(ccv2, dynamicPassword) {
    this.findCardWithText('موجودی نقدی');
    this.increaseBalance().should('be.visible').click();
    this.increaseBalanceButton().click();
    this.inAppGatewayOption().should('be.visible').click();
    this.confirmModalButton().click();
    this.myCards().click();
    this.selectCard().click();
    this.ccv2Input().should('be.visible').type(ccv2);
    this.requestDynamicPasswordButton().click();
    this.dynamicPasswordInput().type(dynamicPassword);
    this.payModalButton().should('be.visible').click();
    this.wait(5000)
    this.receiptCard().within(() => {
      this.failOperationCard().should('be.visible');             // عملیات ناموفق
      this.failOperationServiceType().should('be.visible');      // افزایش موجودی
      
    });
    
  }

  failPurchaseWithWrongDynamicPassword(ccv2, dynamicPassword) {
    this.findCardWithText('موجودی نقدی');
    this.increaseBalance().should('be.visible').click();
    this.increaseBalanceButton().click();
    this.inAppGatewayOption().should('be.visible').click();
    this.confirmModalButton().click();
    this.myCards().click();
    this.selectCard().click();
    this.ccv2Input().should('be.visible').type(ccv2);
    this.requestDynamicPasswordButton().click();
    this.dynamicPasswordInput().type(dynamicPassword);
    this.payModalButton().should('be.visible').click();
    this.receiptCard().within(() => {
      this.failOperationCard().should('be.visible');
      cy.contains('۱۰۰,۰۰۰').should('be.visible');
      cy.contains('افزایش موجودی').should('be.visible');
    });
  }

  failPurchaseWithInsufficientBalance(ccv2, dynamicPassword) {
    this.findCardWithText('موجودی نقدی');
    this.increaseBalance().should('be.visible').click();
    this.amountFiveMillion().should('be.visible').click({ force: true });
    this.increaseBalanceButton().click();
    this.inAppGatewayOption().should('be.visible').click();
    this.confirmModalButton().click();
    this.myCards().click();
    this.selectCard().click();
    this.ccv2Input().should('be.visible').type(ccv2);
    this.requestDynamicPasswordButton().click();
    this.dynamicPasswordInput().type(dynamicPassword);
    this.wait(50000)
    this.payModalButton().should('be.visible').click();
    this.wait(50000)
    this.receiptCard().within(() => {
      this.failOperationCard()  // المان h6 عملیات ناموفق
        .should('be.visible');
    });
    
  }

  successfulInAppPaymentForService(phoneNumber, ccv2, dynamicPassword) {
    this.buyChargeButton().click();
    this.phoneNumberSelect().click();
    this.typePhoneNumber(phoneNumber);
    cy.wrap(phoneNumber).as('testPhoneNumber');
    this.confirmButton().click();
    this.selectMCI().click();
    this.wait();
    this.paymentButton().click();
    this.uncheckedSavedCards().each($el => {
      cy.wrap($el).uncheck({ force: true });
    });
    this.paymentContainer().contains('button', 'پرداخت').click({ force: true });
    this.inAppGatewayCard().click({ force: true });
    this.confirmAndContinueButton().should('be.visible').click({ force: true });
    this.myCards().click();
    this.selectCard().click();
    this.ccv2Input().should('be.visible').type(ccv2);
    this.dynamicPasswordInput().type(dynamicPassword);
    this.payModalButton().click({ force: true });
  }
}
