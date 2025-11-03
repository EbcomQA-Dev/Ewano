/// <reference types="cypress" />

export class BillPaymentPage {
    servicesButton     = () => cy.get('.MuiBottomNavigation-root > :nth-child(2)', { timeout: 10000 })
    phoneBill          =() => cy.contains('تلفن')
    utilityBill          =() => cy.contains('خدماتی')
    phoneNumberInput    = () => cy.contains('label', 'شماره تلفن همراه یا ثابت (با کد شهر)')
    .parent()        // رفتن به div بالادست که Input را نگه می‌دارد
    .find('input[type="tel"]')
    utilityInput  = () => cy.get('#\\:r9\\:')
    phoneInHistory      = () => cy.get(':nth-child(1) > #billItem') //انتخاب اولین شماره از لیست
    detailsHistory  = () => cy.get(':nth-child(1) > #billItem > .css-1qm1lh > .MuiButtonBase-root > img')
    inquiryAndConfirm   = () => cy.get('.css-14xxx3d > .MuiPaper-root > .jss24 > .jss29 > :nth-child(1) > :nth-child(1)')
    Edit = () => cy.get('.css-14xxx3d > .MuiPaper-root > .jss24 > .jss29 > :nth-child(1) > :nth-child(2)')
    Delete = () => cy.get('.css-14xxx3d > .MuiPaper-root > .jss24 > .jss29 > :nth-child(1) > :nth-child(3)')
    DeleteConfirm = () => cy.get('.MuiButton-outlined')
    cutTitle = () => cy.get('.jss71')
    InputTitle = () => cy.get('#\\:rp\\:')
    InputTitleAgain = () => cy.get('#\\:r18\\:')
    saveTitleEdit = () => cy.get('.jss322 > .MuiButtonBase-root')
    saveTitleEditAgain =() => cy.get('.jss464 > .MuiButtonBase-root')
    inquiryButton       = () => cy.contains('استعلام') //  دکمه استعلام تلفن
    inquryButtonUtility =() => cy.get('.jss263 > .MuiButtonBase-root') // دکمه استعلام خدماتی
    paymentButton       = () => cy.get('.jss283 > .MuiButton-root') // دکمه پرداخت تلفن
    paymentButtonUtility =() => cy.get('.jss434.MuiBox-root > .MuiButtonBase-root') // دکمه پرداخت خدماتی
    continueAndPay      = () => cy.contains('ادامه و پرداخت') // دکمه ادامه و پرداخت تلفن
    countinueAndPayUtility =() => cy.get('.jss19 > .MuiButtonBase-root')// دکمه ادامه و پرداخت خدماتی
    confirmAndContinue  = () => cy.contains('button', 'تایید و ادامه') // دکمه تایید و ادامه تلفن
    confirmAndContinueUtility =() => cy.get('.jss456 > .MuiButtonBase-root') // دکمه تایید و ادامه خدماتی
    saveInMyBill =() => cy.contains('span', 'ذخیره در لیست قبض های من')
    inputAlias = () => cy.contains('label', 'عنوان (اختیاری)')
    .invoke('attr', 'for')
    .then((id) => {
      cy.get(`#${CSS.escape(id)}`)
    })

    amount = () => cy.get(':nth-child(2) > .jss629')
    hotAmount = () => cy.get('.jss292 > .jss629')
    billId =() => cy.get(':nth-child(1) > .MuiTypography-bodySelected')
    payId = () => cy.get(':nth-child(2) > .MuiTypography-bodySelected')
    billAmount = () => cy.get('.jss445 > .MuiTypography-bodySelected')
    deadlineWarning = () => cy.get('.jss449 > .MuiTypography-root')
    backToHome = () => cy.contains ('بازگشت به خانه')
    billItem = () => cy.get('#container').find('[id="billItem"]');
    phoneNumberInBillItem = ($el) => cy.wrap($el).find('h6.MuiTypography-subtitle1 + h6.MuiTypography-subtitle1');
    aliasInBillItem = ($el) => cy.wrap($el).find('p.MuiTypography-body1');
    endBill =() => cy.contains('h6', 'پایان دوره')



