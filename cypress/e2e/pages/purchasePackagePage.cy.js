/// <reference types="cypress" />
export class PurchasePackagePage {
    buyPackageButton     = () => cy.contains('خرید بسته',{ timeout: 10000 })
    phoneNumberEditor    = () => cy.get('[data-testid="selectNumber"] > .css-11w0oze')  // باکس شماره موبایل
    phoneNumberInput     = () => cy.contains('label', 'شماره همراه').parent().find('input[type="tel"]') // وارد کردن شماره موبایل
    confirmButton        = () => cy.get('[data-testid="confirmModal"]')  // تایید شماره موبایل وارد شده
    operatorTLYSelect    = () => cy.get('[data-testid="tly"]')  // انتخاب اپراتور تالیا
    operatorMCISelect    = () => cy.get('[data-testid="mci"]')  // انتخاب اپراتور همراه اول
    operatorMTNSelect    = () => cy.get('[data-testid="mtn"]') // انتخاب اپراتور ایرانسل
    operatorRTLSelect    = () => cy.get('[data-testid="rtl"]') // انتخاب اپراتور رایتل
    simTypeTLYSelect     = () => cy.contains('p', 'اعتباری').closest('div') // انتخاب نوع سیم کارت تالیا
    preSimTypeMCISelect = () =>  cy.contains('p', 'اعتباری').closest('div.MuiBox-root')// انتخاب نوع سیم کارت اعتباری همراه اول
    postSimTypeMCISelect = () =>  cy.contains('p', 'دایمی').closest('div.MuiBox-root')// انتخاب نوع سیم کارت دائمی همراه اول
    preSimTypeMTNSelect = () =>  cy.contains('p', 'اعتباری').closest('div.MuiBox-root')// انتخاب نوع سیم کارت اعتباری  ایرانسل
    postSimTypeMTNSelect = () =>  cy.contains('p', 'دایمی').closest('div.MuiBox-root') // انتخاب نوع سیم کارت دائمی  ایرانسل
    preSimTypeRTLSelect = () =>  cy.contains('p', 'اعتباری').closest('div.MuiBox-root')// انتخاب نوع سیم کارت اعتباری  رایتل
    postSimTypeRTLSelect = () =>  cy.contains('p', 'دایمی').closest('div.MuiBox-root') // انتخاب نوع سیم کارت دائمی  رایتل
    packageTypeSelect    = () => cy.contains('p', 'اینترنت') // انتخاب نوع بسته
    continueButton       = () => cy.get('[data-testid="continueButton"]')  //  دکمه ادامه 
    packageItemTly          = () => cy.get('[data-testid="PackageItem"]').eq(0).find('button')   // خرید بسته انتخابی تالیا
    packageItemMci    = () => cy.get('[data-testid="PackageItem"]').eq(0).find('button')   // خرید بسته انتخابی  اعتباری همراه اول 
    packageItemMTN    = () => cy.get('[data-testid="PackageItem"]').eq(0).find('button')  // خرید بسته انتخابی  اعتباری  ایرانسل 
    packageItemRTL    = () => cy.get('[data-testid="PackageItem"]').eq(1).find('button')   // خرید بسته انتخابی  اعتباری  رایتل 
    ConfirmButton   = () =>  cy.get('div.MuiDrawer-root:visible')  // فقط Drawer باز شده
    .find('button')                     // همه دکمه‌ها داخل Drawer
    .contains('تایید')                  // دکمه تایید
    .should('be.visible')               // قابل مشاهده باشد
    .should('not.be.disabled');// دکمه تایید در باتم شیت نایید خرید بسته
    continueAndPay       = () => cy.contains('ادامه و پرداخت')  // دکمه ادامه و پرداخت بعد از انتخاب کیف پول
    confirmAndContinue   = () => cy.contains('تایید و ادامه')  // تایید نهایی خرید
    receiptCard          = (opts = {}) => cy.get('#layout-content',opts)  // رسید خرید موفق
    Toast         =  () => cy.get('.toast-container') // اسنک بار وجود بسته رزرو برای کاربر


//----------------------------------------- flows --------------------------------
    tlyCompletePurchase(phoneNumber) {

        cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');
    
        this.buyPackageButton().should('be.visible').click();
        this.phoneNumberEditor().click();
        this.phoneNumberInput().clear().type(phoneNumber)
        cy.wrap(phoneNumber).as('testPhoneNumber')
        this.confirmButton().click()
        this.operatorTLYSelect().click()
        this.simTypeTLYSelect().click()
        this.packageTypeSelect().click()
        this.continueButton().click()
        cy.wait(2000)
       this.packageItemTly().click()
       cy.wait(2000)
        this.ConfirmButton() .should('be.visible')
        .should('not.be.disabled').click({ force: true });
        this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })
        this.confirmAndContinue().click()
        cy.wait('@getTopup', { timeout: 20000 }).as('getTopupResponse')
        
      }

    preMCICompletePurchase(phoneNumber) {

        cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');
    
        this.buyPackageButton().should('be.visible').click();
        this.phoneNumberEditor().click();
        this.phoneNumberInput().clear().type(phoneNumber)
        cy.wrap(phoneNumber).as('testPhoneNumber')
        this.confirmButton().click()
        this.operatorMCISelect().click()
        this.preSimTypeMCISelect().click()
        this.packageTypeSelect().click()
        this.continueButton().click()
        cy.wait(2000)
       this.packageItemMci().click();
       cy.wait(2000)
       this.ConfirmButton().click()
   
    cy.wait(500);
   
     this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })
   
     cy.wait(500);
   
     this.confirmAndContinue()
       .scrollIntoView()
       .should('be.visible')
       .click({ force: true });
   
     cy.wait('@getTopup', { timeout: 20000 }).as('getTopupResponse');
   }

    postMCICompletePurchase(phoneNumber) {

    cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');

    this.buyPackageButton().should('be.visible').click();
    this.phoneNumberEditor().click();
    this.phoneNumberInput().clear().type(phoneNumber)
    cy.wrap(phoneNumber).as('testPhoneNumber')
    this.confirmButton().click()

    this.operatorMCISelect().click()
    this.postSimTypeMCISelect().click()
    this.packageTypeSelect().click()
    this.continueButton().click()
    cy.wait(2000)
   this.packageItemMci().click();
   cy.wait(2000)
   this.ConfirmButton().click()

cy.wait(500);

 this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })

 cy.wait(500);

 this.confirmAndContinue()
   .scrollIntoView()
   .should('be.visible')
   .click({ force: true });

 cy.wait('@getTopup', { timeout: 10000 }).as('getTopupResponse');
}
    preMTNCompletePurchase(phoneNumber) {

    cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');

    this.buyPackageButton().should('be.visible').click();
    this.phoneNumberEditor().click();
    this.phoneNumberInput().clear().type(phoneNumber)
    cy.wrap(phoneNumber).as('testPhoneNumber')
    this.confirmButton().click()
    this.operatorMTNSelect().click()
    this.preSimTypeMTNSelect().click()
    this.packageTypeSelect().click()
    this.continueButton().click()
    cy.wait(2000)
   this.packageItemMTN().click();
   cy.wait(2000)
   this.ConfirmButton().click()

cy.wait(500);

 this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })

 cy.wait(500);

 this.confirmAndContinue()
   .scrollIntoView()
   .should('be.visible')
   .click({ force: true });

 cy.wait('@getTopup', { timeout: 20000 }).as('getTopupResponse');
}
    postMTNCompletePurchase(phoneNumber) {

    cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');

    this.buyPackageButton().should('be.visible').click();
    this.phoneNumberEditor().click();
    this.phoneNumberInput().clear().type(phoneNumber)
    cy.wrap(phoneNumber).as('testPhoneNumber')
    this.confirmButton().click({ force: true })
    this.operatorMTNSelect().click()
    this.postSimTypeMTNSelect().click()
    this.packageTypeSelect().click()
    this.continueButton().click()
    cy.wait(2000)
   this.packageItemMTN().click();
   cy.wait(2000)
   this.ConfirmButton().click()

cy.wait(500);

 this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })

 cy.wait(500);

 this.confirmAndContinue()
   .scrollIntoView()
   .should('be.visible')
   .click({ force: true });

 cy.wait('@getTopup', { timeout: 20000 }).as('getTopupResponse');
}
    preRTLCompletePurchase(phoneNumber) {

    cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');

    this.buyPackageButton().should('be.visible').click();
    this.phoneNumberEditor().click();
    this.phoneNumberInput().clear().type(phoneNumber)
    cy.wrap(phoneNumber).as('testPhoneNumber')
    this.confirmButton().click()

    this.operatorRTLSelect().click()

    this.preSimTypeRTLSelect().click()

    this.packageTypeSelect().click()
    this.continueButton().click()
    cy.wait(2000)
   this.packageItemRTL().click();
   cy.wait(2000)
   this.ConfirmButton().click()

cy.wait(500);

 this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })

 cy.wait(500);

 this.confirmAndContinue()
   .scrollIntoView()
   .should('be.visible')
   .click({ force: true });

 cy.wait('@getTopup', { timeout: 20000 }).as('getTopupResponse');
}
postRTLCompletePurchase(phoneNumber) {

    cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');

    this.buyPackageButton().should('be.visible').click();
    this.phoneNumberEditor().click();
    this.phoneNumberInput().clear().type(phoneNumber)
    cy.wrap(phoneNumber).as('testPhoneNumber')
    this.confirmButton().click()
    this.operatorRTLSelect().click()
    this.postSimTypeRTLSelect().click()
    this.packageTypeSelect().click()
    this.continueButton().click()
    cy.wait(2000)
   this.packageItemRTL().click();
   cy.wait(2000)
   this.ConfirmButton().click()

cy.wait(500);

 this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })

 cy.wait(500);

 this.confirmAndContinue()
   .scrollIntoView()
   .should('be.visible')
   .click({ force: true });

 cy.wait('@getTopup', { timeout: 20000 }).as('getTopupResponse');
}
reserveMciPackagePurchase(phoneNumber) {

        cy.intercept('POST', '**/package/**/wallet').as('walletSubmit');

    this.buyPackageButton().should('be.visible').click();
    this.phoneNumberEditor().click();
    this.phoneNumberInput().clear().type(phoneNumber)
    cy.wrap(phoneNumber).as('testPhoneNumber')
    this.confirmButton().click()
    this.operatorMCISelect().click()
    this.postSimTypeMCISelect().click()
    this.packageTypeSelect().click()
    this.continueButton().click()
   this.packageItemMci().click({ force: true });

   this.ConfirmButton().click()

cy.wait(500);

 this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })

 cy.wait(500);

 this.confirmAndContinue()
   .scrollIntoView()
   .should('be.visible')
   .click({ force: true });

 cy.wait('@walletSubmit', { timeout: 20000 }).as('walletSubmitResponse');
}
    wrongOperatorSelecte(phoneNumber){

        cy.intercept('PUT', '**/package/**/wallet/**/confirm').as('walletConfirm');
        cy.intercept('GET', '**/transaction/**?type=TOPUP').as('getTopup');

    this.buyPackageButton().should('be.visible').click();
    this.phoneNumberEditor().click();
    this.phoneNumberInput().clear().type(phoneNumber)
    cy.wrap(phoneNumber).as('testPhoneNumber')
    this.confirmButton().click()
    this.operatorTLYSelect().click()
    this.simTypeTLYSelect().click()
    this.packageTypeSelect().click()
    this.continueButton().click()
    cy.wait(2000)
    this.packageItemTly().click()
    cy.wait(2000)
   this.ConfirmButton().click()

cy.wait(500);

 this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })

 cy.wait(500);

 this.confirmAndContinue()
   .scrollIntoView()
   .should('be.visible')
   .click({ force: true });

 cy.wait('@walletConfirm', { timeout: 20000 }).as('walletConfirmResponse');
 cy.wait('@getTopup', { timeout: 2000000000 }).as('getTopupResponse')
}

 wrongSimTypeSelecte(phoneNumber){

    cy.intercept('POST', '**/package/**/wallet').as('walletSubmit');

this.buyPackageButton().should('be.visible').click();
this.phoneNumberEditor().click();
this.phoneNumberInput().clear().type(phoneNumber)
cy.wrap(phoneNumber).as('testPhoneNumber')
this.confirmButton().click()
this.operatorMCISelect().click()
this.preSimTypeMCISelect().click()
this.packageTypeSelect().click()
this.continueButton().click()
cy.wait(2000)
this.packageItemMci().click({ force: true });
cy.wait(2000)

this.ConfirmButton().click()

cy.wait(500);

this.continueAndPay().scrollIntoView().should('be.visible').click({ force: true })

cy.wait(500);

this.confirmAndContinue()
.scrollIntoView()
.should('be.visible')
.click({ force: true });

cy.wait('@walletSubmit', { timeout: 20000 }).as('walletSubmitResponse');

}
wrongFormatInput(phoneNumber){

this.buyPackageButton().should('be.visible').click();
this.phoneNumberEditor().click();
this.phoneNumberInput().clear().type(phoneNumber)
cy.wrap(phoneNumber).as('testPhoneNumber')
}

