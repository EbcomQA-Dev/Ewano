/// <reference types="cypress" />

export class welfareTransferPages {
  
    welfareWallet  =() => cy.contains('div.MuiCard-root', 'موجودی رفاهی', { timeout: 10000 });
    welfareSelect  =() => cy.contains('بسته رفاهی خدمات')// انتخاب کیف رفاهی مورد نظر
    welfareSelect2  =() => cy.contains('h1', 'هدیه اعتبار کالا و خدمات')// انتخاب کیف رفاهی مورد نظر
    welfareSelect3  =() => cy.contains('h1', 'اعتبار اموزش')// انتخاب کیف رفاهی مورد نظر
    welfareTransferButton = () => cy.contains('انتقال رفاهیات')// انتخاب گزینه انتقال رفاهیات
    destnationMsisndn  = () => cy.get('input[aria-describedby$="-helper-text"]').eq(0);// وارد کردن شماره همراه مقصد
    destnationNationalCode = () => cy.get('input[aria-describedby$="-helper-text"]').eq(1); // وارد کردن کدملی مقصد
    amount  =() => cy.get('div[testid="customPriceInput"] input'); //وارد کردن مبلغ
    continueButton = () => cy.contains('ادامه')// کلیک روی دکمه ادامه
    quitButton  =() => cy.get('.MuiButton-outlined') // انتخاب گزینه انصراف
    confirmButton =() => cy.contains('button', 'تایید') // انتخاب گزینه تایید
    otpInput =()  => cy.get('input[type="tel"][maxlength="12"]') // وارد کردن کد احراز هویت
    otpConfirm = () => cy.contains ('تایید') // تایید کد احراز هویت
    infoButton  =() => cy.get('.MuiButtonBase-root > img')
    otpButton =() => cy.contains('ارسال مجدد')
    timerButton = () => cy.get('p.MuiTypography-root.MuiTypography-body1').contains(/^\d{2}:\d{2}$/);
    infoContent = () => cy.contains ('توضیحات انتقال رفاهیات')
    receiptCard         = (opts = {}) => cy.get('.MuiCard-root', opts)
    backButton = ()  => cy.get('.MuiGrid-grid-xxs-3 > .MuiButtonBase-root > [data-testid="ArrowForwardIosOutlinedIcon"]')
    backButtonInWalletTransfer =() => cy.get(':nth-child(1) > .MuiButtonBase-root')
    backToHomeButton = () => cy.contains('بازگشت به خانه');
    wrongNationalCodeToast         =  () => cy.get('.toast-container')
    wrongDestnationMsisdnToast         =  () => cy.get('.toast-container')
    invalidDestnationMsisdnToast         =  () => cy.get('.toast-container')
    invalidAmountToast         =  () => cy.get('.toast-container')
    invalidNationlCodeToast         =  () => cy.get('.toast-container')
    wrongOTPToast  =() => cy.get('.toast-container')
    insufficenBalanceToast         =  () => cy.get('.toast-container')
    



    checkWelfareBalance() {
      return cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
        expect(response).to.not.be.null;
        const wallets = response.body.result.data.balances;
        const welfareWallet = wallets.find(w => w.title === 'بسته رفاهی خدمات');
        expect(welfareWallet).to.exist;
        return Number(welfareWallet.value);
      });
    }