    receiptCard         = (opts = {}) => cy.get('.MuiCard-root', opts)
    providerErrorInquiryToast =  () =>   cy.get('#id', { timeout: 8000 }).contains('4230 - متاسفانه ارتباط برقرار نشد')// اسنک بار دریافت خطای پروایدر روی استعلام قبض موبایل
    MobileOrPhonBillsWithoutDebtUIDialog =  () => cy.get('.MuiDialogContent-root') // باز شدن دیالوگ مبنی بر عدم وجود بدهی
    EditTitleToast = () => cy.get('#id', { timeout: 8000 }).contains('عملیات با موفقیت انجام شد.')



// استعلام قبض موبایل و تلفن ثابت
mobileAndPstnBillInquiry(phoneNumber) {
  cy.intercept('GET', '**/services/payment/bill/v1.0**').as('getBillInfo');

  this.servicesButton().click();
  this.phoneBill().click();
  this.phoneNumberInput().clear().type(phoneNumber);
  cy.wrap(phoneNumber).as('testPhoneNumber');

  this.inquiryButton().click();

  // صبر برای درخواست (فقط یکبار)
  cy.wait('@getBillInfo', { timeout: 20000 });
}


assertMobileAndPstnBillInquiryUI() {
  cy.get('@getBillInfo').then(({ response }) => {
    expect(response).to.exist;
    const apiAmount = response.body.result.data.amount;

    this.amount()
      .should('be.visible')
      .invoke('text')
      .then(text => {
        const cleanedText = text.replace(/[^\d]/g, '');
        const uiAmount = Number(cleanedText);

        expect(uiAmount).to.eq(apiAmount);
      });

    const apiHotAmount = response.body.result.data.hotAmount;

    this.hotAmount()
      .should('be.visible')
      .invoke('text')
      .then(text => {
        const cleanedHotText = text.replace(/[^\d]/g, '');
        const uiHotAmount = Number(cleanedHotText);

        expect(uiHotAmount).to.eq(apiHotAmount);
      });
  });
}

assertMobileAndPstnBillInquiryAPIResponse() {
  cy.get('@getBillInfo').then(({ response }) => {
    expect(response).to.exist;
    expect(response.statusCode).to.eq(200);
    expect(response.body.status.code).to.eq(200);
    const amount = response.body.result.data.amount;
    expect(amount).to.be.a('number').and.to.be.at.least(0);
  });
}

// استعلام و پرداخت قبض موبایل میان دوره همراه اول
  MCIHotmobileBillPayment(phoneNumber) {

    cy.intercept('GET', '/services/account/**/transaction/**?type=PAYMENT')
    .as('getBillPayment');

  this.servicesButton().click();
  this.phoneBill().click();
  this.phoneNumberInput().clear().type(phoneNumber);
  cy.wrap(phoneNumber).as('testPhoneNumber');

  this.inquiryButton().click();
  this.paymentButton().click();
  this.continueAndPay().click();


  this.confirmAndContinue()
    .scrollIntoView()
    .should('be.visible')
    .should('not.be.disabled')
    .click({ force: true });
}



// استعلام و پرداخت قبض موبایل پایان دوره همراه اول
MCIHmobileBillPayment(phoneNumber) {

  cy.intercept('GET', '/services/account/**/transaction/**?type=PAYMENT')
  .as('getBillPayment');

this.servicesButton().click();
this.phoneBill().click();
this.phoneNumberInput().clear().type(phoneNumber);
cy.wrap(phoneNumber).as('testPhoneNumber');

this.inquiryButton().click();
cy.wait(1000)
this.endBill().click()
this.paymentButton().click();
this.continueAndPay().click();


this.confirmAndContinue()
  .scrollIntoView()
  .should('be.visible')
  .should('not.be.disabled')
  .click({ force: true });
}
// استعلام و پرداخت قبض میان دوره موبایل ایرانسل
  MTNHotmobileBillPayment(phoneNumber) {

    cy.intercept('GET', '**/services/account/**/transaction/**?type=PAYMENT').as('getBillPayment');


      this.servicesButton().click();
      this.phoneBill().click();
      this.phoneNumberInput().clear().type(phoneNumber);
      cy.wrap(phoneNumber).as('testPhoneNumber');
    
      this.inquiryButton().click();
      this.paymentButton().click();
      this.continueAndPay().click();
    
      cy.wait(5000);
      this.confirmAndContinue()
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });
  }  
