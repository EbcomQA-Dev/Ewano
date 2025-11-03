/// <reference types="cypress" />

export class CardToCard {
  cardToCardButton = () => cy.contains('button', 'کارت به کارت',{ timeout: 10000 });
  originCardInput = () => cy.get('input[type="text"][placeholder="شماره کارت مبدأ"]')
  selectOrigin = () => cy.get('#sourceCard-list > div').first().find('p').first()
  selectSecondOrigin = () => cy.get('#sourceCard-list > div').eq(1).find('p').first();
  destenationInput = () =>   cy.get('label:contains("شماره کارت مقصد")').parent().siblings('div').find('button').first();
  destenationInputBox = () => cy.get('label:contains("شماره کارت مقصد")').siblings('div').find('input[type="text"]')       // input خود کارت مقصد
  selectDestenation = () => cy.get('#destinationCard-list > div').first();
  amountInput = () => cy.get('label:contains("مبلغ (ریال)")').siblings('div').find('input');
  descriptionInput = () => cy.get('label:contains("توضیحات")').siblings('div').find('input[type="text"]').should('exist');
  countinueButton = () => cy.contains('ادامه')
  cvv2InputBox = () => cy.contains('label', 'CVV2').parent().find('input')
  daynamicPassInputBox = () => cy.get('label:contains("رمز پویا")').siblings('div').find('input');
  dynamicPassButton = () => cy.get('.MuiGrid-container > :nth-child(4) > .MuiButtonBase-root')
  backIcon = () => cy.get('button.goBack svg[data-testid="ArrowForwardIosOutlinedIcon"]')
  timerButton = () => cy.get('p.MuiTypography-root.MuiTypography-body1').contains(/^\d{2}:\d{2}$/); // دکمه تایمر دارای الگوی متنی از نوع زمان
  cAndCButton =() => cy.contains('تایید و ادامه') // دکمه تایید و ادامه در صفحه دوم کارت به کارت
  cAndTButton = () => cy.contains('تایید و انتقال') // دکمه تایید و انتقال در صفحه دوم کارت به کارت
  amountLessThan10000RialsToast         =  () => cy.get('.toast-container') // اسنک بار مبلغ زیر 10000 ریال
  amountMoreThan50000000RialsToast         =  () => cy.get('.toast-container') // اسنک بار مبلغ بالای 50000000 ریال
  similarityOfOriginAndDestinationCardsToast  =  () => cy.get('.toast-container') //یکی بودن کارتهای مبدا و مقصد با یکدیگر
  moreThan3Toast  =  () => cy.get('.toast-container') //جابجایی بیش از 3 بار در روز
  dynamicPassToast = () => cy.get('.Toastify__toast-body')
  expDynamicPassToast = () => cy.get('.Toastify__toast-body')
  receiptCard          = (opts = {}) => cy.get('#layout-content',opts)  // رسید خرید موفق
  wrongPassToast = () => cy.get('.Toastify__toast-body')
   





