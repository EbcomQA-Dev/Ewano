/// <reference types="cypress" />

export class CurrencyCardPage {
  wait = () => cy.wait(5000);

  walletIncreaseIcon = () => cy.contains('افزایش وجه');
  walletIncreaseButton = () => cy.contains('button', 'افزایش وجه')
  walletIncreaseWays = () => cy.contains('روش افزایش وجه');
  ipgButton =() => cy.contains('p', 'درگاه بانکی')
  mpgButton =() => cy.contains('p', 'درگاه درون برنامه ای')
  cardNumberList = () => cy.get('img[alt="button"]')
  cvv2Input = () => cy.contains('label', 'CCV2').parent().find('input')
  dynamicPassButton = () => cy.get('.animate__delay-3 > :nth-child(2) > .MuiButtonBase-root')
  dynamicPassInput = () => cy.contains('label', 'رمز پویا').parent().find('input')
  paymentButton = () => cy.contains('button', 'پرداخت')
  confirmButton= () => cy.contains('تایید');
  walletDecreaseButton = () => cy.contains('برداشت وجه');
  amountInput = () => cy.get('div.MuiInputBase-root input[type="text"]').first()
  cardInput = () => cy.contains('label', 'شماره کارت').parent().find('input')
  cardListButton = () => cy.get('img[alt="button"]');
  cardSelect = () => cy.contains('h3', 'کارت‌های من')
  .parents('[class*="MuiBox-root"]')
  .find('p[dir="ltr"]')       // شماره کارت‌ها
  .first()
  .closest('div.MuiBox-root')
  walletDecreaseConfirm = () => cy.contains('button', 'برداشت وجه');
  confirmButton = () => cy.contains('تایید');
  backToHomeButton = () => cy.contains('بازگشت به خانه');
  deleteIcon = () => cy.get('[data-testid="CloseIcon"]');
  receiptCard = (opts = {}) => cy.get('#layout-content', opts); // رسید خرید موفق

  Toast         =  () => cy.get('.toast-container') // مشاهده اسنک بار
  cashCard =() => cy.get('div.MuiCard-root.CASH:contains("موجودی نقدی")', { timeout: 10000 }).first()
  mpgCardSelect = () =>  cy.contains('h3', 'کارت‌های من')
  .parents('[class*="MuiBox-root"]')
  .find('[dir="ltr"]')   // بدون محدودیت روی تگ
  .first()
  .closest('div.MuiBox-root')


  
  assertOpenCardUI() {
    this.cashCard().click({ force: true })
    this.walletIncreaseIcon()
      .should('be.visible');
  }

  setupInterceptions() {
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    cy.intercept('PUT', '**/services/payment/card/v1.0/**/confirm').as('getwalletDcrease');
    cy.intercept('GET', '**/services/account/v1.3/transaction/**?type=PAYMENT').as('getTransaction');
    cy.intercept('GET', '**/services/account/wallet/**/balance').as('getBalance');
  }
  
// برداشت وجه موفق و کسر مبلغ از کیف نقدی
  successWalletDecreaseAmount(amount) {
    let initialCashBalance;

    // صبر برای دریافت موجودی اولیه
    cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
      const balances = response.body.result.data.balances;
      const cash = balances.find(b => b.title === 'موجودی نقدی');
      expect(cash).to.exist;
      initialCashBalance = cash.value;
    });
    this.cashCard().click({ force: true })
    this.walletDecreaseButton().click();
    cy.wait(5000)
    this.amountInput().clear().type(amount)
    cy.wrap(amount).as('testamount')
    cy.wait('@getCards', { timeout: 10000 });
    cy.wait(5000)
    this.cardListButton().click()
    cy.wait(5000)
    this.cardSelect().click()
    cy.wait(5000)
    this.walletDecreaseConfirm().click()
    this.confirmButton().click()
    cy.wait('@getwalletDcrease', { timeout: 10000 });

    // بازگشت به صفحه اصلی برای فراخوانی مجدد بالانس
    this.backToHomeButton().click();

    // چک کردن موجودی بعد از برداشت
    cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
      const balances = response.body.result.data.balances;
      const cash = balances.find(b => b.title === 'موجودی نقدی');
      expect(cash).to.exist;

      cy.get('@testamount').then(amount => {
        const numericAmount = Number(amount.toString().replace(/[^\d]/g, ''));
        const expected = initialCashBalance - numericAmount;
        cy.log(`مقدار اولیه: ${initialCashBalance}, برداشت: ${numericAmount}, باقی‌مانده: ${cash.value}`);
        expect(cash.value).to.eq(expected);
      });
    });
  }
