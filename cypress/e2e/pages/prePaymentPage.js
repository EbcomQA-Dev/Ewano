/// <reference types="cypress" />

export class prePaymentPage {
 
    /* ---------- selectors ---------- */
    charge = () => cy.contains('خرید شارژ',{ timeout: 20000 });
    inputNumberBox = () => cy.get('[data-testid="selectNumber"]')
    inputNumber =() => cy.get('#\\:ra\\:')
    confirmButton = () => cy.contains('تایید');
    paymentButton = () => cy.contains('پرداخت');
    countinueAndPay = () => cy.contains('ادامه و پرداخت');
    confirmAndCountinue = () => cy.contains('تایید و ادامه')

    showToast = () => cy.get('.Toastify__toast-body');
    receiptCard          = (opts = {}) => cy.get('#layout-content',opts)  // رسید خرید موفق
  
    /* ---------- flows ---------- */
 // نمایش کتگوری بالانس ها در صفحه prePayment به ترتیب کانفیگ
  ShowBalanceCategoriesBasedOnconfig(mobileNumber) {
    cy.intercept('GET', '**/services/account/wallet/**/balance*').as('getBalances');
    
      this.charge().click();
      this.inputNumberBox().click()
      cy.wait(500)
      this.inputNumber().clear().type(mobileNumber)
      cy.wait(500)
      this.confirmButton().click()
      cy.wait(500)
      this.paymentButton().click()
      cy.wait(500)
      cy.wait('@getBalances', { timeout: 10000 });


    }

    // چک اولویت ساب بالانس ها بر اساس priority 
balancesTitlesSortedByPriority(mobileNumber) {
    cy.intercept('GET', '**/services/account/wallet/**/balance*').as('getBalances');
  
    this.charge().click();
    this.inputNumberBox().click();
    cy.wait(500);
    this.inputNumber().clear().type(mobileNumber);
    cy.wait(500);
    this.confirmButton().click();
    cy.wait(500);
    this.paymentButton().click();
  
    cy.wait('@getBalances', { timeout: 10000 }).then(({ response }) => {
      const balances = response?.body?.result?.data?.balances || [];
  
      // فقط موجودی‌های فعال (status=ACTIVE)
      const selectedSubBalances = balances.filter(b => b.status === 'ACTIVE');
  
      // مرتب‌سازی براساس priority
      const sortedBalances = selectedSubBalances.sort((a, b) => a.priority - b.priority);
  
      // ذخیره برای استفاده در تست
      cy.wrap(sortedBalances).as('sortedBalances');
    });
  }

     // پرداخت موفقیت آمیز با چند بالانس و چک باقی مانده مبلغ 0
successPaymentWithMultipleBalances(mobileNumber) {
    cy.intercept('GET', '**/services/account/wallet/**/balance*').as('getBalances');
    cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');
  
    this.charge().click();
    this.inputNumberBox().click();
    cy.wait(500);
    this.inputNumber().clear().type(mobileNumber);
    cy.wrap(mobileNumber).as('testPhoneNumber')
    cy.wait(500);
    this.confirmButton().click();
    cy.wait(500);
    this.paymentButton().click();
  
    cy.wait('@getBalances', { timeout: 10000 });
    cy.contains('h6', 'مبلغ باقی مانده') // پیدا کردن تگ h6 با متن
  .parent()                          // رفتن به div والد
  .find('p')                         // پیدا کردن تمام pها (عدد و ریال جدا هستن)
  .first()                           // اولین p عددیه
  .invoke('text')
  .then((text) => {
    cy.log(`🟡 متن خوانده‌شده: ${text}`); // برای دیباگ

    // حذف هر چیزی به‌جز اعداد فارسی
    const persianNumber = text.replace(/[^\u06F0-\u06F9]/g, '');

    // تبدیل اعداد فارسی به انگلیسی
    const englishNumber = persianNumber.replace(/[\u06F0-\u06F9]/g, d =>
      '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString()
    );

    cy.log(`🔵 عدد نهایی انگلیسی‌شده: ${englishNumber}`);

    const remaining = Number(englishNumber);
    
    if (remaining === 0) {
      cy.log('✅ مبلغ باقی مانده صفر است. کلیک روی دکمه "ادامه و پرداخت"...');
      cy.contains('button', 'ادامه و پرداخت', { timeout: 10000 })
        .should('be.visible')
        .click();
    } else {
      cy.log(`❌ مبلغ باقی مانده صفر نیست (${remaining})، کلیک انجام نشد`);
    }
  });

cy.wait(1000)
this.confirmAndCountinue().click()
cy.wait('@getTopup', { timeout: 2000000000 }).as('getTopupResponse')

  }
  