// استعلام و پرداخت قبض پایان دوره موبایل ایرانسل
  MTNmobileBillPayment(phoneNumber) {

    cy.intercept('GET', '**/services/account/**/transaction/**?type=PAYMENT').as('getBillPayment');


      this.servicesButton().click();
      this.phoneBill().click();
      this.phoneNumberInput().clear().type(phoneNumber);
      cy.wrap(phoneNumber).as('testPhoneNumber');
    
      this.inquiryButton().click();
      cy.wait(1000)
      this.endBill().click()
      this.paymentButton().click();
      this.continueAndPay().click();
    
      cy.wait(5000);
      this.confirmAndContinue()
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });
  } 
// استعلام و پرداخت قبض میان دوره موبایل رایتل
  RTLHotmobileBillPayment(phoneNumber) {

    cy.intercept('GET', '/services/account/**/transaction/**?type=PAYMENT')
      .as('getBillPayment')


      this.servicesButton().click();
      this.phoneBill().click();
      this.phoneNumberInput().clear().type(phoneNumber);
      cy.wrap(phoneNumber).as('testPhoneNumber');
    
      this.inquiryButton().click();
      this.paymentButton().click();
      this.continueAndPay().click();
    
    
      this.confirmAndContinue()
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });
  } 

  // استعلام و پرداخت قبض پایان دوره موبایل رایتل
  RTLmobileBillPayment(phoneNumber) {

    cy.intercept('GET', '/services/account/**/transaction/**?type=PAYMENT')
      .as('getBillPayment')


      this.servicesButton().click();
      this.phoneBill().click();
      this.phoneNumberInput().clear().type(phoneNumber);
      cy.wrap(phoneNumber).as('testPhoneNumber');
    
      this.inquiryButton().click();
      cy.wait(1000)
this.endBill().click()
      this.paymentButton().click();
      this.continueAndPay().click();
    
    
      this.confirmAndContinue()
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });
  } 
// استعلام و پرداخت قبض میان دوره تلفن ثابت
  pstnHotBillPayment(phoneNumber) {

    cy.intercept('GET', '/services/account/**/transaction/**?type=PAYMENT')
      .as('getBillPayment')


      this.servicesButton().click();
      this.phoneBill().click();
      this.phoneNumberInput().clear().type(phoneNumber);
      cy.wrap(phoneNumber).as('testPhoneNumber');
    
      this.inquiryButton().click();
      this.paymentButton().click();
      this.continueAndPay().click();
    
    
      this.confirmAndContinue()
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });
  } 
// استعلام و پرداخت قبض پایان دوره تلفن ثابت
  pstnBillPayment(phoneNumber) {

    cy.intercept('GET', '/services/account/**/transaction/**?type=PAYMENT')
      .as('getBillPayment')


      this.servicesButton().click();
      this.phoneBill().click();
      this.phoneNumberInput().clear().type(phoneNumber);
      cy.wrap(phoneNumber).as('testPhoneNumber');
    
      this.inquiryButton().click();
      cy.wait(1000)
this.endBill().click()
      this.paymentButton().click();
      this.continueAndPay().click();
    
    
      this.confirmAndContinue()
        .scrollIntoView()
        .should('be.visible')
        .should('not.be.disabled')
        .click({ force: true });
  } 

// عدم امکان استعلام قبض تلفن ثابت بدون وارد کردن کد شهر
  pstnmobileBillPaymentWithoutCityCode(phoneNumber) {

  this.servicesButton().click()
  this.phoneBill().click()
  this.phoneNumberInput().clear().type(phoneNumber)
  cy.wrap(phoneNumber).as('testPhoneNumber')
  this.inquiryButton().should('be.disabled')
} 

