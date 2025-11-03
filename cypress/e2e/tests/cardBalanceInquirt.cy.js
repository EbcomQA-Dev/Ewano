/// <reference types="cypress" />
import { CardBalanceInquiry } from '../pages/cardBalanceInquiryPage.cy.js';
import { LoginPage } from '../pages/LoginPage';
import { TestData,TEST_PHONE_NUMBER7,TEST_CARDNUMBER,TEST_PHONE_NUMBER3,TEST_OTP_NUMBER1,TEST_OTP_NUMBER2 } from '../../support/testData';

describe('Card To Card Flow', () => {
  const cardBalanceInquiry = new CardBalanceInquiry();
   const loginPage = new LoginPage();
    const testData = new TestData();

    beforeEach(() => {
      loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
    cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
    });

  Cypress.on('uncaught:exception', (err) => {
    const is520 = err.message.includes('Request failed with status code 520');
    const isDeleteRule = err.message.includes("Cannot read properties of null (reading 'deleteRule')");
    if (is520 || isDeleteRule) return false;
    return true;
  });

//  انتخاب شماره کارت از لیست شماره ها و فعال شدن دکمه رمز پویا

  it('should select card and active dynamic pass button', () => {


    cardBalanceInquiry.CardSelect();

    //   پر بودن ورودی شماره کارت بعد از انتخاب و فعال شدن دکمه رمز پویا
    cardBalanceInquiry.assertcardInputUI();

    // دریافت ریسپانس موفق لیست کارت ها
    cardBalanceInquiry.assertCardInputAPIResponse();
  });


  // وارد کردن دستی شماره کارت 
  it('should enter card and active dynamic pass button', () => {


    cardBalanceInquiry.manuallyEnterCardNumber(TEST_CARDNUMBER);

    //   پر بودن ورودی شماره کارت بعد از انتخاب و فعال شدن دکمه رمز پویا
    cardBalanceInquiry.assertcardUI();

  });


  // تغییر تاریخ برای شماره کارت انتخاب شده
  it('should be possible to change the card expiration date.', () => {


    cardBalanceInquiry.CardExpChange('4104');

  //  پر بودن فیلد ورودی تاریخ انقضا بعد از تغییر تاریخ و فیلدهای رمز پویا و شماره کارت
    cardBalanceInquiry.assertDatePikerUI();

    // دریافت ریسپانس موفق لیست کارت ها
    cardBalanceInquiry.assertCardInputAPIResponse();
  });

//  وجود دکمه حذف روی تکست فیلدها

it('should be exit delet icon for text fields', () => {

// وارد کردن همه اطلاعات مورد نیاز برای ایجاد دکمه حذف برای هر فیلد
    cardBalanceInquiry.deleteIconForTextFields('123','12345');

    //   پر بودن ورودی شماره کارت بعد از انتخاب و فعال شدن دکمه رمز پویا
    cardBalanceInquiry.assertDeleteIcontUI();
  });  
 

 // چک کردن تایمر رمز پویا
it('should be timer continue correctly', () => {

    // استعلام موفق
      cardBalanceInquiry.timerCheck('4104');

  // اعتبار سنجی ui
     cardBalanceInquiry.assertTimerIsRunning();
    }); 

    // چک باکس ذخیره اطلاعات
it('should be checked', () => {

        // ورود به صفحه موجودی
          cardBalanceInquiry.saveInfoCheckBox();
    
      // اعتبار سنجی ui
         cardBalanceInquiry.assertCheckBoxUI();
        }); 

         //هلپر تکست وارد کردن شماره نامعتیر
it('should be display helper text', () => {

    // وارد کردن دستی شماره نامعتبر
      cardBalanceInquiry.manuallyEnterInvalidCardNumber(632545856255455);

  // اعتبار سنجی ui
     cardBalanceInquiry.assertInvalidCardNumberUI();
    }); 
});


describe('Card To Card Flow', () => {
  const cardBalanceInquiry = new CardBalanceInquiry();
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER3,TEST_OTP_NUMBER2);
  cy.wrap(TEST_PHONE_NUMBER3).as('testPhone')
  });

  Cypress.on('uncaught:exception', (err) => {
    const is520 = err.message.includes('Request failed with status code 520');
    const isDeleteRule = err.message.includes("Cannot read properties of null (reading 'deleteRule')");
    if (is520 || isDeleteRule) return false;
    return true;
  });

  // استعلام موفق موجودی کارت
//it('should success balanceInquiry', () => {

  //cardBalanceInquiry.successBalanceInquiry('674','0440034922');

  //cardBalanceInquiry.assertReceiptUI();

  //cardBalanceInquiry.assertBalancrInquiryAPIResponse();
   // }); 

      // وارد کردن رمز اشتباه
it('should unsuccess balanceInquiry', () => {

  cardBalanceInquiry.wrongPass('674','0440034920');

  cardBalanceInquiry.assertWrongPassUI();

    }); 

});