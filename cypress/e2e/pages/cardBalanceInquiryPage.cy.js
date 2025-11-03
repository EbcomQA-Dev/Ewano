/// <reference types="cypress" />

// 1. اینجا بالای فایل، قبل از کلاس تابع کمکی dragSlider رو تعریف کن
function dragSlider(selector, startX, startY, endX, endY) {
  cy.get(selector)
    .trigger('mousedown', { button: 0, clientX: startX, clientY: startY })
    .trigger('mousemove', { clientX: endX, clientY: endY })
    .trigger('mouseup');
}


export class CardBalanceInquiry {
    servicesButton     = () => cy.get('.MuiBottomNavigation-root > :nth-child(2)',{ timeout: 10000 }) // انتخاب دکمه خدمات در صفحه خانه
    cardBalanceButton = () => cy.contains('موجودی کارت') // انتخاب دکمه موجودی کارت در صفحه خدمات
    cardListButton = () => cy.get('img[alt="button"]')
    cardSelect = () => cy.contains('h3', 'کارت‌های من').parents('[class*="MuiBox-root"]').find('p[dir="ltr"]').first().closest('div.MuiBox-root')
    cardInput = () => cy.get('input[type="text"][inputmode="numeric"]')
    daynamicPassButton = () => cy.contains('دریافت رمز پویا')
    expDatePicker = () => cy.get('input[readonly][type="text"][inputmode="text"]')
    datePicker = () => cy.get('.MuiDialog-container > .MuiPaper-root')
    cvv2InputBox = () => cy.contains('label', 'CVV2').parent().find('input[type="tel"][inputmode="numeric"]')
    daynamicPassInputBox = () => cy.contains('label', 'رمز پویا').parent().find('input[type="tel"][inputmode="numeric"]')
    confirmAndBalanceInquiry = () => cy.contains('دریافت موجودی')
    timerButton = () => cy.get('p.MuiTypography-root.MuiTypography-body1').contains(/^\d{2}:\d{2}$/); // دکمه تایمر دارای الگوی متنی از نوع زمان
    checkedBox = ()  => cy.get('.PrivateSwitchBase-input')
    receiptCard         = (opts = {}) => cy.get('.MuiCard-root', opts)
    wrongPassToast         =  () => cy.get('.toast-container') // رمز نادرست
    dynamicPassToast = () => cy.get('.Toastify__toast-body') // رمز پویا


  
  
  // انتخاب شماره کارت از لیست شماره ها
  CardSelect() {
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    this.servicesButton().click()
    this.cardBalanceButton().click()
    cy.wait('@getCards', { timeout: 10000 });
    this.cardListButton().click()
    this.cardSelect().first().click()

  }
  //   پر بودن ورودی شماره کارت بعد از انتخاب و فعال شدن دکمه رمز پویا
  assertcardInputUI() {
    this.cardInput().invoke('val').should('not.be.empty');
    this.daynamicPassButton().should('be.visible')
    
 }

  // دریافت ریسپانس موفق لیست کارت ها
  assertCardInputAPIResponse() {
    cy.get('@getCards').then((interception) => {
      const result = interception.response.body.result;
     expect(result.status.code).to.eq(200);
  });
  }


   // وارد کردن دستی شماره کارت 
   manuallyEnterCardNumber(cardNumber) {
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    this.servicesButton().click()
    this.cardBalanceButton().click()
    cy.wait('@getCards', { timeout: 10000 });
    this.cardInput().type(cardNumber)
    cy.wait(300);

  }
  //   پر بودن ورودی شماره کارت و فعال شدن دکمه رمز پویا
  assertcardUI() {
    this.cardInput()
    .should('exist')                // وجود داشته باشه
    .and('be.visible')              // نمایش داده شده باشه
    .and('not.be.disabled')         // غیرفعال نباشه
    .and('not.have.attr', 'readonly')

  this.daynamicPassButton().should('be.visible');
}
  

  // دریافت ریسپانس موفق لیست کارت ها
  assertCardInputAPIResponse() {
    cy.get('@getCards').then((interception) => {
      const result = interception.response.body.result;
     expect(result.status.code).to.eq(200);
  });
  }

