/// <reference types="cypress" />

export class welcomePage {
  wait = () => cy.wait(5000);

  ReagentButton = () => cy.contains('button', 'معرف ندارم، ورود', { timeout: 10000 });
  telecomeCard = () =>   cy.get('div.MuiCard-root.TELECOM:contains("هدیه بسته و اعتبار")').first()
  welcomeActiveButton = () =>  cy.contains('span.extraDescription', 'بسته اینترنت خوش امد اوانو')
  .closest('div.MuiPaper-root.MuiCard-root');
  ThirdTransactionActiveButton = () => cy.contains('span.extraDescription', 'هدیه سومین تراکنش کیف پول اوانو')
  .closest('div.MuiPaper-root.MuiCard-root') // رسیدن به container کارت
  .should('exist')
  seventhTransactionActiveButton = () =>  cy.contains('span.extraDescription', 'هدیه هفتمین تراکنش کیف پول اوانو')
  .closest('div.MuiPaper-root.MuiCard-root');
  servicesButton     = () => cy.get('.MuiBottomNavigation-root > :nth-child(2)', { timeout: 10000 })
    charityTab = () => cy.contains("مهربانی")
    charityButton = () => cy.contains('خیریه')
    charityCard = () => cy.get('.MuiCard-root').eq(0)
    selectCharity = () => cy.contains ('خیریه صبح رویش')
    selectNewCharity = () => cy.contains ('خیریه نیکان ماموت')
    selectAmount =() => cy.get('h6 > p').contains('50,000').should('be.visible');
    amountInput = () => cy.get('input[inputmode="numeric"][type="text"].MuiInputBase-input');
    paymentButton = () => cy.contains ('پرداخت')
    countinueAndPay = () => cy.contains ('ادامه و پرداخت' , {timeout : 10000})
    confirmAndCountinue = () => cy.contains ('تایید و ادامه')
    backToHome = () => cy.contains ('بازگشت به خانه')
  Toast = () => cy.get('.toast-container');  
  

  // -----------------------------flow-------------------------
  getWelcomePackage() {
    cy.intercept('GET', '**/services/account/wallet/**/balance').as('getBalance');
    cy.intercept('GET', '**/services/account/credit/v1.0').as('getMciCredit');
    this.ReagentButton().click();
  }

  // -----------------------------assertion API-------------------------
  assertGetWelcomePackageAPIResponse() {
    cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
      const balances = response.body.result.data.balances;

      const cashBalance = balances.find(b => b.tags === 'CASH');
      expect(cashBalance, 'cash balance should exist').to.exist;
      expect(cashBalance).to.have.property('value').and.to.be.a('number');

      const packageBalance = balances.find(b => b.tags === 'TELECOM');
      expect(packageBalance, 'package balance should exist').to.exist;
      expect(packageBalance).to.have.property('value').and.to.be.a('number');

      cy.wrap(cashBalance.value).as('cashValue');
      cy.wrap(packageBalance.value).as('packageValue');
    });

    cy.wait('@getMciCredit', { timeout: 10000 }).then(({ response }) => {
      const mciOk = response.statusCode === 200 && response.body?.status?.code === 200;
      cy.wrap(mciOk).as('mciEnabled');
      cy.log(`📌 وضعیت سرویس اعتبار همراهی: ${mciOk ? 'موفق ✅' : 'ناموفق ❌'}`);
    });
  }

  // -----------------------------FindCard و assert مقدار کارت-------------------------
  assertPackageCardValue() {
    cy.get('@packageValue').then(packageValue => {
      cy.get('div.MuiCard-root.TELECOM').then($cards => {
        const matchingCard = Array.from($cards).find(c =>
          c.textContent.includes('هدیه بسته و اعتبار')
        );
  
        // وجود کارت را assert کن
        expect(matchingCard, 'کارت هدیه بسته و اعتبار باید موجود باشد').to.exist;
  
        // مقدار عددی روی کارت
        const textEl = matchingCard.querySelector('p.MuiTypography-root:nth-child(2)');
        const cardValue = parseInt(textEl.textContent.replace(/,/g, ''), 10);
  
        expect(cardValue, 'مقدار کارت هدیه').to.eq(packageValue);
        cy.log(`✅ کارت هدیه موجود است و مقدار آن برابر value سرویس است: ${cardValue}`);
      });
    });
  }
  
  // -----------------------------assert UI-------------------------
  assertWelcomePackageUI() {
    cy.request({
      method: 'GET',
      url: 'https://sandbox-ebcom.mci.ir/static/app/ewano/ewano-config.json',
      headers: { 'Accept': 'application/json' }
    }).then(configResp => {
      const homeCards = configResp.body?.result?.data?.configuration?.basic?.walletTags?.home;
      if (!homeCards || !homeCards.length) throw new Error('Home cards not found in config');

      const expectedPackageCard = homeCards.find(c => c.key === 'TELECOM');
      cy.get('@packageValue').then(packageValue => {
        this.assertPackageCardValue(expectedPackageCard.title, packageValue);
      });

      const expectedMciCard = homeCards.find(c => c.key === 'MCI');
      if (expectedMciCard) {
        cy.get('@mciEnabled').then(mciOk => {
          if (mciOk) this.assertPackageCardValue(expectedMciCard.title);
        });
      }
    });
  }