// مشاهده رسید موفق پرداخت قبض
  assertReceiptUI() {
  cy.get('@getBillPayment');
  this.receiptCard({ timeout: 30000 })
    .should('be.visible')
    .and('contain.text', 'عملیات موفق')
}

// ست کردن عنوان قبض در حین فرایند پرداخت
setAlias(phoneNumber, alias, expectedAlias) {
  cy.intercept('GET', '/services/account/v1.2/transaction/**?type=PAYMENT').as('getBillPayment');

  this.servicesButton().click();
  this.phoneBill().click();
  this.phoneNumberInput().clear().type(phoneNumber);
  cy.wrap(phoneNumber).as('testPhoneNumber');
  this.inquiryButton().click();
cy.wait(8000)
  this.saveInMyBill().click();

  // چون inputAlias توی کلاس async هست، بهتر اینجا مستقیم بگیریمش:
  cy.contains('label', 'عنوان (اختیاری)')
    .invoke('attr', 'for')
    .then(id => {
      cy.get(`#${CSS.escape(id)}`).clear().type(alias);
    });

  cy.wrap(alias).as('testAlias');
  this.paymentButton().click();
  this.continueAndPay().click();
  this.confirmAndContinue().click();

  // صبر کن درخواست و عملیات انجام بشه
  cy.wait(5000);

  this.backToHome().click();

  cy.wait(5000);

  this.servicesButton().click();
  this.phoneBill().click();

  // حالا لیست قبض ها رو چک میکنیم برای وجود شماره و alias
  this.billItem().each(($el) => {
    this.phoneNumberInBillItem($el).invoke('text').then(text => {
      if (text.trim() === phoneNumber) {
        this.aliasInBillItem($el).invoke('text').then(aliasText => {
          expect(aliasText.trim()).to.eq(alias);
        });
      }
    });
  });
}




// api رسید جهت پرداخت موفق قبض همراه اول
  assertMCIBillPaymentAPIResponse() {
  cy.get('@getBillPayment').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
    expect(result.data.status).to.eq('COMPLETED');
    expect(result.data.title).to.eq('پرداخت قبض همراه اول');
    const items = result.data.data;
    const service = items.find(i => i.title === 'نوع خدمت');
    const phone = items.find(i => i.title === 'شماره تلفن همراه');
  
    cy.wrap(service.value).should('eq', 'پرداخت قبض همراه اول'); 
  
    cy.get('@testPhoneNumber').then(testPhone => {
      cy.wrap(phone.value).should('eq', testPhone);
    })
  });
}
// api رسید جهت پرداخت موفق قبض ایرانسل
  assertMTNBillPaymentAPIResponse() {
  cy.wait('@getBillPayment').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
    expect(result.data.status).to.eq('COMPLETED');
    expect(result.data.title.trim()).to.eq('پرداخت قبض ایرانسل');
    const items = result.data.data;
    const service = items.find(i => i.title === 'نوع خدمت');
    const phone = items.find(i => i.title === 'شماره تلفن همراه');
  
    cy.wrap(service.value).should('eq', 'پرداخت قبض ایرانسل'); 
  
    cy.get('@testPhoneNumber').then(testPhone => {
      cy.wrap(phone.value).should('eq', testPhone);
    })
    
  });
}
// api رسید جهت پرداخت موفق قبض رایتل
  assertRTLBillPaymentAPIResponse() {
  cy.get('@getBillPayment').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
    expect(result.data.status).to.eq('COMPLETED');
    expect(result.data.title).to.eq('پرداخت قبض رایتل')
    const items = result.data.data;
    const service = items.find(i => i.title === 'نوع خدمت');
    const phone = items.find(i => i.title === 'شماره تلفن همراه');
  
    cy.wrap(service.value).should('eq', 'پرداخت قبض رایتل'); 
  
    cy.get('@testPhoneNumber').then(testPhone => {
      cy.wrap(phone.value).should('eq', testPhone);
    })
  });
}
// api رسید جهت پرداخت موفق قبض تلفن ثابت
  assertpstnBillPaymentAPIResponse() {
  cy.get('@getBillPayment').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
    expect(result.data.status).to.eq('COMPLETED');
    expect(result.data.title).to.eq('پرداخت قبض تلفن ثابت');
    const items = result.data.data;
    const service = items.find(i => i.title === 'نوع خدمت');
    const phone = items.find(i => i.title === 'شماره تلفن');
  
    cy.wrap(service.value).should('eq', 'پرداخت قبض تلفن ثابت'); 
  
    cy.get('@testPhoneNumber').then(testPhone => {
      cy.wrap(phone.value).should('eq', testPhone);    
    })
  });
}