// انتقال موفق رفاهیات در صورت وجود موجودی
successWelfareTransfer(phoneNumber, nationalCode, amount, OTP) {
  // Intercepts
  cy.intercept('GET', '**/services/account/wallet/v1.2/balance').as('getBalance');
  cy.intercept('POST', '**/account/**/transfer').as('postTransfer');
  cy.intercept('GET', '**/transaction/**?type=ACCOUNT').as('getTransfer');

  let initialBalance;

  // دریافت موجودی اولیه
  cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
    expect(response).to.exist;
    expect(response.statusCode).to.eq(200);
    const wallets = response.body.result.data.balances;
    const welfareWallet = wallets.find(w => w.title === 'بسته رفاهی خدمات');
    expect(welfareWallet).to.exist;
    initialBalance = Number(welfareWallet.value);
    cy.wrap(initialBalance).as('initialBalance');
  });

  // اجرای انتقال
  this.welfareWallet().click({ force: true });
  this.welfareSelect().click();
  this.welfareTransferButton().click();
  this.destnationMsisndn().clear().type(phoneNumber);
  cy.wrap(phoneNumber).as('testPhoneNumber');
  this.destnationNationalCode().clear().type(nationalCode);
  this.amount().clear().type(amount.toString());
  this.continueButton().click();

  cy.wait(1000);
  this.confirmButton().scrollIntoView().should('be.visible').click();
  this.otpInput().clear().type(OTP);

  // انتظار برای API و اعتبارسنجی
  cy.wait('@postTransfer', { timeout: 20000 }).then(({ response }) => {
    expect(response).to.exist;
    expect(response.statusCode).to.eq(200);
  });

  cy.wait('@getTransfer', { timeout: 20000 }).then(({ response }) => {
    expect(response).to.exist;
    expect(response.statusCode).to.eq(200);
    const result = response.body.result;
    const items = result.data.data;
    const phone = items.find(i => i.title === 'شماره تلفن مقصد');
    cy.get('@testPhoneNumber').then(testPhone => {
      expect(phone.value).to.eq(testPhone);
    });
  });

  // رسید موفق
  this.receiptCard()
    .should('be.visible')
    .and('contain.text', 'عملیات موفق')
    .and('contain.text', 'انتقال');

  this.backToHomeButton().click();

  // بررسی کاهش موجودی
  cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
    expect(response).to.exist;
    expect(response.statusCode).to.eq(200);
    const walletsAfter = response.body.result.data.balances;
    const welfareAfter = walletsAfter.find(w => w.title === 'بسته رفاهی خدمات');
    expect(welfareAfter).to.exist;
    const updatedBalance = Number(welfareAfter.value);
    expect(updatedBalance).to.eq(initialBalance - amount);
  });
}



// انتقال رفاهیات با وارد کردن کدملی نادرست
  wrongNationalCodeForWelfareTransfer(phoneNumber,nationalCode,amount) {
 cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');
 cy.intercept('GET', '**/account/**/transfer/info').as('getInfo');

 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()


 cy.wait('@getBalance', { timeout: 20000 })
  cy.wait('@getInfo', { timeout: 20000 })
}