 // تابع کمکی برای چک کردن و حذف بک‌دراپ اگر زیاد موند
 waitForBackdropToDisappear(timeout = 15000) {
  const start = Date.now();

  const check = () => {
    return cy.get('.MuiBackdrop-root').then($els => {
      // همه بک‌دراپ‌ها باید opacity=0 و pointer-events=none داشته باشند
      const allDisabled = [...$els].every(el => window.getComputedStyle(el)['pointer-events'] === 'none');
      const allInvisible = [...$els].every(el => {
        const op = window.getComputedStyle(el)['opacity'];
        return op === '0' || op === '0.0';
      });

      if (allDisabled && allInvisible) {
        // اگر همه شرایط درست بود، رد شو
        return;
      } else if (Date.now() - start > timeout) {
        // تایم‌اوت: بک‌دراپ رو دستی حذف کن
        cy.log('Backdrop still visible after timeout, removing it manually');
        $els.each((i, el) => el.remove());
      } else {
        // 100 میلی‌ثانیه صبر و دوباره چک کن
        return cy.wait(100).then(check);
      }
    });
  };

  return check();
}

// انتخاب شماره مبدا و مقصد از لیست شماره ها
cardToCardInput() {
  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');

  this.cardToCardButton().scrollIntoView().click({ force: true });
  cy.wait('@getOriginCards', { timeout: 10000 });
  cy.log('📌 مرحله ۱: کلیک روی فیلد کارت مبدا');
  this.originCardInput().click();
  cy.log('⏳ انتظار برای ظاهر شدن لیست کارت‌های مبدا');
  cy.get('#sourceCard-list', { timeout: 10000 }).should('be.visible');
  cy.log('📌 مرحله ۲: انتخاب اولین کارت مبدا');
  this.selectOrigin().then($el => {
    // اگر بک‌دراپ هنوز هست
    cy.get('body').then($body => {
      if ($body.find('.MuiBackdrop-root').length > 0) {
        cy.log('⚠️ بک‌دراپ هنوز فعاله، غیرفعالش می‌کنیم...');
        cy.get('.MuiBackdrop-root').invoke('css', 'pointer-events', 'none');
      }
    });
cy.wait(5000)
    // حالا کلیک روی کارت
    cy.wrap($el).click({ force: true });
    cy.log('✅ کارت مبدا انتخاب شد');
  });


  cy.log('📌 مرحله ۳: باز کردن لیست کارت مقصد');
  this.destenationInput()
    .scrollIntoView()
    .should('exist')
    .click({ force: true });
    
    cy.get('#destinationCard-list', { timeout: 10000 })
  .should('be.visible')
  .find('p.MuiTypography-root.MuiTypography-body1')
  .should('have.length.greaterThan', 0)
  .first()
  .scrollIntoView()
  .should('be.visible')
  .then($card => {
    // اگر هنوز بک‌دراپ هست
    cy.get('body').then($body => {
      if ($body.find('.MuiBackdrop-root').length > 0) {
        cy.get('.MuiBackdrop-root').invoke('css', 'pointer-events', 'none');
      }
    });

    // مطمئن شدن از transform یا opacity کارت
    cy.wrap($card).should('have.css', 'opacity', '1');
    cy.wrap($card).click({ force: true });
  });

cy.log('✅ کارت مقصد انتخاب شد');

  

}

// پر شدن ورودی
assertInputtUI() {
  this.originCardInput().invoke('val').then(val => {
    cy.log('originCardInput val:', val);
    expect(val).to.not.be.empty;
  });
 this.destenationInputBox().invoke('val').then(val => {
   cy.log('destenationInput val:', val);
    expect(val).to.not.be.empty;
  });
  
}
// دریافت ریسپانس موفق لیست کارت ها
assertcardToCardInputAPIResponse() {
  cy.get('@getOriginCards').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  });
}

// وارد کردن شماره مقصد به صورت دستی
cardDestenation(cardNumber){
  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');

  // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
  this.cardToCardButton().scrollIntoView().click({ force: true });
  cy.wait(500)
  this.originCardInput().click({ force: true });
  cy.wait(500)
  cy.wait('@getOriginCards', { timeout: 10000 });
  cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
  cy.wait(500)
  this.selectOrigin().click({ force: true });
  cy.wait(500)
  this.destenationInputBox().type(cardNumber)
  cy.wrap(cardNumber).as('testcardNumber')

}
// پر شدن فیلد شماره کارت مقصد
assertDestnationInputtUI() {
 this.destenationInputBox().invoke('val').then(val => {
   cy.log('destenationInput val:', val);
    expect(val).to.not.be.empty;
  });
  
}
// دریافت ریسپانس موفق لیست کارت های ورودی
assertcardToCardInputAPIResponse() {
  cy.get('@getOriginCards').then((interception) => {
    const result = interception.response.body.result;
    expect(result.status.code).to.eq(200);
  });
}

// وجود آیکون حذف برای تکست فیلدهادر صفحه اول کارت به کارت
deleteIconForTextFields(amount, description){
cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');

  // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
  this.cardToCardButton().scrollIntoView().click({ force: true });
  this.originCardInput().click({ force: true });

  cy.wait('@getOriginCards', { timeout: 10000 });
  cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
  this.selectOrigin().click({ force: true });

  // مرحله ۲: باز کردن لیست مقصد
  this.destenationInput().should('be.visible').click({ force: true });

  // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
  cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');

  // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
  cy.wait(5000)
  cy.get('#destinationCard-list')
  .find('p.MuiTypography-root')
  .first()
  .click({ force: true });
  this.amountInput().type(amount)
  this.descriptionInput().type(description)
}

