/// <reference types="cypress" />
import { CardToCard } from '../pages/cardToCardPages.js';
import { LoginPage} from '../pages/LoginPage'
import { TestData,TEST_PHONE_NUMBER7,TEST_CARDNUMBER,TEST_PHONE_NUMBER3,TEST_OTP_NUMBER1,TEST_OTP_NUMBER2} from '../../support/testData';

describe('Card To Card Flow', () => {
  const cardToCard = new CardToCard();
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

  // انتخاب شماره کارت مبدا و مقصد از لیست
it('should select origin and destenation card', () => {
    // انتخاب شماره کارت مبدا و مقصد از لیست
    cardToCard.cardToCardInput()

    // چک پر شدن فیلدها
    cardToCard.assertInputtUI()

    // اعتبار سنجی ریسپانس دریافت لیست کارتها
    cardToCard.assertcardToCardInputAPIResponse()

 })


 // وارد کردن شماره کارت مقصد به صورت دستی
 it('should insert destenation card', () => {
  // انتخاب شماره کارت مبدا و مقصد از لیست
  cardToCard.cardDestenation(TEST_CARDNUMBER)

  // اعتبار سنجی ریسپانس دریافت لیست کارتهای ورودی
  cardToCard.assertcardToCardInputAPIResponse()

  // پر شدن فیلد شماره کارت مقصد
  cardToCard.assertInputtUI()

})


//  وجود آیکون حذف برای تکست فیلدها در صفحه اول

it('should be exit delet icon for text fields in cardtocard page', () => {
  // انتخاب شماره کارت مبدا و مقصد از لیست
  cardToCard.deleteIconForTextFields('10000','test')

  // اعتبار سنجی ریسپانس دریافت لیست کارتهای ورودی
  cardToCard.assertDeleteIcontUI()

})


//  وجود آیکون حذف برای تکست فیلدها در صفحه دوم
it('should be exit delet icon for text fields in secondry cardtocard page', () => {
  // انتخاب شماره کارت مبدا و مقصد از لیست
  cardToCard.deleteIconForTextFieldsSecendryPage('10000','test','123','12345')

  // اعتبار سنجی ریسپانس دریافت لیست کارتهای ورودی
  cardToCard.assertDeleteIcontUI()

})


// انتقال با مبلغ کمتر از 10000 ریال
it('should be display toast for amount<10000', () => {
  // انتخاب شماره کارت مبدا و مقصد از لیست
  cardToCard.amountLessThan10000Rials('1000')

  // مشاهده اسنک بار 
  cardToCard.assertAmountLessThan10000RialsUI()

})


// انتقال با مبلغ بیش تر از 50000000 ریال
it('should be display toast for amount>50000000', () => {
  // انتخاب شماره کارت مبدا و مقصد از لیست
  cardToCard.amountMoreThan50000000Rials('60000000')

  // مشاهده اسنک بار 
  cardToCard.assertAmountMoreThan50000000RialsUI()

})


  // چک تایمر رمز دوم پس از برگشت به صفحه اول و سپس دوباره دوم کارت به کارت
it('should be timer continue correctly', () => {
  // انتخاب شماره کارت مبدا و مقصد از لیست
  cardToCard.timerCheckWithBackPages('10000','test')
  // مشاهده تایمر
  cardToCard.assertTimerIsRunning()

  // اعتبار سنجی ریسپانس سرویس رمز پویا
  cardToCard.assertpostOtpAPIResponse()
})


// ثبت درخواست رمز پویا پس از گذشت 2 دقیقه
it('should be timer correctly after 2 min', () => {
  // انتخاب شماره کارت مبدا و مقصد از لیست
  cardToCard.requestAgainForDynamicPassButton('10000','test')
  // مشاهده تایمر
  cardToCard.assertTimerIsRunning()

  // اعتبار سنجی ریسپانس سرویس دریافت رمز پویا
  cardToCard.assertpostOtpAPIResponse()
})


// نمایش هلپر تکست هنگام وارد کردن شماره کارت مقصد نامعتبر
it('should be helper text show', () => {
  // انتخاب شماره کارت مبدااز لیست و وارد کردن شماره مقصد دستی
  cardToCard.wrongDestenationCardFormat('5748-5621-0012-5415')
  // مشاهده هلپرتکست
  cardToCard.assertwrongDestenationCardFormatUI()

  // اعتبار سنجی ریسپانس سرویس دریافت لیست کارتها
  cardToCard.assertcardToCardInputAPIResponse()

   });

//بررسی رفتار دکمه تایید و ادامه در زمان وارد نکردن فیلدهای الزامی (نباید فعال شود)
    it('should be not active confirm and continue button', () => {
      // وارد کردن اطلاعات در صفحه اول کارت به کارت
      cardToCard.cAndCButtonNotActiveWithoutEnteringInfo('10000')
      // عدم فعال شدن دکمه تایید و ادامه
      cardToCard.assertcAndCButtonNotActiveUI()
    
      // اعتبار سنجی ریسپانس سرویس دریافت لیست کارتها
      cardToCard.assertcardToCardInputAPIResponse()
    
       }); 

// انتخاب دکمه رمز دوم برای دو کارت متفاوت به صورت متوالی

    it('Registering a dynamic password for two different origin cards in succession', () => {
        // وارد کردن اطلاعات در صفحه اول کارت به کارت
        cardToCard.twicePassButtonSelecte('10000','909','4104')
         }); 

       

describe('Card To Card Flow', () => {
  const cardBalanceInquiry = new CardToCard();
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

       //  کارت به کارت موفق
       it('should be success card To card', () => {
        // کارت به کارت موفق
        cardToCard.successCardToCard('10000','test','674','0440034922')
      
        // اعتبار سنجی رسید
        cardToCard.assertReceiptUI()
      
        // اعتبار سنجی سرویس
      
        cardToCard.assertCardToCardResponseAPI()
      
      })
   
       //   کارت به کارت موفق دو بار با یک کارت مبدا در روز

      it('should be success 2 card To card', () => {
        // کارت به کارت موفق
      cardToCard.successCardToCard('10000','test','674','0440034922')

        // کارت به کارت موفق برای بار دوم
      cardToCard.successCardToCard('10000','test','674','0440034922')
      
        // اعتبار سنجی رسید
      cardToCard.assertReceiptUI()
      
        // اعتبار سنجی سرویس
      
      cardToCard.assertCardToCardResponseAPI()
      
  })

             //   کارت به کارت موفق مقصد دستی
            it('should be success 2 card To card', () => {
              // کارت به کارت موفق
            cardToCard.successCardToCardWithDesCard(6362141120337689,'10000','test','674','0440034922')
            
              // اعتبار سنجی رسید
            cardToCard.assertReceiptUI()
            
              // اعتبار سنجی سرویس
            
            cardToCard.assertCardToCardResponseAPI()
      
            
     })

        })
      // مشاهده اسنک بار بیش از سه بار
it('should display toast', () => {

  // کارت به کارت
  cardToCard.moreThan3('10000','test','674','0440034922')

  // مشاهده اسنک بار
  cardToCard.assertMoreThan3UI()

})
// پسورد نادرست
it('should display toast when pass is wrong', () => {

  // کارت به کارت
  cardToCard.wrongPass('10000','test','674','123565')

  // مشاهده اسنک بار
  cardToCard.asserWrongPassUI()

})

});