// اعتبار سنجی api
  assertAPIResponse() {
  cy.get('@getBalance').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  })
    cy.get('@getInfo').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(1071);
  })
}
// مشاهده اسنک بار نادرست بودن کدملی
assertWrongNationalCodeUI() {
        cy.get('@getInfo');
        this.wrongNationalCodeToast({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text','1071 -  انجام نشد. شماره همراه مقصد و کد ملی متعلق به یک شخص نیست.')
      }


// انتقال رفاهیات با وارد کردن شماره موبایل کاربر مبدا به عنوان مقصد
  wrongDestnationMsisdnForWelfareTransfer(phoneNumber,nationalCode,amount) {
 cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');

 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()


 cy.wait('@getBalance', { timeout: 20000 })
}


// اعتبار سنجی api
  assertwrongDestnationMsisdnAPIResponse() {
  cy.get('@getBalance').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  })
}
// مشاهده اسنک بار نادرست بودن شماره مبدا
assertWrongDestnationMsisdnUI() {
        this.wrongDestnationMsisdnToast({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text','نشد دیگه! شماره همراه خودت رو که نباید وارد کنی.')
      }


// انتقال رفاهیات با وارد کردن شماره موبایل نامعتبر به عنوان مقصد
  invalidDestnationMsisdnForWelfareTransfer(phoneNumber,nationalCode,amount) {
 cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');


 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()


 cy.wait('@getBalance', { timeout: 20000 })
}


// اعتبار سنجی api
  assertInvalidDestnationMsisdnAPIResponse() {
  cy.get('@getBalance').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  })
}
// مشاهده اسنک بار نامعتبر بودن شماره مبدا
assertInvalidDestnationMsisdnUI() {
        this.invalidDestnationMsisdnToast({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text','نشد که بشه! این شماره همراه معتبر نیست.')
      }


// انتقال رفاهیات با وارد کردن مبلغ نامعتبر 
  invalidAmountForWelfareTransfer(phoneNumber,nationalCode,amount) {
 cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');


 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()


 cy.wait('@getBalance', { timeout: 20000 })
}


// اعتبار سنجی api
  assertInvalidAmountAPIResponse() {
  cy.get('@getBalance').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  })
}
// مشاهده اسنک بار نامعتبر بودن مبلغ
assertInvalidAmountUI() {
        this.invalidAmountToast({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text','عجب! مبلغ باید ضریبی از هزار تومن باشه.')
      }


// انتقال رفاهیات با وارد کردن کدملی
  invalidNationlCodeForWelfareTransfer(phoneNumber,nationalCode,amount) {
 cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');


 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()


 cy.wait('@getBalance', { timeout: 20000 })
}


// اعتبار سنجی api
  assertInvalidNationlCodeAPIResponse() {
  cy.get('@getBalance').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  })
}
// مشاهده اسنک بار نامعتبر بودن مبلغ
assertInvalidNationlCodetUI() {
        this.invalidNationlCodeToast({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text','عجب! کد ملی معتبر نیست!')
      }

// انصراف از انتقال رفاهیات
  quitOfWelfareTransfer(phoneNumber,nationalCode,amount) {
 cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');

 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()
 cy.wait (1000)
 this.quitButton().click()

 cy.wait('@getBalance', { timeout: 20000 })
}


// اعتبار سنجی api
  quitOfWelfareTransferAPIResponse() {
  cy.get('@getBalance').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  })
}
// مشاهده فیلدهای شماره مقصد و کدملی و مبلغ
quitOfWelfareTransferUI() {
        this.destnationMsisndn({ timeout: 30000 }).should('be.visible')
        this.destnationNationalCode({ timeout: 30000 }).should('be.visible')
        this.amount({ timeout: 30000 }).should('be.visible')
      }      
//بررسی info‌در صفحه انتقال رفاهیات
  infoWelfareTransfer() {
 cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');

 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.infoButton().click()
 



 cy.wait('@getBalance', { timeout: 20000 })
}


// اعتبار سنجی api
  infoWelfareTransferAPIResponse() {
  cy.get('@getBalance').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  })
}
// مشاهده info
infoWelfareTransferUI() {
        this.infoContent({ timeout: 30000 }).should('be.visible')
      }  
      
      
//بررسی خاموش بودن دکمه ادامه در صورت وارد نکردن یکی از فیلدهای ورودی 
  desableCountinueButton(phoneNumber,nationalCode) {
 cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');

 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)

 cy.wait('@getBalance', { timeout: 20000 })
}

// خاموش بودن دکمه ادامه
desableCountinueButtonUI() {
         this.continueButton().should('exist')
  .and('not.be.enabled')  // دکمه غیر فعال باشه
      }   
      
      
