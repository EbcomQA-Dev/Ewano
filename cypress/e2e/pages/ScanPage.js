/// <reference types="cypress" />

export class ScanPage {
    /* ---------- selectors ---------- */
    scanButton         = () => cy.contains('اسکن',{ timeout: 10000 });
    acceptorCodeButton = () => cy.contains('h6', 'پرداخت با کد پذیرنده');
    acceptorCodeInput  = () => cy.contains('label', 'کد پذیرنده')
    .parent()     // میره به div.MuiFormControl-root
    .find('input')
    amountInput        = () => cy.get('label:contains("مبلغ (ریال)")')
    .parent()
    .find('input')
    confirmAndContinue = () => cy.contains('button', 'تایید و ادامه', { timeout: 10000 })
    continueAndPay     = () => cy.contains('ادامه و پرداخت');
    confirmAndCountinue2 = () => cy.contains('h3', 'خرید حضوری') // اول مطمئن شو درسته
    .parentsUntil('div.jss606')   // تا والد اصلی بالا می‌ریم
    .parent()                     // رسیدن به div کامل مودال
    .contains('button', 'تایید و ادامه')
// دکمه تایید و ادامه داخل مودال
confirmAndContinueNewModal = () => {
  // ابتدا مودال visible را پیدا می‌کنیم
  return cy.get('div.MuiDrawer-root:visible, div.MuiModal-root:visible', { timeout: 15000 })
    .first()                       // اولین مودال visible
    .find('button')                // همه دکمه‌ها
    .contains('تایید و ادامه')    // دکمه با متن ثابت
    .should('exist')
    .should('be.visible')
    .should('not.be.disabled');
};
    cAndc = () => {
      return cy.get('.MuiDrawer-root:visible, .MuiModal-root:visible', { timeout: 10000 }) // تمام مودال‌ها
        .first() // اولین مودال قابل مشاهده
        .find('button')     
        .contains('تایید و ادامه')    // دکمه با متن ثابت
        .should('exist')
        .should('be.visible')
        .should('not.be.disabled');
    };    
    submitButton = () => cy.get('button[type="button"]').contains('ثبت')
    codeInput = () => cy.get('input[placeholder="کد فعال‌سازی"]');
    backToHome = () => cy.contains('button', 'بازگشت به خانه')
    receiptCard        = (o = {}) => cy.get('#layout-content', o);
    toast              = () => cy.get('.toast-container');
  
    /* ---------- flows ---------- */
  
    //  شارژ کیف پول از طریق اسکن ووچر کارت