// وجود آیکون حذف برای تکست فیلدهادر صفحه دوم کارت به کارت
deleteIconForTextFieldsSecendryPage(amount, description,cvv2Number,pass){
  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');
  
    // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
    this.cardToCardButton().scrollIntoView().click({ force: true });
    this.originCardInput().click({ force: true });
  
    cy.wait('@getOriginCards', { timeout: 10000 });
    cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
    this.selectOrigin().click({ force: true });
  
    // مرحله ۲: باز کردن لیست مقصد
    this.destenationInput().should('be.visible').click({ force: true });
  
    // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
    cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');
  
    // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
    cy.wait(5000)
    cy.get('#destinationCard-list')
    .find('p.MuiTypography-root')
    .first()
    .click({ force: true });
    this.amountInput().type(amount)
    this.descriptionInput().type(description)
    this.countinueButton().click()
    this.cvv2InputBox().type(cvv2Number)
    this.daynamicPassInputBox().type(pass)

  }

assertDeleteIcontUI() {
  cy.get('svg[data-testid="CloseIcon"]').should('be.visible');  
}



  // کارت به کارت با مبلغ کمتر از 10000 ریال
  amountLessThan10000Rials(amount){
    cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');

  // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
  this.cardToCardButton().scrollIntoView().click({ force: true });
  this.originCardInput().click({ force: true });

  cy.wait('@getOriginCards', { timeout: 10000 });
  cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
  this.selectOrigin().click({ force: true });

  // مرحله ۲: باز کردن لیست مقصد
  this.destenationInput().should('be.visible').click({ force: true });

  // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
  cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');

  // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
  cy.wait(5000)
  cy.get('#destinationCard-list')
  .find('p.MuiTypography-root')
  .first()
  .click({ force: true });
      this.amountInput().type(amount)
      this.countinueButton().click()
  
    }
  
  