// برداشت وجه موفق از کیف با شماره کارت انتخابی
  successWalletDecrease(amount) {
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    cy.intercept('PUT', '**/services/payment/card/v1.0/**/confirm').as('getwalletDcrease');
    cy.intercept('GET', '**/services/account/v1.3/transaction/**?type=PAYMENT').as('getTransaction');
    cy.intercept ('GET', '**/services/account/wallet/**/balance').as('getBalance');
    this.cashCard().click({ force: true })
  this.walletDecreaseButton().click();
  this.amountInput().type(amount)
  cy.wrap(amount).as('testamount')
  cy.wait('@getCards', { timeout: 10000 });
  this.cardListButton().click()
  cy.wait(5000)
  this.cardSelect().click()
  this.walletDecreaseConfirm().click()
  this.confirmButton().click()
  cy.wait('@getwalletDcrease', { timeout: 10000 });
 
}

// برداشت وجه موفق از کیف با شماره کارت وارد شده به صورت دستی
successWalletDecreaseWithEntredCard(amount,cardNumber) {
  cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
  cy.intercept('PUT', '**/services/payment/card/v1.0/**/confirm').as('getwalletDcrease');
  cy.intercept('GET', '**/services/account/v1.3/transaction/**?type=PAYMENT').as('getTransaction');
  cy.intercept ('GET', '**/services/account/wallet/**/balance').as('getBalance');
  this.cashCard().click({ force: true })
this.walletDecreaseButton().click();
this.amountInput().type(amount)
cy.wrap(amount).as('testamount')
cy.wait('@getCards', { timeout: 10000 });
cy.wait(1000)
this.cardInput().clear().type(cardNumber)
cy.wrap(cardNumber).as('testcardNumber')
this.walletDecreaseConfirm().click()
this.confirmButton().click()
cy.wait('@getwalletDcrease', { timeout: 10000 });

}

  assertReceiptUI() {
    cy.wait('@getTransaction', { timeout: 30000 });
    this.receiptCard({ timeout: 30000 })
      .should('be.visible')
      .and(($el) => {
        const text = $el.text();
        expect(text).to.include('عملیات موفق');
        expect(text).to.include('پرداخت');
      });
  }

  assertDecreaseAPIResponse() {
    cy.get('@getCards').then((interception) => {
      const result = interception.response.body.result;
      expect(result.status.code).to.eq(200);
    });
  
    cy.get('@getwalletDcrease').then((interception) => {
      const result = interception.response.body.result;
      expect(result.status.code).to.eq(200);
    });
  
    cy.get('@getTransaction').then((interception) => {
      const result = interception.response.body.result;
      expect(result.status.code).to.eq(200);
      expect(result.data.status).to.eq('COMPLETED');
      expect(result.data.title).to.eq('پرداخت');
  
      const items = result.data.data;
      const price = items.find(i => i.title === 'مبلغ (ریال)');
      const PAN = items.find(i => i.title === 'شماره کارت مقصد');
  
      cy.get('@testamount').then(testAmount => {
        expect(price.value).to.eq(testAmount);
      });
  
      if (cy.state('aliases').hasOwnProperty('testcardNumber')) {
        cy.get('@testcardNumber').then(testCardNumber => {
          const first6 = testCardNumber.toString().slice(0, 6);
          const last4 = testCardNumber.toString().slice(-4);
          const maskedRegex = new RegExp(`^${first6}\\*+${last4}$`);
          expect(PAN.value).to.match(maskedRegex);
        });
      } else {
        expect(PAN.value).to.match(/^\d{6}\*{6}\d{4}$/);
      }
    });
  }
  

  // درخواست برداشت وجه بیش از موجودی کیف پول
  insufficentBalance() {
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    cy.intercept('GET', '**/services/account/wallet/**/balance').as('getBalance');
    this.cashCard().click({ force: true })
    this.walletDecreaseButton().click();
  
    // دریافت موجودی نقدی و محاسبه مبلغ بیشتر از موجودی
    cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
      const balances = response.body.result.data.balances;
      const cash = balances.find(b => b.title === 'موجودی نقدی');
      expect(cash).to.exist;
  
      const amount = cash.value + 10;
      cy.wrap(amount).as('testamount'); // برای استفاده در assertion UI
  cy.wait(5000)
      this.amountInput().type(amount.toString());
      cy.wait('@getCards', { timeout: 10000 });

      this.cardListButton().click();
      this.cardSelect().click();
      cy.wait(5000)
      this.walletDecreaseConfirm().click();
    });
  }
  