    // تغییر تاریخ برای شماره کارت انتخاب شده
    CardExpChange() {

      cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
      this.servicesButton().click();
      cy.wait(5000);
      this.cardBalanceButton().click();
      cy.wait('@getCards', { timeout: 10000 });
      cy.wait(5000);
      this.cardListButton().click();
      cy.wait(5000);
      this.cardSelect().first().click();
    
      // باز کردن دیالوگ تاریخ
      this.expDatePicker().click();
    
      // منتظر بشیم دیالوگ کامل باز بشه
      cy.get('.MuiDialog-container')
        .should('exist')
        .and('have.css', 'display', 'flex')
        .and('have.css', 'opacity', '1');
      cy.wait(5000); // صبر اطمینان
    
      //درگ ماه
      dragSlider('.secondSliderContainer', 150, 200, 150, 100); // از پایین به بالا
    
      cy.wait(5000);
    
      // درگ سال
      dragSlider('.thirdSliderContainer', 150, 200, 150, 100); // از پایین به بالا
    
      cy.wait(5000);
    
      // کلیک روی دکمه تایید 
      cy.contains('تایید').click({ force: true });
    }

    //   پر بودن فیلد ورودی تاریخ انقضا بعد از تغییر تاریخ
   assertDatePikerUI() {
    this.expDatePicker().invoke('val').should('not.be.empty');
    this.daynamicPassButton().should('be.visible')
    this.datePicker().should('be.visible')
    }
    
  
  
    // دریافت ریسپانس موفق لیست کارت ها
    assertCardInputAPIResponse() {
      cy.get('@getCards').then((interception) => {
        const result = interception.response.body.result;
       expect(result.status.code).to.eq(200);
    });
    }

    // وجود آیکون حذف برای تکست فیلدها
    deleteIconForTextFields(cvv2Number,pass){
      cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');

    this.servicesButton().click();
      this.cardBalanceButton().click();
      cy.wait('@getCards', { timeout: 10000 });
      this.cardListButton().click();
      this.cardSelect().first().click();
      this.cvv2InputBox().type(cvv2Number)
      this.daynamicPassInputBox().type(pass)

  }