// وارد کردن otp نادرست
  wrongOTP(phoneNumber,nationalCode,amount,OTP) {


 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()
 cy.wait(1000)
 this.confirmButton().scrollIntoView().should('be.visible').click()
 this.otpInput().clear().type(OTP)

}
// مشاهده اسنک بار نادرست بودن شماره مبدا
wrongOTPUI() {
        this.wrongOTPToast({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text', '1203 - خطا')
      }

//بررسی خاموش بودن دکمه تایید در صورت وارد نکردن کد احراز هویت 
desableotpConfirmButton(phoneNumber,nationalCode,amount) {


 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()
 cy.wait(1000)
 this.confirmButton().scrollIntoView().should('be.visible').click()
 

}

// خاموش بودن دکمه ادامه
desableotpConfirmButtonUI() {
         this.otpConfirm().should('exist')
  .and('not.be.enabled')  // دکمه غیر فعال باشه
      }   
            

// درخواست  کد احراز هویت
  otpButtonForWelfareTransfer(phoneNumber,nationalCode,amount) {



 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()
 cy.wait(1000)
 this.confirmButton().scrollIntoView().should('be.visible').click()
cy.wait(60000);
}

// مشاهده دکمه ارسال مجدد 
  otpButtonUI() {
  this.otpButton().should('be.visible')
      ;}   
      
      
// کلیک بر روی دکمه بک در صفحه احراز هویت
backButtonInAuthenticationPage(phoneNumber,nationalCode,amount) {

 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 this.continueButton().click()
 cy.wait(1000)
 this.confirmButton().scrollIntoView().should('be.visible').click()
 cy.wait(5000)
 this.backButton().click()
 cy.wait(5000)

}

// مشاهده اطلاعات صفحه انتقال رفاهیات 
 backButtonUI() {
        this.destnationMsisndn({ timeout: 30000 }).should('be.visible')
        this.destnationNationalCode({ timeout: 30000 }).should('be.visible')
        this.amount({ timeout: 30000 }).should('be.visible')
      }  

  // کلیک بر روی دکمه بک در صفحه انتقال رفاهیات
backButtonInWalletTransferPage(phoneNumber,nationalCode,amount) {

 this.welfareWallet().click({ force: true })
 this.welfareSelect().click()
 this.welfareTransferButton().click()
 this.destnationMsisndn().clear().type(phoneNumber)
 cy.wrap(phoneNumber).as('testPhoneNumber')
 this.destnationNationalCode().clear().type(nationalCode)
 this.amount().clear().type(amount)
 cy.wait(5000)
  this.backButtonInWalletTransfer().click()
 cy.wait(5000)

}

// مشاهده اطلاعات صفحه خانه 
 backButtonInWalletTransferUI() {
        cy.get('.slick-active > :nth-child(1) > .jss313 > .MuiPaper-root').should('be.visible')
      }      


//  مبلغ وارد شده بیش از موجودی کیف پول باشد
insufficentBalanceInWelfareTransfer(phoneNumber, nationalCode, OTP) {
  cy.intercept('GET', '**/account/wallet/**/balance').as('getBalance');


  this.welfareWallet().click({ force: true });
  this.welfareSelect().click();

  cy.wait('@getBalance').then((interception) => {
    const wallets = interception.response.body.result.data.balances;
    const targetWallet = wallets.find(w => w.title === 'بسته رفاهی خدمات');
    expect(targetWallet).to.exist;

    const currentBalance = Number(targetWallet.value); // بر حسب ریال
    const rawAmount = currentBalance + 100;

    // گرد کردن به بالاترین ضریب 10000 ریال (1000 تومان)
    const amountToSend = Math.ceil(rawAmount / 10000) * 10000;

    cy.log('Current Balance:', currentBalance);
    cy.log('Raw Amount:', rawAmount);
    cy.log('Final Rounded Amount (to send):', amountToSend);

    this.welfareTransferButton().click();
    this.destnationMsisndn().clear().type(phoneNumber);
    cy.wrap(phoneNumber).as('testPhoneNumber');
    this.destnationNationalCode().clear().type(nationalCode);
    this.amount().clear().type(amountToSend.toString());
    this.continueButton().click();

    this.insufficenBalanceToast({ timeout: 10000 })
      .should('be.visible')
      .and('contain.text', 'عجب! مبلغ از سقف موجودی بیشتره.');
  });
}

//مبلغ رفاهی 0 باشد و دکمه انتقال رفاهیات نمایش داده نشود
WelfareTransferWithZeroBalance() {
  // Intercepts
  cy.intercept('GET', '**/services/account/wallet/v1.2/balance').as('getBalance');

  // دریافت موجودی اولیه
  cy.wait('@getBalance', { timeout: 10000 }).then(({ response }) => {
    expect(response).to.exist;
    expect(response.statusCode).to.eq(200);

    const wallets = response.body.result.data.balances;
    const welfareWallet = wallets.find(w => w.title === 'اعتبار آموزش');
    expect(welfareWallet).to.exist;

    const balance = Number(welfareWallet.value);
    expect(balance).to.eq(0); // اطمینان از اینکه واقعا صفر است
  });

  // بررسی UI

  this.welfareWallet().click({ force: true });
  this.welfareSelect3().click({ force: true });

  // چون موجودی صفر است، دکمه نباید نمایش داده شود
  this.welfareTransferButton().should('not.exist');
}


     
}