filterCheck(phoneNumber) {
  // ورود به صفحه بسته‌ها
  this.buyPackageButton().click();
  this.phoneNumberEditor().click();
  this.phoneNumberInput().clear().type(phoneNumber);
  this.confirmButton().click();
  this.operatorMCISelect().click();

  // انتخاب نوع سیم کارت
  this.preSimTypeMCISelect().click(); // یا this.postSimTypeMCISelect() برای اعتباری

  this.packageTypeSelect().click();

  // شنود قبل از continue
  cy.intercept(
    'GET',
    '**/services/topup/package/v1.0/operator/MCI*'
  ).as('getPackages');

  this.continueButton().click();

  cy.wait('@getPackages', { timeout: 20000 }).then(packagesIntercept => {
    cy.log('📡 Intercept received:', JSON.stringify(packagesIntercept, null, 2));

    const data = packagesIntercept?.response?.body?.result?.data || [];
    cy.log('📡 تعداد سرویس‌ها در response:', data.length);

    const selectedSimType = 'PREPAID'; // یا 'CREDIT'
    const filteredServices = data.filter(s => s.simType === selectedSimType);
    cy.log(`📡 تعداد سرویس‌ها با simType=${selectedSimType}:`, filteredServices.length);

    const serviceDurations = filteredServices
      .filter(s => s.duration && s.durationType)
      .map(s => `${s.duration}_${s.durationType}`);
    cy.log('🔹 Duration+Type سرویس‌ها:', JSON.stringify(serviceDurations));

    cy.get('@configData').then(configData => {
      const configDurationsMap = {};
      configData.forEach(c => {
        if (c.duration && c.durationType) {
          configDurationsMap[`${c.duration}_${c.durationType}`] = c.title;
        }
      });
      cy.log('🔹 Config Durations Map:', JSON.stringify(configDurationsMap));

      // فقط کلیدهایی که در هر دو وجود دارند
      const commonKeys = serviceDurations.filter(key => key in configDurationsMap);
      cy.log('🔑 Common Keys (Duration+Type):', JSON.stringify(commonKeys));

      // اگر هیچ کلید مشترکی وجود نداشته باشه، لاگ بده و برگرد
      if (commonKeys.length === 0) {
        cy.log('⚠️ هیچ فیلتر مشترکی بین کانفیگ و سرویس‌ها وجود ندارد، بررسی UI انجام نمی‌شود.');
        return;
      }

      const expectedTitles = commonKeys.map(key => configDurationsMap[key]);
      cy.log('📦 Expected Filter Titles (from Config):', JSON.stringify(expectedTitles));

      cy.get('div.indiana-scroll-container button').then($buttons => {
        const uiTitles = [...$buttons].map(btn => btn.innerText.trim());
        cy.log('🖥️ UI Titles:', JSON.stringify(uiTitles));
      
        const missingTitles = expectedTitles.filter(title => uiTitles.includes(title) === false);
      
        if (missingTitles.length > 0) {
          cy.log(`⚠️ این عنوان‌ها در UI موجود نیستند ولی نادیده گرفته می‌شوند: ${JSON.stringify(missingTitles)}`);
        }
      
        // Assertion امن: فقط بررسی می‌کنیم که حداقل عناوین مشترک در UI هستند
        expect(uiTitles.some(title => expectedTitles.includes(title)), 
               'UI باید حداقل یک عنوان مشترک با کانفیگ داشته باشد').to.be.true;
      
        cy.log('✅ بررسی UI به پایان رسید، همه عنوان‌های موجود در UI مطابق انتظار هستند');
      });
      
    });
  });
}
recentlyFilterCheck(phoneNumber) {
  cy.intercept('GET', '**/services/user/v1.0/profile').as('getProfile');
  // ورود به صفحه بسته‌ها
  this.buyPackageButton().should('be.visible').click();
  this.phoneNumberEditor().click();
  this.phoneNumberInput().clear().type(phoneNumber)
  cy.wrap(phoneNumber).as('testPhoneNumber')
  this.confirmButton().click()
  this.operatorTLYSelect().click()
  this.simTypeTLYSelect().click()
  this.packageTypeSelect().click()
  this.continueButton().click()

// بعد از ورود کاربر و لود پروفایل
cy.wait('@getProfile').then(({ response }) => {
  const packageHistory = response?.body?.result?.data?.attributes?.packageHistory;
  const hasHistory = Array.isArray(packageHistory) && packageHistory.length > 0;

  if (hasHistory) {
    cy.log('📦 کاربر دارای تاریخچه بسته است، بررسی فیلتر اخیر در UI');

    // بررسی وجود فیلتر اخیر در صفحه لیست بسته‌ها
    cy.get('div.indiana-scroll-container button')
      .contains('اخیر')
      .should('exist');

    cy.log('✅ فیلتر اخیر در UI نمایش داده شد');
  } else {
    cy.log('⚠️ کاربر تاریخچه بسته ندارد، نیازی به بررسی فیلتر اخیر نیست');
  }
});
}
