  assertDeleteIcontUI() {
    cy.get('svg[data-testid="CloseIcon"]').should('be.visible');  
  }

// دریافت موجودی موفق با رمز ثابت
    successBalanceInquiry(cvv2Number,pass){
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    cy.intercept('GET', '**/services/payment/card/v1.0/**/balance/**').as('getCardBalance');
    cy.intercept('GET', '**/services/account/v1.3/transaction/**?type=PAYMENT').as('getTransaction');

  this.servicesButton().click();
    this.cardBalanceButton().click();
    cy.wait('@getCards', { timeout: 10000 });
    cy.wait(5000)
    this.cardListButton().click();
    cy.wait(5000)
    this.cardSelect().first().click();
    cy.wait(5000)
    this.cvv2InputBox().type(cvv2Number)
    cy.wait(5000)
    this.daynamicPassButton().click()
    cy.wait(5000)
    this.daynamicPassInputBox().type(pass)
    cy.wait(5000)
    this.confirmAndBalanceInquiry().click()
    cy.wait(10000)
    cy.wait('@getCardBalance', { timeout: 10000 });
    cy.wait('@getCardBalance', { timeout: 10000 });



}
// نمایش رسید موفق
assertReceiptUI() {
  cy.wait('@getTransaction', { timeout: 20000 })
  this.receiptCard({ timeout: 30000 })
    .should('be.visible')
    .and('contain.text', 'عملیات موفق')
    .and('contain.text', 'دریافت موجودی کارت')
}

//  اعتبار سنجی سرویس ها  
assertBalancrInquiryAPIResponse() {

  // اعتبار سنجی سرویس دریافت موجودی
cy.get('@getCardBalance').then((interception) => {
  const result = interception.response.body.result
  expect(result.status.code).to.eq(200)
})

//  اعتبار سنجی سرویس تراکنش 
  cy.get('@getTransaction').then((interception) => {
    const result = interception.response.body.result
    expect(result.status.code).to.eq(200)
    expect(result.data.status).to.eq('COMPLETED')
    expect(result.data.title).to.eq('دریافت موجودی کارت')

const items = result.data.data
const price   = items.find(i => i.title === 'مبلغ (ریال)')
const service = items.find(i => i.title === 'نوع خدمت')

expect(price.value).to.eq(50000)
expect(service.value).to.eq('دریافت موجودی کارت')
})

  
}

// وارد کردن رمز پویا نادرست
wrongPass(cvv2Number,pass){
  cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
  cy.intercept('GET', '**/services/payment/card/v1.0/**/balance/**').as('getCardBalance');

this.servicesButton().click();
  this.cardBalanceButton().click();
  cy.wait('@getCards', { timeout: 10000 });
  this.cardListButton().click();
  this.cardSelect().first().click();
  this.cvv2InputBox().type(cvv2Number)
  this.daynamicPassInputBox().type(pass)
  this.confirmAndBalanceInquiry().click()

}
assertWrongPassUI() {
  cy.get('@getCardBalance');
  this.wrongPassToast({ timeout: 30000 })
    .should('be.visible')
    .and('contain.text', '4281 - رمز اشتباه است.')
}


// چک کردن تایمر رمز پویا
  timerCheck(cvv2Number){
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
    cy.intercept('POST', '**/services/payment/card/**/otp').as('postOtp');

this.servicesButton().click();
  this.cardBalanceButton().click();
  cy.wait('@getCards', { timeout: 10000 });
  this.cardListButton().click();
  this.cardSelect().first().click();
  this.cvv2InputBox().type(cvv2Number)
  this.daynamicPassButton().click()
  this.dynamicPassToast({ timeout: 30000 })
    .should('be.visible')
    .and('contain.text', 'رمز پویا برای شما ارسال شد.')

  // فعال بودن (نمایش و شمارش معکوس) تایمر
    this.timerButton().should('be.visible')
    .invoke('text')
    .then((initialText) => {
      cy.wait(2000);
      this.timerButton()
        .invoke('text')
        .should((newText) => {
          expect(newText).not.to.eq(initialText);
        });
    });


    cy.wait('@postOtp', { timeout: 20000 });
  
    }

    // عملکرد رمز پویا
  assertTimerIsRunning() {
      // چک میکنیم که تایمر ظاهر شده و فرمت زمان داره (مثلاً mm:ss)
      this.timerButton()
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          // چک فرمت ساده mm:ss با regex
          expect(text).to.match(/\d{2}:\d{2}/);
          
          // نگه داشتن مقدار اولیه برای مقایسه بعدی
          const initialTime = text;
    
          // بعد از 2 ثانیه دوباره مقدار تایمر رو چک میکنیم و مطمئن می‌شیم تغییر کرده
          cy.wait(2000);
    
          this.timerButton()
            .invoke('text')
            .should((newText) => {
              expect(newText).to.match(/\d{2}:\d{2}/);
              expect(newText).not.to.eq(initialTime); // تایمر باید تغییر کرده باشه
            });
        });
    }


    // چک کردن  روشن بودن پیش فرض باتن ذخیره اطلاعات
  saveInfoCheckBox(){
    cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');

this.servicesButton().click();
  this.cardBalanceButton().click();
  cy.wait('@getCards', { timeout: 10000 });
  
    }

    assertCheckBoxUI() {
      this.checkedBox().should('exist').and('be.checked');
    }

    // وارد کردن شماره کارت نامعتبر
    manuallyEnterInvalidCardNumber(cardNumber) {
      cy.intercept('GET', '**/services/payment/card/**/cards').as('getCards');
      this.servicesButton().click()
      this.cardBalanceButton().click()
      cy.wait('@getCards', { timeout: 10000 });
      this.cardInput().type(cardNumber)
      cy.wait(300);
  
    }

    // مشاهده هلپر تکست خطا در صورت وارد کردن شماره کارت نامعتبر
    assertInvalidCardNumberUI() {
      cy.get('.MuiFormHelperText-root').should('contain.text', 'نمی‌شه! این ‌شماره کارت شرایط لازم برای چنین درخواستی رو نداره.');
    }

}
