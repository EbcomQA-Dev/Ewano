/// <reference types="cypress" />
import {welfareTransferPages} from '../pages/welfareTransferPages.js';
import { LoginPage } from '../pages/LoginPage';
import { TestData,TEST_PHONE_NUMBER7,TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,TEST_OTP_NUMBER1} from '../../support/testData';

describe('welfareTransfer Flow', () => {
  const welfareTransfer = new welfareTransferPages()
  const loginPage = new LoginPage();
    const testData = new TestData();

    beforeEach(() => {
      loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
    cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
    });

Cypress.on('uncaught:exception', (err) => {
     const is520 = err.message.includes('Request failed with status code 520');
     const isDeleteRule = err.message.includes("Cannot read properties of null (reading 'deleteRule')");
   
     if (is520 || isDeleteRule) {
       return false; // ✅ Prevent the test from failing
     }
   
     return true;
   });

   // انتقال موفق رفاهیات در صورت وجود موجودی
it('should success transfer ', () => {
     // 
    welfareTransfer.successWelfareTransfer(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10000','1234');   
   
   }) 

   // انتقال رفاهیات با وارد کردن کدملی نادرست
it('should show Toast for wrong national code', () => {

    welfareTransfer.wrongNationalCodeForWelfareTransfer(TEST_DESTNATION_NUMBER,'4431819691','10000');   

    welfareTransfer.assertAPIResponse();

    welfareTransfer.assertWrongNationalCodeUI();
   
   })

   // انتقال رفاهیات با وارد کردن شماره موبایل کاربر مبدا به عنوان مقصد
it('should show Toast for wrong destnation msisdn', () => {

    welfareTransfer.wrongDestnationMsisdnForWelfareTransfer(TEST_PHONE_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10000');   

    welfareTransfer.assertwrongDestnationMsisdnAPIResponse();

    welfareTransfer.assertWrongDestnationMsisdnUI();
   
   })

   // انتقال رفاهیات با وارد کردن شماره موبایل نامعتبر به عنوان مقصد
it('should show Toast for invalid destnation msisdn', () => {

    welfareTransfer.invalidDestnationMsisdnForWelfareTransfer('75432579008',TEST_DESTNATION_NATIONAL_CODE,'10000');   

    welfareTransfer.assertInvalidDestnationMsisdnAPIResponse();

    welfareTransfer.assertInvalidDestnationMsisdnUI();
   
   })

   // انتقال رفاهیات با وارد کردن مبلغ نامعتبر 
it('should show Toast for invalid amount', () => {

    welfareTransfer.invalidAmountForWelfareTransfer(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10');   

    welfareTransfer.assertInvalidAmountAPIResponse();

    welfareTransfer.assertInvalidAmountUI();
   
   })

   // انتقال رفاهیات با وارد کردن کدملی
it('should show Toast for invalid nationalCode', () => {

    welfareTransfer.invalidNationlCodeForWelfareTransfer(TEST_DESTNATION_NUMBER,'2223333333','10000');   

    welfareTransfer.assertInvalidNationlCodeAPIResponse();

    welfareTransfer.assertInvalidNationlCodetUI();
   
   })

   // انصراف از انتقال رفاهیات
it('should show destnation and nationalCode and amount', () => {

    welfareTransfer.quitOfWelfareTransfer(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10000');   

    welfareTransfer.quitOfWelfareTransferAPIResponse();

    welfareTransfer.quitOfWelfareTransferUI();
   
   })

   //بررسی info‌در صفحه انتقال رفاهیات
it('should show info box', () => {

    welfareTransfer.infoWelfareTransfer();   

    welfareTransfer.infoWelfareTransferAPIResponse();

    welfareTransfer.infoWelfareTransferUI();
   
   })

   //بررسی خاموش بودن دکمه ادامه در صورت وارد نکردن یکی از فیلدهای ورودی 
it('should desable Countinue Button', () => {

    welfareTransfer.desableCountinueButton(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE);   

    welfareTransfer.desableCountinueButtonUI();
   
   })

   // وارد کردن otp نادرست
it('should show Toast For Wrong OTP', () => {

    welfareTransfer.wrongOTP(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10000','1233');   

    welfareTransfer.wrongOTPUI();
   
   })

   //بررسی خاموش بودن دکمه تایید در صورت وارد نکردن کد احراز هویت 
it('should desable button', () => {

    welfareTransfer.desableotpConfirmButton(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10000');   

    welfareTransfer.desableotpConfirmButtonUI();
   
   })

   // درخواست  کد احراز هویت
it('should show otp button after 1 min', () => {

    welfareTransfer.otpButtonForWelfareTransfer(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10000');   

    welfareTransfer.otpButtonUI();
   
   })

   // کلیک بر روی دکمه بک در صفحه احراز هویت
it('should show wallet transfer page', () => {

    welfareTransfer.backButtonInAuthenticationPage(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10000');   
 
    welfareTransfer.backButtonUI();
   
   })

   // کلیک بر روی دکمه بک در صفحه انتقال رفاهیات
it('should show home page', () => {

    welfareTransfer.backButtonInWalletTransferPage(TEST_DESTNATION_NUMBER,TEST_DESTNATION_NATIONAL_CODE,'10000');   

    welfareTransfer.backButtonInWalletTransferUI();
   
   })

   //  مبلغ وارد شده بیش از موجودی کیف پول باشد
   it('should show insufficent balance snackbar', () => {

    welfareTransfer.insufficentBalanceInWelfareTransfer(TEST_DESTNATION_NUMBER, TEST_DESTNATION_NATIONAL_CODE, '1234');
  });

  //مبلغ رفاهی 0 باشد و دکمه انتقال رفاهیات نمایش داده نشود
  it('should dont display welfare transfer', () => {
    welfareTransfer.WelfareTransferWithZeroBalance();
  });
   });