// -----------------------------Activate Welcome Gift Package-------------------------
activateWelcomeGiftPackage() {
  cy.log('🔹 فعالسازی بسته هدیه/اعتبار');

  // اینترسپت API فعالسازی
  cy.intercept('POST', '**/services/core/v2.0/campaign/**/approve').as('approveCampaign');

  // force click روی کارت هدیه (اگر کارت پیدا شده باشد)
this.telecomeCard().click({ force: true });
  this.welcomeActiveButton().should('exist').click({ force: true });

  // انتظار برای پاسخ API و assert
  cy.wait('@approveCampaign', { timeout: 15000 }).then(({ response }) => {
    expect(response?.statusCode, 'وضعیت پاسخ HTTP').to.eq(200);
    expect(response?.body?.status?.code, 'کد وضعیت سرویس').to.eq(200);
    cy.log('✅ فعالسازی بسته خوش‌آمدگویی با موفقیت انجام شد');
  });
}

// ---------------------------- Get and Activate Welcome Gift Package for 3th transaction-------------------------
getAndActivateWelcomeGiftPackageFor3thAnd7th() {
  cy.log('🔹  فعالسازی بسته هدیه/اعتبار برای سومین تراکنش');

  cy.intercept('POST', '**/services/charity/v1.0/**/participate').as('postCharityParticipate');
  cy.intercept('GET', '**/transaction/**?type=CHARITY').as('getCharity');

  cy.log('🔹 تراکنش اول ');
  this.servicesButton().click();
  cy.wait(2000);
  this.charityTab().click();
  cy.wait(2000);
  this.charityButton().click();
  cy.wait(2000);
  this.selectCharity().click();
  cy.wait(2000);
  this.selectAmount().click();
  cy.wait(2000)
  this.paymentButton().click()
  this.countinueAndPay().click()
  this.confirmAndCountinue().click()
  cy.wait('@postCharityParticipate', { timeout: 15000 });
  cy.wait('@getCharity', { timeout: 10000 });
  this.backToHome().click();
  cy.wait(5000);
  cy.log('🔹 تراکنش دوم ');
  this.servicesButton().click();
  cy.wait(2000);
  this.charityTab().click();
  cy.wait(2000);
  this.charityButton().click();
  cy.wait(2000);
  this.selectCharity().click();
  cy.wait(2000);
  this.selectAmount().click();
  cy.wait(2000)
  this.paymentButton().click()
  this.countinueAndPay().click()
  this.confirmAndCountinue().click()
  cy.wait('@postCharityParticipate', { timeout: 15000 });
  cy.wait('@getCharity', { timeout: 10000 });
  this.backToHome().click();
  cy.wait(5000);
  cy.log('🔹 تراکنش سوم ');
  this.servicesButton().click();
  cy.wait(2000);
  this.charityTab().click();
  cy.wait(2000);
  this.charityButton().click();
  cy.wait(2000);
  this.selectCharity().click();
  cy.wait(2000);
  this.selectAmount().click();
  cy.wait(2000)
  this.paymentButton().click()
  this.countinueAndPay().click()
  this.confirmAndCountinue().click()
  cy.wait('@postCharityParticipate', { timeout: 15000 });
  cy.wait('@getCharity', { timeout: 10000 });
  this.backToHome().click();
  cy.wait(5000);
  cy.log('🔹 تراکنش چهارم ');
  this.servicesButton().click();
  cy.wait(2000);
  this.charityTab().click();
  cy.wait(2000);
  this.charityButton().click();
  cy.wait(2000);
  this.selectCharity().click();
  cy.wait(2000);
  this.selectAmount().click();
  cy.wait(2000)
  this.paymentButton().click()
  this.countinueAndPay().click()
  this.confirmAndCountinue().click()
  cy.wait('@postCharityParticipate', { timeout: 15000 });
  cy.wait('@getCharity', { timeout: 10000 });
  this.backToHome().click();
  cy.wait(5000);
  cy.log('🔹 تراکنش پنجم ');
  this.servicesButton().click();
  cy.wait(2000);
  this.charityTab().click();
  cy.wait(2000);
  this.charityButton().click();
  cy.wait(2000);
  this.selectCharity().click();
  cy.wait(2000);
  this.selectAmount().click();
  cy.wait(2000)
  this.paymentButton().click()
  this.countinueAndPay().click()
  this.confirmAndCountinue().click()
  cy.wait('@postCharityParticipate', { timeout: 15000 });
  cy.wait('@getCharity', { timeout: 10000 });
  this.backToHome().click();
  cy.wait(5000);
  cy.log('🔹 تراکنش ششم ');
  this.servicesButton().click();
  cy.wait(2000);
  this.charityTab().click();
  cy.wait(2000);
  this.charityButton().click();
  cy.wait(2000);
  this.selectCharity().click();
  cy.wait(2000);
  this.selectAmount().click();
  cy.wait(2000)
  this.paymentButton().click()
  this.countinueAndPay().click()
  this.confirmAndCountinue().click()
  cy.wait('@postCharityParticipate', { timeout: 15000 });
  cy.wait('@getCharity', { timeout: 10000 });
  this.backToHome().click();
  cy.wait(5000);
  cy.log('🔹 تراکنش هفتم ');
  this.servicesButton().click();
  cy.wait(2000);
  this.charityTab().click();
  cy.wait(2000);
  this.charityButton().click();
  cy.wait(2000);
  this.selectCharity().click();
  cy.wait(2000);
  this.selectAmount().click();
  cy.wait(2000)
  this.paymentButton().click()
  this.countinueAndPay().click()
  this.confirmAndCountinue().click()
  cy.wait('@postCharityParticipate', { timeout: 15000 });
  cy.wait('@getCharity', { timeout: 10000 });
  this.backToHome().click();
  cy.wait(5000);

}