// استعلام قبض موبایل یا تلفن ثابت در وضعیتی که پروایدر در حال استعلام خطا برگرداند
  providerEroorinMobileInquiry(phoneNumber) {

 this.servicesButton().click();
  this.phoneBill().click();
  this.phoneNumberInput().clear().type(phoneNumber);
    
  this.inquiryButton().click();

} 

// مشاهده اسنک بار خطای پروایدر هنگام استعلام قبض موبایل یا تلفن ثابت
  assertproviderErrorMobileInquiryUI() {
    this.providerErrorInquiryToast().should('be.visible');
}
        

// استعلام قبض موبایل یا تلفن ثابت اگر بدهی وجود نداشته باشد
  InquiryMobileOrPhonBillsWithoutDebt(phoneNumber) {
    cy.intercept('GET', '**/services/payment/bill/v1.0*').as('getBillInquiry')
  
    this.servicesButton().click()
    this.phoneBill().click()
    this.phoneNumberInput().clear().type(phoneNumber)
    cy.wrap(phoneNumber).as('testPhoneNumber')
    this.inquiryButton().click()
}
  
// مشاهده دیالوگ عدم وجود بدهی 
  assertMobileOrPhonBillsWithoutDebtUI() {
    cy.wait('@getBillInquiry');
    this.MobileOrPhonBillsWithoutDebtUIDialog({ timeout: 30000 })
      .should('be.visible')
      .and('contain.text', 'یه خبر خوب! این قبض پرداخت شده.')
}
  

// استعلام قبض از لیست شماره های موجود
  mciMobilePaymentIsInHistoryList() {

        cy.intercept('GET', '**/services/payment/bill/v1.0*').as('getBillInquiry')
    
    
        this.servicesButton().click()
        this.phoneBill().click()
        this.phoneInHistory().click()
        this.detailsHistory().click();
        this.inquiryAndConfirm().click()
  
}  
  
// مشاهده  بدهی قبض 
  assertmciMobilePaymentIsInHistoryListAPIResponse() {
      cy.wait('@getBillInquiry').then((interception) => {
        expect(interception.response.statusCode).to.eq(200);
        const result = interception.response.body.result;
        expect(result.status.code).to.eq(200);
      });
}

// ویرایش نام قبض

  EditTitle() {
        cy.intercept('PUT', '/services/payment/v1.0/transaction/**/description')
        .as('editBill')

         this.servicesButton().click();
         this.phoneBill().click();
         this.phoneInHistory().click()
         this.detailsHistory().click()
         this.Edit().click()
         this.cutTitle().click()
         this.InputTitle().type ('for edit test')
         this.saveTitleEdit().click()
} 
// ویرایش نام قبض مجدد
  EditTitleAgain() {
          cy.intercept('PUT', '/services/payment/v1.0/transaction/**/description')
          .as('editBill')

          this.phoneInHistory().click()
          this.detailsHistory().click()
          this.Edit().click()
          this.cutTitle().click()
          this.InputTitleAgain().type ('for edit')
          this.saveTitleEditAgain().click()
} 

// مشاهده اسنک بار تغییر عنوان موفق
  assertSuccessEditUI() {
          this.EditTitleToast().should('be.visible');
}
// مشاهده ریسپانس موفق سرویس ادیت 
  assertSuccessEditAPI() {
                      cy.wait('@editBill').then((interception) => {
                        expect(interception.response.statusCode).to.eq(200);
                        const result = interception.response.body.result;
                        expect(result.status.code).to.eq(200);});
}