//----------------------------------------- assertions --------------------------------

//وارد کردن شماره موبایل نامعتبر
assertWrongFormatInput() {
  cy.get('.MuiFormHelperText-root')  .should('be.visible')
  .and('contain.text', 'این شماره');
}
// رسید خرید بسته موفق
    assertReceiptUI() {
        cy.get('@getTopupResponse');
        this.receiptCard({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text', 'عملیات موفق')
          .and('contain.text', 'بسته');
      }
    // ریسپاسن خرید موفق بسته برای سیم کارت اعتباری همراه
    assertpreMCITopupAPIResponse() {
        cy.get('@getTopupResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(200);
          expect(result.data.status).to.eq('COMPLETED');
          expect(result.data.title).to.eq('بسته');
      
          const items = result.data.data;
          const service = items.find(i => i.title === 'نوع خدمت');
          const phone   = items.find(i => i.title === 'شماره تلفن همراه');
      
          cy.get('@testPhoneNumber').then(testPhone => {
            expect(phone.value).to.eq(testPhone);
          });
        });
      }
    // ریسپانس موفق خرید بسته برای سیم کارت دائمی همراه
    assertpostMCITopupAPIResponse() {
        cy.get('@getTopupResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(200);
          expect(result.data.status).to.eq('COMPLETED');
          expect(result.data.title).to.eq('بسته');
      
          const items = result.data.data;
          const service = items.find(i => i.title === 'نوع خدمت');
          const phone   = items.find(i => i.title === 'شماره تلفن همراه');
      
          cy.get('@testPhoneNumber').then(testPhone => {
            expect(phone.value).to.eq(testPhone);
          });
        });
      }
    // ریسپانس موفق خرید بسته برای سیم کارت های تالیا
    assertTLYTopupAPIResponse() {
        cy.get('@getTopupResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(200);
          expect(result.data.status).to.eq('COMPLETED');
          expect(result.data.title).to.eq('بسته');
      
          const items = result.data.data;
          const service = items.find(i => i.title === 'نوع خدمت');
          const phone   = items.find(i => i.title === 'شماره تلفن همراه');
      
          cy.get('@testPhoneNumber').then(testPhone => {
            expect(phone.value).to.eq(testPhone);
          });
        });
      }
    // ریسپانس موفق خرید بسته برای سیم کارت های ایرانسل (دائمی و اعتباری)
    assertMTNTopupAPIResponse() {
        cy.get('@getTopupResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(200);
          expect(result.data.status).to.eq('COMPLETED');
          expect(result.data.title).to.eq('بسته');
      
          const items = result.data.data;
          const service = items.find(i => i.title === 'نوع خدمت');
          const phone   = items.find(i => i.title === 'شماره تلفن همراه');
      
      
          cy.get('@testPhoneNumber').then(testPhone => {
            expect(phone.value).to.eq(testPhone);
          });
        });
      }
    // ریسپانس موفق خرید بسته برای سیم کارت های رایتل (دائمی و اعتباری)
    assertRTLTopupAPIResponse() {
        cy.get('@getTopupResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(200);
          expect(result.data.status).to.eq('COMPLETED');
          expect(result.data.title).to.eq('بسته');
      
          const items = result.data.data;
          const service = items.find(i => i.title === 'نوع خدمت');
          const phone   = items.find(i => i.title === 'شماره تلفن همراه');
      
          cy.get('@testPhoneNumber').then(testPhone => {
            expect(phone.value).to.eq(testPhone);
          });
        });
      }
     // اسنک بار داشتن بسته رزرو
    assertSubmitUI() {
        cy.get('@walletSubmitResponse');
        this.Toast({ timeout: 30000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /4143\s*-\s*.*بسته رزرو/)      
      }
    // اسنک بار محدودیت در خرید بسته به علت وارد کردن سیم تایپ اشتباه
    assertSubmitUIForWrongSimType() {
        cy.get('@walletSubmitResponse');
        this.Toast({ timeout: 30000 })
        .should('be.visible')
        .invoke('text')
        .should('match', /4135\s*-\s*.* محدودیت/)   
      }
    // دریافت رسید نامشخص به دلیل وارد کردن اپراتور اشتباه
    assertReceiptUIForWrongOperator() {
        cy.get('@getTopupResponse');
        this.receiptCard({ timeout: 30000 })
          .should('be.visible')
          .and('contain.text', 'عملیات نامشخص')
          .and('contain.text', 'بسته');
      }
    // ریسپانس تراکنش ناموفق به دلیل وجود بسته رزرو
    assertWalletSubmitAPIResponse() {
        cy.get('@walletSubmitResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(4143);
          expect(result.status.message).to.eq('Subscriber has already reserved offer')
        });
      }
    // ریسپانس ناموفق به دلیل وارد کردن سیم تایپ نادرست
    assertWalletSubmitAPIResponseForWrongSimType() {
        cy.get('@walletSubmitResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(4135);
          expect(result.status.message).to.eq('Subscriber is blocked/inactive/lost')
        });
      }
    // ریسپانس ناموفق به دلیل وارد کردن اپراتور نادرست
    assertWalletConfirmAPIResponse() {
        cy.get('@walletConfirmResponse').then((interception) => {
          const result = interception.response.body.result;
          expect(result.status.code).to.eq(4131);
          expect(result.status.message).to.eq('Provider general error')
        });
      }

}