    simulateScanVoucher() {
      const amount = 200000; // مبلغی که در content استفاده می‌کنیم
    
      // شنود بالانس قبل از اجرای فلو (اپ باید این درخواست اتوماتیک بفرسته)
      cy.intercept('GET', '**/services/account/wallet/v1.2/balance').as('balanceBefore');
    
      this.scanButton().click();
      cy.log('📌 Scan button clicked');
    
      const userToken = Cypress.env('token');
      if (!userToken) throw new Error('User token not found in Cypress.env');
      cy.log(`🔑 User token found: ${userToken.substring(0, 10)}...`);
    
      // صبر برای اولین کال بالانس پس از کلیک (بالانس اولیه که اپ خودش می‌زند)
      cy.wait('@balanceBefore', { timeout: 10000 }).then(({ response }) => {
        if (!response || !response.body || !response.body.result || !response.body.result.data) {
          throw new Error('Balance before response shape unexpected');
        }
        const balanceBeforeObj = response.body.result.data.balances
          .find(b => b.tags === 'CASH' && b.title === 'موجودی نقدی');
    
        if (!balanceBeforeObj) throw new Error('موجودی نقدی (CASH) در response بالانس قبل پیدا نشد');
        const balanceBefore = balanceBeforeObj.value;
        cy.wrap(balanceBefore).as('balanceBefore');
        cy.log(`💰 Balance before (intercept): ${balanceBefore}`);
      });
    
      // گرفتن QR با fetch تا توی Network بیاد
      const qrUrl =
        'https://stage-ebcom.mci.ir/services/voucher/v1.0/qr?' +
        'data=voucher.ewano.app%2Fid%2F2021e072-26fd-42ab-a113-dee34daefb34';
    
      cy.window().then((win) => {
        cy.log('🌐 Fetching QR via fetch (visible in Network tab)');
        return win.fetch(qrUrl, {
          method: 'GET',
          headers: { Authorization: `Bearer ${userToken}` },
        })
          .then((res) => {
            cy.log(`📦 QR fetch returned status: ${res.status}`);
            expect(res.status).to.eq(200);
            return res.json();
          })
          .then((qrBody) => {
            cy.log('🚪 Voucher drawer opened via window');
            win.openVoucherDrawer(qrBody.result.data);
    
            cy.wait(5000);
    
            // لاگین کلاینت برای توکن سرویس content
            cy.request({
              method: 'GET',
              url: 'https://stage-ebcom.mci.ir/services/auth/v1.0/client/login',
              headers: {
                clientId: 'd92375a5-0281-4289-b14c-b001214ac8c2',
                ClientSecret: 'mahsa',
                scope: 'testGroup',
                Cookie: 'cookiesession1=678B783579DEB3E357683E69F416A07A',
              },
            }).then((loginResp) => {
              const clientToken = loginResp.body.result.data.token;
              cy.log(`🔑 Client token received: ${clientToken.substring(0, 10)}...`);
    
              // تولید key و عدد رندوم
              const randomKey = Math.floor(100000 + Math.random() * 900000);
              const keyForApi = `voucher-${randomKey}`;
              cy.log(`🎲 Random key generated: ${randomKey} (API key: ${keyForApi})`);
    
              // گرفتن msisdn از alias
              cy.get('@testPhone').then((msisdn) => {
                cy.log(`Using msisdn: ${msisdn}`);
    
                // فراخوانی سرویس content
                cy.request({
                  method: 'POST',
                  url: 'https://stage-ebcom.mci.ir/services/content/v1.0/content',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${clientToken}`,
                  },
                  body: {
                    clientId: '75ce206c-e9af-4216-a527-49250dd4ceb5',
                    id: Cypress._.uniqueId('content_'),
                    key: keyForApi,
                    content: {
                      action: {
                        action: 'https://sandbox-ebcom.mci.ir/ecm/pwa3',
                        actionType: 'WEBVIEW',
                        confirmationButtonCaption: 'خرید از فروشگاه',
                        title: 'فروشگاه',
                      },
                      balanceId: '3ace3c88-40c0-46e6-87fa-ee9467845155',
                      amount,
                      serviceCode: randomKey,
                      color: '#003D7C',
                      description: 'test',
                      effts: '2023-08-01T00:00:00',
                      expts: '2037-11-14T23:59:59',
                      limited: false,
                      msisdn,
                      title: 'فعال سازی کارت هدیه',
                      type: 'CURRENCYCARD',
                    },
                    status: 'ACTIVE',
                  },
                }).then((contentResp) => {
                  cy.log(`✅ Content service response status: ${contentResp.status}`);
                  expect(contentResp.status).to.eq(200);
    
                  const createdContentId = contentResp.body.result.data.id;
                  cy.log(`🆔 Created content ID: ${createdContentId}`);
                  console.log('🆔 Created content ID (console):', createdContentId);
    
                  // قبل از اقدام نهایی، شنود بالانس بعدی را آماده کنیم
                  cy.intercept('GET', '**/services/account/wallet/v1.2/balance').as('balanceAfter');
    
                  // کلیک روی اولین ثبت (همون flow قبلی)
                  cy.contains('h3', 'فعال‌سازی کارت هدیه')
                    .closest('.MuiDrawer-paper')
                    .should('be.visible')
                    .within(() => {
                      this.submitButton()
                        .should('not.be.disabled')
                        .click();
                      cy.log('🟢 Voucher activation "ثبت" (first) clicked');
                    });
    
                  // وارد کردن مقدار درست در input و ثبت نهایی
                  this.codeInput().clear().type(randomKey);
                  cy.log(`✍️ Typed randomKey ${randomKey} into codeInput`);
    
                  cy.contains('h3', 'فعال‌سازی کارت هدیه')
                    .closest('.MuiDrawer-paper')
                    .should('be.visible')
                    .within(() => {
                      cy.contains('button', 'ثبت')
                        .should('not.be.disabled')
                        .click();
                      cy.log('🟢 Voucher activation "ثبت" (final) clicked');
                    });
    
                  // صبر برای درخواست بالانس بعد از فلو (اپ باید این رو اتوماتیک بزنه)
                  cy.wait('@balanceAfter', { timeout: 20000 }).then(({ response }) => {
                    if (!response || !response.body || !response.body.result || !response.body.result.data) {
                      throw new Error('Balance after response shape unexpected');
                    }
                    const balanceAfterObj = response.body.result.data.balances
                      .find(b => b.tags === 'CASH' && b.title === 'موجودی نقدی');
                    if (!balanceAfterObj) throw new Error('موجودی نقدی (CASH) در response بالانس بعد پیدا نشد');
                    const balanceAfter = balanceAfterObj.value;
                    cy.log(`💰 Balance after (intercept): ${balanceAfter}`);
    
                    // مقایسه با بالانس قبل
                    cy.get('@balanceBefore').then((balanceBefore) => {
                      cy.log(`💰 Balance before (used for comparison): ${balanceBefore}`);
                      cy.log(`➕ Expected increase: ${amount}`);
                      expect(balanceAfter).to.eq(balanceBefore + amount);
                      cy.log(`✅ Balance updated correctly by ${amount}`);
                    });
                  });
                });
              });
            });
          });
      });
    }    
      
  // پرداخت با کد پذیرنده pose    
    paymentWithAcceptorCode (code,amount) {
      cy.intercept('GET', '**/transaction/**?type=PAYMENT').as('getTransaction');
  
      this.scanButton().click();
      this.acceptorCodeButton().parents('button').click({ force: true });
  
      this.acceptorCodeInput().clear().type(code);
      this.confirmAndContinue().click();
  
      this.amountInput().should('be.visible')
  .clear({ force: true }).type(amount, { force: true });
      cy.wrap(amount).as('testAmount'); // مبلغ را ذخیره می‌کنیم
  
      // کلیک روی دکمه تایید و ادامه
  this.confirmAndContinueNewModal()
  .click({ force: true });
      this.continueAndPay() .should('be.visible')
    .click({ force: true });
      this.cAndc().should('be.visible')
      .click({ force: true });
    }

  // پرداخت ناموفق با کدپذیرنده pose نامعتبر
    paymentWithWrongAcceptorCode (code, amount) {
      this.scanButton().click();
      this.acceptorCodeButton().parents('button').click({ force: true });
  
      this.acceptorCodeInput().clear().type(code);
      this.confirmAndContinue().click();
  
      this.amountInput().should('be.visible')
      .clear({ force: true }).type(amount, { force: true });
          cy.wrap(amount).as('testAmount'); // مبلغ را ذخیره می‌کنیم
      this.confirmAndContinueNewModal()
      .click({ force: true });
      this.continueAndPay().click();
      this.cAndc().should('be.visible')
      .click({ force: true });
    }
   
  // پرداخت با کد پذیرنده تردپارتی  
    paymentWithThirdpartyAcceptorCode(code) {
      cy.intercept('GET', '**/transaction/**?type=QR').as('getTransactionQR');
        this.scanButton().click();
        this.acceptorCodeButton().parents('button').click({ force: true });
      
        this.acceptorCodeInput().clear().type(code);
        
        this.confirmAndContinue().should('be.visible') // یا 'have.css', 'visibility', 'visible'
        .click();

        // صبر برای باز شدن مودال دوم
cy.contains('خرید حضوری', { timeout: 10000 })
.should('be.visible');
      
this.confirmAndContinueNewModal()
.click({ force: true });  
this.continueAndPay() .should('be.visible')
.click({ force: true });
  this.cAndc().should('be.visible')
  .click({ force: true });
      }
  
  // پرداخت با کد پذیرنده تردپارتی استفاده شده    
      paymentWithUsedThirdpartyAcceptorCode(code,amount) {
        // اجرای اول
        this.scanButton().click();
        this.acceptorCodeButton().parents('button').click({ force: true });
        this.acceptorCodeInput().clear().type(code);
        this.confirmAndContinue().should('be.visible') // یا 'have.css', 'visibility', 'visible'
        .click();
        this.confirmAndContinueNewModal()
.click({ force: true });  
this.continueAndPay() .should('be.visible')
.click({ force: true });
  this.cAndc().should('be.visible')
  .click({ force: true });
      
      
        cy.wait(1000);
       // بعد از نمایش رسید، روی بازگشت کلیک کن
       this.backToHome().should('exist')
       .should('be.visible')
       .click({ force: true });
      
        // اجرای مجدد همان فلو با همان کد
        cy.wait(2000); // صبر برای برگشت کامل به صفحه اصلی
      
       this.scanButton().click();
       this.acceptorCodeButton().parents('button').click({ force: true });
       cy.wait(2000)
       this.acceptorCodeInput().clear().type(code);
       cy.wait(2000)
       this.confirmAndContinue().should('be.visible') // یا 'have.css', 'visibility', 'visible'
        .click();
       cy.wait(2000)
       this.amountInput().should('be.visible')
       .clear({ force: true }).type(amount, { force: true });
           cy.wrap(amount).as('testAmount'); // مبلغ را ذخیره می‌کنیم
       
           this.confirmAndContinueNewModal()
           .click({ force: true });
           this.continueAndPay() .should('be.visible')
           .click({ force: true });
           this.cAndc().should('be.visible')
  .click({ force: true });
      
      }      
      
    /* ---------- assertions ---------- */
  
    assertReceiptUI () {
      cy.wait('@getTransaction', { timeout: 30_000 });
      this.receiptCard({ timeout: 30_000 })
        .should('be.visible')
        .and('contain.text', 'عملیات موفق')
        .and('contain.text', 'پرداخت از طریق QR');
    }

    assertReceiptPaymentWithThirdpartyAcceptorCodeUI () {
        cy.wait('@getTransactionQR', { timeout: 30000 });
        this.receiptCard({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text', 'عملیات موفق')
          .and('contain.text', 'خرید از فروشگاه');
      }
  
    assertAcceptorCodeApyAPIResponse () {
      cy.get('@getTransaction')
        .its('response.body.result')
        .then((result) => {
          expect(result.status.code).to.eq(200);
          expect(result.data.status).to.eq('COMPLETED');
          expect(result.data.title ).to.eq('پرداخت از طریق QR');
  
          const priceVal = result.data.data.find((i) => i.title === 'مبلغ (ریال)').value;
          cy.get('@testAmount').should('eq', priceVal);
        });
    }
    assertPaymentWithThirdpartyAcceptorCodeAPIResponse () {
        cy.get('@getTransactionQR')
          .its('response.body.result')
          .then((result) => {
            expect(result.status.code).to.eq(200);
            expect(result.data.status).to.eq('COMPLETED');
            expect(result.data.title).to.eq('خرید از فروشگاه');
      
            const priceVal = result.data.data.find((i) => i.title === 'مبلغ (ریال)').value;
            cy.get('@testAmount').should('eq', priceVal);
          });
      }
  
    assertWrongAcceptorCodeUI () {
      this.toast({ timeout: 30_000 })
        .should('be.visible')
        .and('contain.text', '4230 -  متاسفانه ارتباط برقرار نشد');
    }
    assertOtherAcceptorCodeUI () {
      this.toast({ timeout: 30_000 })
        .should('be.visible')
        .and('contain.text', '1001 - خطای نامشخص');
    }
  }
  