       //باقی مانده داشتن مبلغ پرداخت خرید و تایید صحت آن در صورت انتخاب بیش از یک کیف پول
       ConfirmCorrectAmountRemaining(mobileNumber) {
        cy.intercept('GET', '**/services/account/wallet/**/balance*').as('getBalances');
      
        cy.log('🔹 شروع فرآیند ورود و تأیید شماره');
        this.charge().click();
        this.inputNumberBox().click();
        cy.wait(500);
        this.inputNumber().clear().type(mobileNumber);
        cy.wrap(mobileNumber).as('testPhoneNumber');
        cy.wait(500);
        this.confirmButton().click();
        cy.wait(500);
        this.paymentButton().click();
      
        // هندل کردن لودینگ اولیه
        cy.document({ timeout: 20000 }).should('exist');
        cy.get('body', { timeout: 20000 }).should('exist').then($body => {
          if ($body.find('#loadingModal').length) {
            cy.get('#loadingModal', { timeout: 20000 }).should('not.be.visible');
          } else {
            cy.log('ℹ️ لودینگ اولیه وجود نداشت، ادامه می‌دهیم...');
          }
        });
      
        cy.log('🔹 منتظر دریافت موجودی کیف پول‌ها');
        cy.wait('@getBalances', { timeout: 10000 });
      
        const walletAmounts = [];
      
        cy.log('🔹 گرفتن مبالغ کیف‌پول‌های انتخاب‌شده');
        cy.get('input.PrivateSwitchBase-input[type="checkbox"]:checked:not(:disabled)')
          .each(($input) => {
            cy.wrap($input).closest('label').then(($label) => {
              const walletName = $label.find('span.MuiFormControlLabel-label').text();
              const parent = $label.parent();
              let amountText = '';
      
              parent.siblings('div').each((_, sibling) => {
                const h6 = Cypress.$(sibling).find('h6.MuiTypography-subtitle2');
                if (h6.length > 0) {
                  amountText = h6.text();
                  return false;
                }
              });
      
              if (!amountText) {
                const grandParent = parent.parent();
                const h6 = grandParent.find('h6.MuiTypography-subtitle2').first();
                if (h6.length > 0) {
                  amountText = h6.text();
                }
              }
      
              const amount = parseInt(amountText.replace(/[^\d]/g, ''), 10);
      
              if (!isNaN(amount)) {
                walletAmounts.push(amount);
                cy.log(`💰 کیف‌پول "${walletName}" با مبلغ: ${amount}`);
              } else {
                cy.log(`⚠️ مبلغ کیف‌پول "${walletName}" پیدا نشد یا معتبر نبود.`);
              }
            });
          })
          .then(() => {
            const selectedWalletSum = walletAmounts.reduce((sum, val) => sum + val, 0);
      
            cy.log(`💼 تعداد کیف‌های انتخاب‌شده: ${walletAmounts.length}`);
            cy.log(`💼 مجموع مبالغ کیف‌های انتخاب‌شده: ${selectedWalletSum}`);
      
            cy.log('🔹 خواندن مبلغ نهایی');
            cy.contains('.MuiTypography-root', 'مبلغ نهایی')
              .parent()
              .find('.MuiTypography-bodySelected')
              .invoke('text')
              .then((finalAmountText) => {
                const finalAmount = parseInt(finalAmountText.replace(/[^\d]/g, ''), 10);
                const expectedRemaining = finalAmount - selectedWalletSum;
      
                cy.log(`💰 مبلغ نهایی: ${finalAmount}`);
                cy.log(`🧮 مبلغ باقی‌مانده مورد انتظار: ${expectedRemaining}`);
      
                cy.log('🔹 خواندن مبلغ باقی مانده نمایش داده‌شده');
                cy.contains('h6', 'مبلغ باقی مانده').parent().within(() => {
                  cy.get('p.MuiTypography-body1').first().invoke('text').then((remainingText) => {
                    const remaining = parseInt(remainingText.replace(/[^\d]/g, ''), 10);
      
                    cy.log(`🔎 مبلغ باقی‌مانده نمایش داده‌شده: ${remaining}`);
      
                    expect(walletAmounts.length).to.be.greaterThan(1);
                    expect(remaining).to.equal(expectedRemaining);
                    expect(remaining).to.be.greaterThan(0);
      
                    cy.log('🔹 کلیک روی دکمه پرداخت');
                    cy.contains('مبلغ باقی مانده', { timeout: 15000 })
                      .parents('div')
                      .parent('div')
                      .find('button')
                      .contains('پرداخت')
                      .should('be.visible')
                      .and('be.enabled')
                      .scrollIntoView()
                  });
                });
              });
          });
      }
      
      
      
      
      
      
      
      
      
      
      
      
      
      

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
  
  
  
  
    /* ---------- assertions ---------- */
  
    assertReceiptUI() {
        cy.get('@getTopupResponse');
        this.receiptCard({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text', 'عملیات موفق')
          .and('contain.text', 'شارژ');
      }

      assertSuccessPayment() {
        cy.get('@getTopupResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(200);
          expect(result.data.status).to.eq('COMPLETED');
          expect(result.data.title).to.eq('شارژ');
      
          const items = result.data.data;
          const service = items.find(i => i.title === 'نوع خدمت');
          const phone   = items.find(i => i.title === 'شماره تلفن همراه');
      
          cy.get('@testPhoneNumber').then(testPhone => {
            expect(phone.value).to.eq(testPhone);
          });
        });
      }
  }
  