// حذف قبض
  deleteBill() {
          cy.intercept('PUT', '/services/payment/v1.0/transaction/**/description')
          .as('editBill')
  
           this.servicesButton().click();
           this.phoneBill().click();
           this.phoneInHistory().click()
           this.detailsHistory().click()
           this.Delete().click()
           this.DeleteConfirm().click()

}   
  assertSuccessDeleteAPI() {
            cy.wait('@editBill').then((interception) => {
              expect(interception.response.statusCode).to.eq(200);
              const result = interception.response.body.result;
              expect(result.status.code).to.eq(200);});
} 



// Page Object Method
utilityBillInquiry(BillNumber) {
  cy.intercept('GET', '**/services/payment/bill/v1.0*').as('getBillInfo');

  this.servicesButton().click();
  this.utilityBill().click();
  this.utilityInput().clear().type(BillNumber);
  cy.wrap(BillNumber).as('testBillNumber');
  this.inquryButtonUtility().click();

  cy.wait('@getBillInfo', { timeout: 20000 }).then((interception) => {
    if (!interception?.response) {
      throw new Error('API request did not receive a response');
    }
    cy.wrap(interception).as('billInfoResponse');
    cy.log('✅ API Response:', interception.response.body);
  });
}

assertUtilityBillInquiryUI() {
  cy.get('@getBillInfo').its('response').should('exist').then((response) => {
    expect(response.statusCode).to.eq(200);
    expect(response.body.status.code).to.eq(200);

    const apiData = response.body.result.data;
    cy.log('API Data:', apiData);

    // شناسه قبض
    this.billId()
    .should('be.visible')  // صبر تا المنت نمایش داده شود
    .invoke('text')
    .should(text => {
      expect(text.trim()).to.not.be.empty; // مطمئن شو متن خالی نیست
    })
    .then(text => {
      // پاکسازی متن فقط اعداد
      const billIdInUI = text.replace(/[^\d]/g, '').trim();
      expect(billIdInUI).to.eq(apiData.billId);
    });
  

    // ✅ Assert Payment ID (شناسه پرداخت)
    this.payId()
  .should('be.visible')
  .parent()
  .invoke('text')
  .then(text => {
    const payIdInUI = text.replace(/[^\d]/g, '').trim();
    expect(payIdInUI).to.eq(apiData.payId);
  });


    // ✅ Assert Amount (مبلغ)
    this.billAmount()
      .should('be.visible')
      .invoke('text')
      .then(text => {
        const uiAmount = Number(text.replace(/[^\d]/g, ''));
        expect(uiAmount).to.be.a('number').and.not.be.NaN;
        expect(uiAmount).to.eq(apiData.amount);
      });
  });
}


// API Assertion
assertUtilityBillInquiryAPIResponse() {
  cy.get('@billInfoResponse').its('response').should('exist').then((response) => {
    expect(response.statusCode).to.eq(200);
    expect(response.body.status.code).to.eq(200);
    const data = response.body.result.data;

    expect(data.amount).to.be.a('number').and.to.be.at.least(0);
    expect(data.billId).to.match(/^\d{10,}$/);
    expect(data.payId).to.match(/^\d{6,}$/);
    expect(data.dueDate).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
    expect(data.provider).to.be.oneOf(['SADAD', 'MCI', 'IRANCELL', 'WATER', 'GAS', 'ELECTRICITY']);
    expect(data.type).to.be.oneOf(['electricity', 'water', 'gas', 'phone', 'mobile']);
    expect(data.message).to.be.a('string');
    expect(data.bill_id).to.eq(data.billId);
    expect(data.pay_id).to.eq(data.payId);
  });
}