// ---------------------------- Get and Activate Welcome Gift Package for 7th transaction-------------------------
getAndActivateWelcomeGiftPackageFor7th() {
  cy.log('🔹  فعالسازی بسته هدیه/اعتبار برای هفتمین تراکنش');

  cy.intercept('POST', '**/services/charity/v1.0/**/participate').as('postCharityParticipate');
  cy.intercept('GET', '**/transaction/**?type=CHARITY').as('getCharity');

  // خرید اول
  this.servicesButton().click();
  cy.wait(2000);
  this.charityTab().click();
  cy.wait(2000);
  this.charityButton().click();
  cy.wait(2000);
  this.selectCharity().click();
  cy.wait(2000);
  this.selectAmount().click();
  cy.wait(2000)
  this.paymentButton().click()
  this.countinueAndPay().click()
  this.confirmAndCountinue().click()
  cy.wait('@postCharityParticipate', { timeout: 15000 });
  cy.wait('@getCharity', { timeout: 10000 });
  this.backToHome().click();
  cy.wait(5000);

}

// -----------------------------Activate 3th and 7th Gift Package-------------------------
confirmSeventhAndThirdGiftPackage() {
  cy.log('🔹 وجود کارت بسته هدیه اعتبار مربوط به سومین و هفتمین تراکنش');

  // force click روی کارت هدیه (اگر کارت پیدا شده باشد)
this.telecomeCard().click({ force: true });
this.ThirdTransactionActiveButton().should('exist');
this.seventhTransactionActiveButton().should('exist')
}
}
