
/// <reference types="cypress" />
import 'cypress-wait-until';

export class SecuritySettingPages {
    /* ---------- selectors ---------- */
    morePge = () => cy.contains('بیشتر');
    securitySetting = () => cy.contains ('تنظیمات امنیتی')
    getOtp = () => cy.contains('تایید و دریافت کد', { timeout: 10000 })
    timerText = () => cy.get('span.MuiTypography-root.MuiTypography-body.css-6ttbmy');
    timerText2 = () => cy.get('div:has(p:contains("تا ارسال مجدد")) span');
    resendButton = () => cy.contains('ارسال مجدد');
    otpInput = () => cy.get('#\\:rb\\:')
    confirmButton = () => cy.get('.jss245 > .MuiButtonBase-root')
    confirmButtonParent = () => cy.get('div.css-1yp3slg');
    securitySettingPage = () => cy.contains('مدیریت دستگاه‌ها');
    showToast = () => cy.get('.Toastify__toast-body')
  
    /* ---------- flows ---------- */
  
 //  نمایش صحیح شماره موبایل کاربر مطابق با شماره لاگین در باتم شیت احراز هویت و فعال بودن دکمه تایید و دریافت کد
    displayNumberInBottomsheet() {
        this.morePge().click();
        this.securitySetting().click()
      }

 // عملکرد صحیح شمارنده
      operationCounter() {
        this.morePge().click();
        this.securitySetting().click()
        this.getOtp().click()

      } 

  //     عملکرد دکمه ارسال مجدد
  resendButtonFunctionality() {
    this.morePge().click();
    this.securitySetting().click();
    this.getOtp().click();

    cy.wait(70000);
  
    // صبر کن تا دکمه ارسال مجدد تا 70 ثانیه ظاهر شود
    this.resendButton({ timeout: 70000 })
      .should('be.visible')
      .and('not.be.disabled')
      .click();
  }
   // وارد کردن کد احراز هویت نادرست
  wrongOtp(otp) {
    this.morePge().click();
    this.securitySetting().click();
    this.getOtp().click();
    this.otpInput().clear().type(otp)

  }




  
  
  
  // عملکرد صحیح دکمه تایید پس از وارد کردن کد احراز هویت صحیح
  correctOtpandConfirmButtonFunctionality(otp) {
    this.morePge().click();
    this.securitySetting().click();
    this.getOtp().click();
  
    this.otpInput().clear().type(otp);
    this.securitySettingPage().should('be.visible', { timeout: 10000 })  // زمان کافی برای انیمیشن

  }
  
      
    /* ---------- assertions ---------- */
  
   //  تایید نمایش صحیح شماره موبایل کاربر مطابق با شماره لاگین در باتم شیت احراز هویت و فعال بودن دکمه تایید و دریافت کد
    assertPhoneNumberInBottomsheet() {
      cy.get('@testPhoneNumber').then(phone => {
        const fullPhone = '0' + phone; // میشه 09125056114
        const expectedText = `برای انجام تغییر در تنظیمات، کد احراز‌هویت به شماره${fullPhone}ارسال می‌شه.`;
      // بررسی متن باتم شیت 
        cy.contains('برای انجام تغییر', { timeout: 10000 }) // اطمینان از صبر
          .invoke('text')
          .should('eq', expectedText);
      });

        // بررسی وجود دکمه و فعال بودنش
        this.getOtp()
    .should('be.visible')
    .and('not.be.disabled');
    }
  // تایید عملکرد صحیح شمارنده
    assertTimerIsCountingDown() {
      // مرحله ۱: خواندن مقدار اولیه تایمر
      let firstTime;
    
      this.timerText()
        .invoke('text')
        .then((text1) => {
          firstTime = text1.trim();
    
          // مرحله ۲: صبر و خواندن مقدار جدید
          cy.wait(2000); // ۲ ثانیه صبر کن
          this.timerText()
            .invoke('text')
            .then((text2) => {
              const secondTime = text2.trim();
    
              // تبدیل به ثانیه برای مقایسه
              const toSeconds = (str) => {
                const [min, sec] = str.split(':').map(Number);
                return min * 60 + sec;
              };
    
              expect(toSeconds(secondTime)).to.be.lessThan(toSeconds(firstTime));
            });
        });
    }
    // تایید عملکرد دکمه ارسال مجدد
    assertResendButtonAppearsAfterTimer() {
      this.timerText2()
        .should('be.visible')
        .invoke('text')
        .then((text) => {
          const cleaned = text.replace(/[^\d:]/g, ''); // فقط اعداد و ":" نگه می‌داریم
          const timeParts = cleaned.split(':');
    
          expect(timeParts.length).to.eq(2); // باید فرمت "دقیقه:ثانیه" داشته باشه
    
          const [min, sec] = timeParts.map(Number);
    
          expect(min).to.be.a('number');
          expect(sec).to.be.a('number');
        });
    }
 // تایید وارد کردن کد احراز هویت نادرست
    assertWrongOtpUI() {
      this.showToast({ timeout: 30000 })
              .should('be.visible')
              .and('contain.text', '1203 - خطا در برقراری ارتباط')
    }
    

    checkConfirmButtonEnablesOnFourthDigit(otp) {
      if (!otp || otp.length < 4) {
        throw new Error('OTP must be at least 4 digits');
      }
    
      this.morePge().click();
      this.securitySetting().click();
      this.getOtp().click();
    
      // این درخواست تایید otp رو مسدود میکنیم که صفحه جلو نره
      cy.intercept('POST', 'https://stage-ebcom.mci.ir/services/auth/v1.0/otp/verify*', (req) => {
        req.destroy();
      }).as('confirmOtp');
    
      cy.contains('button', 'تایید').should('exist').and('be.disabled');
    
      const digits = otp.split('');
    
      digits.forEach(digit => {
        this.otpInput().type(digit);
      });
    
      cy.wait(1000);
    
      cy.contains('button', 'تایید').should('be.visible').and('not.be.disabled');
    
      // اینجا کلیک نکن چون صفحه میره جلو
    
      // در صورت نیاز بعداً می تونی intercept رو غیرفعال کنی یا پاک کنی
    }
    
    
    
  }