assertInsufficentBalanceUI() {
  cy.get('@getCards');
  this.Toast({ timeout: 30000 })
    .should('be.visible')
    .and('contain.text', 'مبلغ وارد شده بیشتر از موجودی کیف پولتونه.')
}

  // وارد کردن مبلغ بیش از مبلغ مجاز
  moreAllowedAmount(amount) {
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    this.cashCard().click({ force: true })
  this.walletDecreaseButton().click();
  this.amountInput().type(amount)
  cy.wrap(amount).as('testamount')
 
}

moreAllowedAmountUI() {
  cy.get('@getCards');
  this.Toast({ timeout: 30000 })
    .should('be.visible')
    .and('contain.text', 'نمیشه که! مبلغ بیشتر از یک میلیون تومن نباید باشه.')
}

  // وارد کردن مبلغ کمتر از مبلغ مجاز
  lessAllowedAmount(amount) {
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    this.cashCard().click({ force: true })
  this.walletDecreaseButton().click();
  this.amountInput().type(amount)
  cy.wrap(amount).as('testamount')
  cy.wait('@getCards', { timeout: 10000 });
  this.cardListButton().click()
  this.cardSelect().click()
  this.walletDecreaseConfirm().click()
 
}

lessAllowedAmountUI() {
  cy.get('@getCards');
  this.Toast({ timeout: 30000 })
    .should('be.visible')
    .and('contain.text', 'نمیشه که! مبلغ کمتر از هزار تومن نمیشه باشه.')
}

  // حذف تکست فیلد برای برداشت وجه
  deleteIconFieldForDecrease(amount) {
    this.cashCard().click({ force: true })
  this.walletDecreaseButton().click();
  this.amountInput().type(amount)
  this.amountInput().should('not.have.value', '');
  this.deleteIcon({ timeout: 10000 }).should('be.visible').click();
 
}