assertAmountLessThan10000RialsUI() {
  this.amountLessThan10000RialsToast({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text', 'کمترین مبلغ قابل انتقال یک هزار تومنه')
}


  // کارت به کارت با مبلغ بیش از 50000000 ریال
  amountMoreThan50000000Rials(amount){
    cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');

  // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
  this.cardToCardButton().scrollIntoView().click({ force: true });
  this.originCardInput().click({ force: true });

  cy.wait('@getOriginCards', { timeout: 10000 });
  cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
  this.selectOrigin().click({ force: true });

  // مرحله ۲: باز کردن لیست مقصد
  this.destenationInput().should('be.visible').click({ force: true });

  // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
  cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');

  // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
  cy.wait(5000)
  cy.get('#destinationCard-list')
  .find('p.MuiTypography-root')
  .first()
  .click({ force: true });
      this.amountInput().type(amount)
      this.countinueButton().click()
  
    }
  
  
assertAmountMoreThan50000000RialsUI() {
  this.amountMoreThan50000000RialsToast({ timeout: 30000 })
  .should('be.visible')
  .invoke('text')
  .then(text => {
    expect(text).to.include('بیشترین مبلغ');
    expect(text).to.include('قابل انتقال');
    expect(text).to.include('پنج میلیون تومنه');
  });
  
}


  // چک تایمر رمز دوم پس از برگشت به صفحه اول و سپس دوباره دوم کارت به کارت
  timerCheckWithBackPages(amount,cvv2Number){
    cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');
    cy.intercept('POST', '**/services/payment/card/**/otp').as('postOtp');
  
    // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
    this.cardToCardButton().scrollIntoView().click({ force: true });
    this.originCardInput().click({ force: true });
  
    cy.wait('@getOriginCards', { timeout: 10000 });
    cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
    this.selectOrigin().click({ force: true });
  
    // مرحله ۲: باز کردن لیست مقصد
    this.destenationInput().should('be.visible').click({ force: true });
  
    // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
    cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');
  
    // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
    cy.wait(5000)
    cy.get('#destinationCard-list')
    .find('p.MuiTypography-root')
    .first()
    .click({ force: true });
    
    this.amountInput().type(amount)
    this.countinueButton().click()
    this.cvv2InputBox().type(cvv2Number)
    this.dynamicPassButton().click()
    cy.wait(5000)
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

    cy.wait(5000)
    this.backIcon().eq(1).click({ force: true });
    this.countinueButton().click()
    this.timerButton().should('be.visible')

    cy.wait('@postOtp', { timeout: 20000 });
  
    }
  
// فعال شدن وصحت عملکرد تایمر
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

 // ثبت درخواست رمز پویا پس از گذشت 2 دقیقه
 requestAgainForDynamicPassButton(amount,cvv2Number){

  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');
  cy.intercept('POST', '**/services/payment/card/**/otp').as('postOtp');

  // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
  this.cardToCardButton().scrollIntoView().click({ force: true });
  this.originCardInput().click({ force: true });

  cy.wait('@getOriginCards', { timeout: 10000 });
  cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
  this.selectOrigin().click({ force: true });

  // مرحله ۲: باز کردن لیست مقصد
  this.destenationInput().should('be.visible').click({ force: true });

  // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
  cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');

  // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
  cy.wait(5000)
  cy.get('#destinationCard-list')
  .find('p.MuiTypography-root')
  .first()
  .click({ force: true });
  // وارد کردن اطلاعات در صفحه دوم کارت به کارت
  this.amountInput().type(amount)
  this.countinueButton().click()
  this.cvv2InputBox().type(cvv2Number)
  // درخواست رمز پویا
  this.dynamicPassButton().click()
  cy.wait(5000)
  // مشاهده اسنک بار موفق بودن درخواست رمز پویا
  this.dynamicPassToast({ timeout: 30000 })
  .should('be.visible')
  .should('contain.text', 'رمز پویا');

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

  cy.wait(120000)

// مشاهده اسنک بار منقضی شدن زمان رمز  
this.expDynamicPassToast({ timeout: 30000 })
.should('be.visible')
.invoke('text')
.should('match', /زمان رمز منقضی شده است/);

// قابل مشاهده بودن دکمه رمز پویا
  this.dynamicPassButton().should('be.visible')

  // درخواست رمز پویا مجدد
  this.dynamicPassButton().click()
  cy.wait(5000)
  // مشاهده اسنک بار موفق بودن درخواست رمز پویا
  this.dynamicPassToast({ timeout: 30000 })
  .should('be.visible')
  .should('contain.text', 'رمز پویا');

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

  assertpostOtpAPIResponse() {
    cy.get('@postOtp').then((interception) => {
      const result = interception.response.body.result;
      expect(result.data.provider).to.eq('HUB');
      expect(result.data.message).to.eq('درخواست شما برای دریافت رمز پویا  با موفقیت ارسال گردید. مشتری گرامی ، در صورتیکه از صحت اطلاعات وارد شده اطمینان دارید ولی هنوز رمز دوم پویای خود را دریافت ننموده اید مجددا دکمه درخواست رمز پویا را بفشارید. در غیر اینصورت برای رفع مشکل به بانک صادر کننده کارت خود مراجعه فرمایید.');
      });}

// فعال شدن وصحت عملکرد تایمر
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

// وارد کردن شماره کارت مقصد نامعتبر و مشاهده هلپر تکست
wrongDestenationCardFormat(cardNumber){
  
  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');

  // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
  this.cardToCardButton().scrollIntoView().click({ force: true });
  this.originCardInput().click({ force: true });

  cy.wait('@getOriginCards', { timeout: 10000 });
  cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
  this.selectOrigin().click({ force: true });
  this.destenationInputBox().type(cardNumber)
  cy.wrap(cardNumber).as('testcardNumber')
}


//وارد کردن شماره کارت مقصد نامعتبر
assertwrongDestenationCardFormatUI() {
  cy.get('.MuiFormHelperText-root').should('contain.text', 'عجب! اینی که نوشتین شماره کارت نیست.');
}


//بررسی رفتار دکمه تایید و ادامه در زمان وارد نکردن فیلدهای الزامی (نباید فعال شود)
cAndCButtonNotActiveWithoutEnteringInfo(amount){
  
  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');

  // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
  this.cardToCardButton().scrollIntoView().click({ force: true });
  this.originCardInput().click({ force: true });

  cy.wait('@getOriginCards', { timeout: 10000 });
  cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
  this.selectOrigin().click({ force: true });

  // مرحله ۲: باز کردن لیست مقصد
  this.destenationInput().should('be.visible').click({ force: true });

  // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
  cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');

  // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
  cy.wait(5000)
  cy.get('#destinationCard-list')
  .find('p.MuiTypography-root')
  .first()
  .click({ force: true });
  this.amountInput().type(amount)
  this.countinueButton().click()
}

assertcAndCButtonNotActiveUI(){  
  this.cAndCButton()
  .should('exist')
  .and('not.be.enabled')  // دکمه غیر فعال باشه
 
}

// کارت به کارت موفق
successCardToCard(amount, description,cvv2Number,pass){
  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');
  cy.intercept('GET', '**/services/account/**/transaction/**?type=PAYMENT').as('getTransaction');
  
    // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
    this.cardToCardButton().scrollIntoView().click({ force: true });
    this.originCardInput().click({ force: true });
  
    cy.wait('@getOriginCards', { timeout: 10000 });
    cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
    this.selectOrigin().click({ force: true });
  
    cy.wait(3000)
    // مرحله ۲: باز کردن لیست مقصد
    this.destenationInput().should('be.visible').click({ force: true });
  
    // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
    cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');
  
    // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
    cy.wait(5000)
    cy.get('#destinationCard-list')
    .find('p.MuiTypography-root')
    .first()
    .click({ force: true });
    this.amountInput().type(amount)
    this.descriptionInput().type(description)
    this.countinueButton().click()
    this.cvv2InputBox().type(cvv2Number)
    this.daynamicPassInputBox().type(pass)
    this.cAndCButton().click()
    this.cAndTButton().click()

  }

  assertReceiptUI() {
    cy.get('@getTransaction');
    this.receiptCard({ timeout: 30000 })
      .should('be.visible')
      .and('contain.text', 'عملیات موفق')
      .and('contain.text', 'انتقال کارت به کارت');
  }

  assertCardToCardResponseAPI() {
    cy.get('@getTransaction').then((interception) => {
      const result = interception.response.body.result;
      expect(result.status.code).to.eq(200);
      expect(result.data.status).to.eq('COMPLETED');
      expect(result.data.title).to.eq('انتقال کارت به کارت');
    })

  }


  // دریافت خطای انتقال به یک کارت بیش از 3 بار در روز 
moreThan3(amount, description,cvv2Number,pass){
  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');
  cy.intercept('GET', '**/services/account/**/transaction/**?type=PAYMENT').as('getTransaction');
  
    // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
    this.cardToCardButton().scrollIntoView().click({ force: true });
    this.originCardInput().click({ force: true });
  
    cy.wait('@getOriginCards', { timeout: 10000 });
    cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
    this.selectOrigin().click({ force: true });
  
    // مرحله ۲: باز کردن لیست مقصد
    this.destenationInput().should('be.visible').click({ force: true });
  
    // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
    cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');
  
    // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
    cy.wait(5000)
    cy.get('#destinationCard-list')
    .find('p.MuiTypography-root')
    .first()
    .click({ force: true });
    this.amountInput().type(amount)
    this.descriptionInput().type(description)
    this.countinueButton().click()
    this.cvv2InputBox().type(cvv2Number)
    this.daynamicPassInputBox().type(pass)
    this.cAndCButton().click()
    this.cAndTButton().click()

  }

  assertMoreThan3UI() {
    this.moreThan3Toast({ timeout: 30000 })
            .should('be.visible')
            .and('contain.text', '4218 -  انتقال وجه انجام نشد. طبق قانون، امکان پرداخت به یک کارت بیش از 3 بار در روز وجود ندارد.')
  }

  // کارت به کارت موفق با وارد کردن کارت مقصد دستی
  successCardToCardWithDesCard(cardNumber,amount, description,cvv2Number,pass){
    cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');
    cy.intercept('GET', '**/services/account/**/transaction/**?type=PAYMENT').as('getTransaction');
    
      // مرحله ۱: ورود به صفحه کارت‌ به‌کارت و انتخاب کارت مبدأ
      this.cardToCardButton().scrollIntoView().click({ force: true });
      this.originCardInput().click({ force: true });
    
      cy.wait('@getOriginCards', { timeout: 10000 });
      cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
      this.selectOrigin().click({ force: true });
    // وارد کردن شماره مقصد دستی
      this.destenationInputBox().type(cardNumber)
      this.amountInput().type(amount)
      this.descriptionInput().type(description)
      this.countinueButton().click()
      this.cvv2InputBox().type(cvv2Number)
      this.daynamicPassInputBox().type(pass)
      this.cAndCButton().click()
      this.cAndTButton().click()
  
    }
  
    assertReceiptUI() {
      cy.get('@getTransaction');
      this.receiptCard({ timeout: 30000 })
        .should('be.visible')
        .and('contain.text', 'عملیات موفق')
        .and('contain.text', 'انتقال کارت به کارت');
    }
  
    assertCardToCardResponseAPI() {
      cy.get('@getTransaction').then((interception) => {
        const result = interception.response.body.result;
        expect(result.status.code).to.eq(200);
        expect(result.data.status).to.eq('COMPLETED');
        expect(result.data.title).to.eq('انتقال کارت به کارت');
      })
  
    }


    // کارت به کارت با رمز دوم نادرست
wrongPass(amount, description,cvv2Number,pass){
  cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');
  
    // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
    this.cardToCardButton().scrollIntoView().click({ force: true });
    this.originCardInput().click({ force: true });
  
    cy.wait('@getOriginCards', { timeout: 10000 });
    cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
    this.selectOrigin().click({ force: true });
  
    cy.wait(3000)
    // مرحله ۲: باز کردن لیست مقصد
    this.destenationInput().should('be.visible').click({ force: true });
  
    // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
    cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');
  
    // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
    cy.wait(5000)
    cy.get('#destinationCard-list')
    .find('p.MuiTypography-root')
    .first()
    .click({ force: true });
    this.amountInput().type(amount)
    this.descriptionInput().type(description)
    this.countinueButton().click()
    this.cvv2InputBox().type(cvv2Number)
    this.daynamicPassInputBox().type(pass)
    this.cAndCButton().click()
    this.cAndTButton().click()

  }

  asserWrongPassUI() {
    this.moreThan3Toast({ timeout: 30000 })
    .should('be.visible')
    .and('contain.text', '4281 - رمز اشتباه است.')
  }


  // انتخاب دکمه رمز دوم برای دو کارت متفاوت به صورت متوالی
twicePassButtonSelecte(amount,cvv2Number,Newcvv2Number){
   cy.intercept('GET', '**/services/payment/card/**/cards*').as('getOriginCards');
    cy.intercept('POST', '**/services/payment/card/**/otp').as('postOtp');
  
    // مرحله ۱: ورود به صفحه کارت‌به‌کارت و انتخاب کارت مبدأ
    this.cardToCardButton().scrollIntoView().click({ force: true });
    this.originCardInput().click({ force: true });
  
    cy.wait('@getOriginCards', { timeout: 10000 });
    cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');
    this.selectOrigin().click({ force: true });
  
    // مرحله ۲: باز کردن لیست مقصد
    this.destenationInput().should('be.visible').click({ force: true });
  
    // مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
    cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');
  
    // مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
    cy.wait(5000)
    cy.get('#destinationCard-list')
    .find('p.MuiTypography-root')
    .first()
    .click({ force: true });
    
    this.amountInput().type(amount)
    this.countinueButton().click()
    this.cvv2InputBox().type(cvv2Number)
    this.dynamicPassButton().click()
    cy.wait(5000)
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

    cy.wait(5000)
    this.backIcon().eq(1).click({ force: true });
    this.originCardInput().click({ force: true });
cy.get('#sourceCard-list', { timeout: 15000 }).should('have.css', 'visibility', 'visible');

// این‌بار انتخاب دومین کارت
this.selectSecondOrigin().click({ force: true });
// مرحله ۲: باز کردن لیست مقصد
this.destenationInput().should('be.visible').click({ force: true });
  
// مرحله ۳: اطمینان از اینکه لیست مقصد ظاهر شده
cy.get('#destinationCard-list', { timeout: 20000 }).should('be.visible');

// مرحله ۴: انتخاب اولین کارت مقصد بر اساس عنصر شماره کارت (تگ <p>)
cy.wait(5000)
cy.get('#destinationCard-list')
.find('p.MuiTypography-root')
.eq(1)
.click({ force: true });

this.countinueButton().click()
this.cvv2InputBox().type(Newcvv2Number)
this.dynamicPassButton().click()
cy.wait(5000)
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

}