// استعلام و پرداخت قبض آب
waterBillPayment(BillNumber) {

  cy.intercept('GET', '/services/account/v1.2/transaction/**?type=PAYMENT')
    .as('getBillPayment')


  this.servicesButton().click()
  this.utilityBill().click()
  this.utilityInput().clear().type(BillNumber)
  cy.wrap(BillNumber).as('testBillNumber')
  this.inquryButtonUtility().click()
 this.paymentButtonUtility().click()
 this.countinueAndPayUtility().click()
 this.confirmAndContinueUtility().click()
}    
assertWaterBillPymentAPIResponse() {
  cy.get('@getBillPayment').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
    expect(result.data.status).to.eq('COMPLETED');
    expect(result.data.title).to.eq('پرداخت قبض آب');
  });
}     
// استعلام و پرداخت قبض برق
electricyBillPayment(BillNumber) {

  cy.intercept('GET', '/services/account/v1.2/transaction/**?type=PAYMENT')
    .as('getBillPayment')


  this.servicesButton().click()
  this.utilityBill().click()
  this.utilityInput().clear().type(BillNumber)
  cy.wrap(BillNumber).as('testBillNumber')
  this.inquryButtonUtility().click()
 this.paymentButtonUtility().click()
 this.countinueAndPayUtility().click()
 this.confirmAndContinueUtility().click()
}    
assertElectricyBillPymentAPIResponse() {
  cy.get('@getBillPayment').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
    expect(result.data.status).to.eq('COMPLETED');
    expect(result.data.title).to.eq('پرداخت قبض برق');
  });
}   

// استعلام و پرداخت قبض گاز
gasBillPayment(BillNumber) {

  cy.intercept('GET', '/services/account/v1.2/transaction/**?type=PAYMENT')
    .as('getBillPayment')


  this.servicesButton().click()
  this.utilityBill().click()
  this.utilityInput().clear().type(BillNumber)
  cy.wrap(BillNumber).as('testBillNumber')
  this.inquryButtonUtility().click()
 this.paymentButtonUtility().click()
 this.countinueAndPayUtility().click()
 this.confirmAndContinueUtility().click()
}    
assertgasBillPymentAPIResponse() {
  cy.get('@getBillPayment').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
    expect(result.data.status).to.eq('COMPLETED');
    expect(result.data.title).to.eq('پرداخت قبض گاز');
  });
} 


// استعلام قبضی که از مهلت پرداخت آن گذشته باشد
billWithPastDuePaymentDate(BillNumber) {
  cy.intercept('GET', '**/services/payment/bill/v1.0*').as('getBillInfo');

  this.servicesButton().click();
  this.utilityBill().click();
  this.utilityInput().clear().type(BillNumber);
  cy.wrap(BillNumber).as('testBillNumber');
  this.inquryButtonUtility().click();

  cy.wait('@getBillInfo', { timeout: 20000 }).then((interception) => {
    if (!interception?.response) {
      throw new Error('API request did not receive a response');
    }
    cy.wrap(interception).as('billInfoResponse');
    cy.log('✅ API Response:', interception.response.body);
  });
}

assertBillWithPastDueDateUI() {
  const expectedMessage = 'جهت اطلاع! از اونجایی که مهلت پرداخت این قبض گذشته بود، علاوه بر پرداخت صورت گرفته، باید به سازمان مربوطه هم مراجعه کنید تا قطعی پیش نیاد';

  this.deadlineWarning()
    .should('be.visible')
    .and('contain.text', expectedMessage);
}


assertBillWithPastDueDateAPIResponse() {
  cy.get('@billInfoResponse').its('response').should('exist').then((response) => {
    const { dueDate, message } = response.body.result.data;

    expect(dueDate).to.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);

    // استخراج بخش تاریخ از dueDate
    const dueDateOnly = new Date(dueDate.split('T')[0]);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // صفر کردن زمان برای مقایسه فقط تاریخ

    if (dueDateOnly < today) {
      // اگر تاریخ قبض قبل از امروز بود، باید پیام هشدار داشته باشیم
      const expectedMessage = 'جهت اطلاع! از اونجایی که مهلت پرداخت این قبض گذشته بود، علاوه بر پرداخت صورت گرفته، باید به سازمان مربوطه هم مراجعه کنید تا قطعی پیش نیاد';
      expect(message).to.eq(expectedMessage);
    } else {
      // در غیر این صورت، نباید message موجود باشد یا باید خالی باشد
      expect(message || '').to.be.empty;
    }
  });
}

}