deleteIconFieldForDecreaseUI() {
  this.amountInput().should('have.value', '');
}

  // حذف تکست فیلد برای افزایش وجه
  deleteIconFieldForIncrease() {
    this.cashCard().click({ force: true })
    this.walletIncreaseIcon().click();
    cy.wait(5000)
    this.amountInput().should('not.have.value', '');
    this.deleteIcon({ timeout: 10000 }).should('be.visible').click();
   
  }
  
  deleteIconFieldForIncreaseUI() {
    this.amountInput().should('have.value', '');
  }

    // افزایش وجه با مبلغ زیر 10 هزار تومان
    lessAmountForIncrease(amount) {
      this.cashCard().click({ force: true })
      this.walletIncreaseIcon().click();
      cy.wait(5000)
      this.amountInput().should('not.have.value', '');
      this.deleteIcon({ timeout: 10000 }).should('be.visible').click();
       this.amountInput().type(amount)
      this.walletIncreaseButton().click() 

     
    }
    
    lessAmountForIncreaseUI() {
      this.Toast({ timeout: 30000 })
        .should('be.visible')
        .and('contain.text', 'نمیشه که! مبلغ کمتر از ده هزار تومن نمیشه باشه.')
    }

        // افزایش وجه با مبلغ بالای 100 میلیون تومان
        moreAmountForIncrease(amount) {
          this.cashCard().click({ force: true })
          this.walletIncreaseIcon().click();
          cy.wait(5000)
          this.amountInput().should('not.have.value', '');
          this.deleteIcon({ timeout: 10000 }).should('be.visible').click();
           this.amountInput().type(amount)
    
         
        }
        
        assertionMoreAmountForIncreaseUI() {
          this.Toast({ timeout: 30000 })
            .should('be.visible')
            .and('contain.text', 'نمیشه که! مبلغ بیشتر از صد میلیون تومن نباید باشه.')
        }

        // رسید ناموفق افزایش وجه از درگاه درون برنامه ای به دلیل وارد کردن cvv2 نادرست
        increaseAmountWithWrongcvv2(amount,cvv2,pass) {
          cy.intercept('GET', '**/services/payment/card/**/cards*').as('getCards');
          cy.intercept('GET', '**/services/account/v1.3/transaction/**?type=PAYMENT').as('getTransaction');
          this.cashCard().click({ force: true })
          this.walletIncreaseIcon().click();
        
          cy.wait(500);
          this.amountInput().should('not.have.value', '');
        
          cy.wait(500);
          this.deleteIcon({ timeout: 10000 }).should('be.visible').click();
        
          cy.wait(500);
          this.amountInput().type(amount);
        
          cy.wait(500);
          this.walletIncreaseButton().click();
        
          cy.wait(500);
          this.mpgButton().click();
        
          cy.wait(1000);
          this.confirmButton().click();
          cy.wait(1000);
          this.cardNumberList().click({ force: true });
        
          cy.wait(1000);
          cy.wait('@getCards', { timeout: 10000 });
        
          // ✅ انتخاب اولین کارت از لیست کارت‌های مقصد:
          this.mpgCardSelect().click()
        
          cy.wait(500);
          this.cvv2Input().type(cvv2)
          this.dynamicPassButton().click()
          this.dynamicPassInput().type(pass)
          this.paymentButton().click()

        }
        
        assertNotSuccfulReceiptUI() {
          cy.wait('@getTransaction', { timeout: 30000 });
          this.receiptCard({ timeout: 30000 })
            .should('be.visible')
            .and(($el) => {
              const text = $el.text();
              expect(text).to.include('عملیات ناموفق');
              expect(text).to.include('افزایش موجودی');
              expect(text).to.include('جهت اطلاع! اگه مبلغی از حساب‌تون کم شده باشه، حداکثر تا 72 ساعت آینده به کیف‌پول‌تون بر‌می‌گرده.');
            });
        }

        increaseAmountWithManualAmount(amount,cvv2,pass) {
          cy.intercept('GET', '**/services/payment/card/**/cards*').as('getCards');
          cy.intercept('GET', '**/services/account/v1.3/transaction/**?type=PAYMENT').as('getTransaction');
          this.cashCard().click({ force: true })
          this.walletIncreaseIcon().click();
        
          cy.wait(500);
          this.amountInput().should('not.have.value', '');
        
          cy.wait(500);
          this.deleteIcon({ timeout: 10000 }).should('be.visible').click();
        
          cy.wait(500);
          this.amountInput().type(amount);
        
          cy.wait(500);
          this.walletIncreaseButton().click();
        
          cy.wait(500);
          this.mpgButton().click();
        
          cy.wait(1000);
          this.confirmButton().click();
          cy.wait(1000);
          this.cardNumberList().click({ force: true });
        
          cy.wait(1000);
          cy.wait('@getCards', { timeout: 10000 });
        
          // ✅ انتخاب اولین کارت از لیست کارت‌های مقصد:
          this.mpgCardSelect().click()
        
          cy.wait(500);
          this.cvv2Input().type(cvv2)
          cy.wait(500);
          this.dynamicPassInput().type(pass)
          cy.wait(5000);
          this.paymentButton().click()
          cy.wait(500);

        }
        
        assertSuccfulReceiptUI() {
          cy.wait('@getTransaction', { timeout: 30000 });
          this.receiptCard({ timeout: 30000 })
            .should('be.visible')
            .and(($el) => {
              const text = $el.text();
              expect(text).to.include('عملیات موفق');
              expect(text).to.include('افزایش موجودی');
            });

            
        }

        increaseAmountWithSelectedAmount(cvv2,pass) {
          cy.intercept('GET', '**/services/payment/card/**/cards*').as('getCards');
          cy.intercept('GET', '**/services/account/v1.3/transaction/**?type=PAYMENT').as('getTransaction');
          this.cashCard().click({ force: true })
          this.walletIncreaseIcon().click();
        
          cy.wait(500);
          this.walletIncreaseButton().click();
        
          cy.wait(500);
          this.mpgButton().click();
        
          cy.wait(1000);
          this.confirmButton().click();
          cy.wait(1000);
          this.cardNumberList().click({ force: true });
        
          cy.wait(1000);
          cy.wait('@getCards', { timeout: 10000 });
        
          // ✅ انتخاب اولین کارت از لیست کارت‌های مقصد:
          this.mpgCardSelect().click()
  
        
          cy.wait(500);
          this.cvv2Input().type(cvv2)
          cy.wait(500);
          this.dynamicPassInput().type(pass)
          cy.wait(5000);
          this.paymentButton().click({ force: true })
          cy.wait(500);

        }

        increaseAmountBalanceCheck(amount,cvv2,pass) {
          let initialCashBalance;

          // صبر برای دریافت موجودی اولیه
          cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
            const balances = response.body.result.data.balances;
            const cash = balances.find(b => b.title === 'موجودی نقدی');
            expect(cash).to.exist;
            initialCashBalance = cash.value;
          });
          this.cashCard().click({ force: true })
          this.walletIncreaseIcon().click();
        
          cy.wait(500);
          this.amountInput().should('not.have.value', '');
        
          cy.wait(500);
          this.deleteIcon({ timeout: 10000 }).should('be.visible').click();
        
          cy.wait(500);
          this.amountInput().type(amount);
          cy.wrap(amount).as('testamount');
        
          cy.wait(500);
          this.walletIncreaseButton().click();
        
          cy.wait(500);
          this.mpgButton().click();
        
          cy.wait(1000);
          this.confirmButton().click();
          cy.wait(1000);
          this.cardNumberList().click({ force: true });
        
          cy.wait(1000);
          cy.wait('@getCards', { timeout: 10000 });
        
          // ✅ انتخاب اولین کارت از لیست کارت‌های مقصد:
          this.mpgCardSelect().click()
        
          cy.wait(500);
          this.cvv2Input().type(cvv2)
          cy.wait(500);
          this.dynamicPassInput().type(pass)
          cy.wait(5000);
          this.paymentButton().click({ force: true })
          cy.wait(500);

           // بازگشت به صفحه اصلی برای فراخوانی مجدد بالانس
    this.backToHomeButton().click();

          cy.wait(5000);
          // چک کردن موجودی بعد از برداشت
    cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
      const balances = response.body.result.data.balances;
      const cash = balances.find(b => b.title === 'موجودی نقدی');
      expect(cash).to.exist;

cy.wait(5000);
      cy.get('@testamount').then(amount => {
        const numericAmount = Number(amount.toString().replace(/[^\d]/g, ''));
        const expected = initialCashBalance + numericAmount;
        cy.log(`مقدار اولیه: ${initialCashBalance}, واریز: ${numericAmount}, باقی‌مانده: ${cash.value}`);
        expect(cash.value).to.eq(expected);
      });
    });

        }
        
        
}
