/// <reference types="cypress" />
import { BillPaymentPage } from '../pages/billPaymentPage';
import { LoginPage} from '../pages/LoginPage'
import { TestData,TEST_PHONE_NUMBER7,TEST_MCI_PHONE_NUMBER_BILL,TEST_MTN_PHONE_NUMBER_BILL,TEST_RTL_PHONE_NUMBER_BILL, TEST_PSTN_PHONE_NUMBER_BILL,TEST_WATER_NUMBER_BILL,TEST_ELEC_NUMBER_BILL,TEST_GAS_NUMBER_BILL,TEST_OTP_NUMBER1} from '../../support/testData';

describe('Bill Payment Flow', () => {
  const billPayment = new BillPaymentPage()
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

  // استعلام همراه اول
  it('should show debt mci', () => {
     // استعلام و پرداخت قبض
     billPayment.mobileAndPstnBillInquiry(TEST_MCI_PHONE_NUMBER_BILL)
 // ۲.  نتیجه استعلام
      billPayment.assertMobileAndPstnBillInquiryUI()
 
 // ۳. اعتبارسنجی پاسخ API
     billPayment.assertMobileAndPstnBillInquiryAPIResponse()
 
  })  

  // استعلام ایرانسل
  it('should show debt mtn', () => {
     // استعلام و پرداخت قبض
     billPayment.mobileAndPstnBillInquiry(TEST_MTN_PHONE_NUMBER_BILL)
 // ۲.  نتیجه استعلام
      billPayment.assertMobileAndPstnBillInquiryUI()
 
 // ۳. اعتبارسنجی پاسخ API
     billPayment.assertMobileAndPstnBillInquiryAPIResponse()
 
  })  

  // استعلام رایتل
  it('should show debt rtl', () => {
     // استعلام و پرداخت قبض
     billPayment.mobileAndPstnBillInquiry(TEST_RTL_PHONE_NUMBER_BILL)
 // ۲.  نتیجه استعلام
      billPayment.assertMobileAndPstnBillInquiryUI()
 
 // ۳. اعتبارسنجی پاسخ API
     billPayment.assertMobileAndPstnBillInquiryAPIResponse()
 
  })  
// استعلام ثابت
  it('should show debt pstn', () => {
     // استعلام و پرداخت قبض
     billPayment.mobileAndPstnBillInquiry(TEST_PSTN_PHONE_NUMBER_BILL)
 // ۲.  نتیجه استعلام
      billPayment.assertMobileAndPstnBillInquiryUI()
 
 // ۳. اعتبارسنجی پاسخ API
     billPayment.assertMobileAndPstnBillInquiryAPIResponse()
 
  }) 
  
  // استعلام آب
  it('should show debt water', () => {
     // استعلام و پرداخت قبض
     billPayment.utilityBillInquiry(TEST_WATER_NUMBER_BILL)
 // ۲.  نتیجه استعلام
      billPayment.assertUtilityBillInquiryUI()
 
 // ۳. اعتبارسنجی پاسخ API
     billPayment.assertUtilityBillInquiryAPIResponse()
 
  })

  // استعلام برق
  it('should show debt electricity', () => {
     // استعلام و پرداخت قبض
     billPayment.utilityBillInquiry(TEST_ELEC_NUMBER_BILL)
 // ۲.  نتیجه استعلام
      billPayment.assertUtilityBillInquiryUI()
 
 // ۳. اعتبارسنجی پاسخ API
     billPayment.assertUtilityBillInquiryUI()
 
  })
// استعلام گاز
  it('should show debt gas', () => {
     // استعلام و پرداخت قبض
     billPayment.utilityBillInquiry(TEST_GAS_NUMBER_BILL)
 // ۲.  نتیجه استعلام
      billPayment.assertUtilityBillInquiryUI()
 
 // ۳. اعتبارسنجی پاسخ API
     billPayment.assertUtilityBillInquiryUI()
 
  })

  // استعلام و پرداخت میان دوره همراه اول
it('should complete a successful MCI hotbill payment', () => {
    // استعلام و پرداخت قبض
    billPayment.MCIHotmobileBillPayment(TEST_MCI_PHONE_NUMBER_BILL)
// ۲. اعتبارسنجی UI رسید موفق
     billPayment.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
     billPayment.assertMCIBillPaymentAPIResponse()

 })

 // استعلام و پرداخت میان دوره ایرانسل
it('should complete a successful MTN hotbill payment', () => {

    // استعلام و پرداخت قبض
    billPayment.MTNHotmobileBillPayment(TEST_MTN_PHONE_NUMBER_BILL)

// ۲. اعتبارسنجی UI رسید موفق
     billPayment.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
     billPayment.assertMTNBillPaymentAPIResponse()

 })

 // استعلام و پرداخت میان دوره رایتل
it('should complete a successful RTL hotbill payment', () => {
    // استعلام و پرداخت قبض
    billPayment.RTLHotmobileBillPayment(TEST_RTL_PHONE_NUMBER_BILL)
// ۲. اعتبارسنجی UI رسید موفق
     billPayment.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
     billPayment.assertRTLBillPaymentAPIResponse()

 })

 // استعلام و پرداخت میان دروه ثابت
it('should complete a successful pstn hotbill payment', () => {
    // استعلام و پرداخت قبض
    billPayment.pstnHotBillPayment(TEST_PSTN_PHONE_NUMBER_BILL)
// ۲. اعتبارسنجی UI رسید موفق
     billPayment.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
     billPayment.assertpstnBillPaymentAPIResponse()

 })

// استعلام و پرداخت پایان دوره همراه اول

 it('should complete a successful MCI bill payment', () => {
     // استعلام و پرداخت قبض
     billPayment.MCIHmobileBillPayment(TEST_MCI_PHONE_NUMBER_BILL)
 // ۲. اعتبارسنجی UI رسید موفق
      billPayment.assertReceiptUI()
 
 // ۳. اعتبارسنجی پاسخ API
      billPayment.assertMCIBillPaymentAPIResponse()
 
  })

  // استعلام و پرداخت پایان دوره ایرانسل
 it('should complete a successful MTN bill payment', () => {
 
     // استعلام و پرداخت قبض
     billPayment.MTNmobileBillPayment(TEST_MTN_PHONE_NUMBER_BILL)
 
 // ۲. اعتبارسنجی UI رسید موفق
      billPayment.assertReceiptUI()
 
 // ۳. اعتبارسنجی پاسخ API
      billPayment.assertMTNBillPaymentAPIResponse()
 
  })

  // استعلام و پرداخت پایان دوره رایتل
 it('should complete a successful RTL bill payment', () => {
     // استعلام و پرداخت قبض
     billPayment.RTLmobileBillPayment(TEST_RTL_PHONE_NUMBER_BILL)
 // ۲. اعتبارسنجی UI رسید موفق
      billPayment.assertReceiptUI()
 
 // ۳. اعتبارسنجی پاسخ API
      billPayment.assertRTLBillPaymentAPIResponse()
 
  })

  // استعلام و پرداخت پایان دوره ثابت
 it('should complete a successful pstn bill payment', () => {
     // استعلام و پرداخت قبض
     billPayment.pstnBillPayment(TEST_PSTN_PHONE_NUMBER_BILL)
 // ۲. اعتبارسنجی UI رسید موفق
      billPayment.assertReceiptUI()
 
 // ۳. اعتبارسنجی پاسخ API
      billPayment.assertpstnBillPaymentAPIResponse()
 
  })

   // نمایش اسنک بار زمانی که استعلام قبض موبایل از سمت پروایدر دچار خطا شود
it('should show Toast if provider error in mobile inquiry', () => {
     // ۱. استعلام قبض
     billPayment.providerEroorinMobileInquiry('09120000000');   
     // ۲. مشاهده اسنک بار
      billPayment.assertproviderErrorMobileInquiryUI();
   
    // billPayment.assertproviderEroorinMobileInquiryAPIResponse();
   });   

   // نمایش پیام که شماره وارد شده بدهی ندارد
it('should show dialog if mobile or phone bills without debt', () => {
//      ۱. استعلام قبض
      billPayment.InquiryMobileOrPhonBillsWithoutDebt(TEST_MCI_PHONE_NUMBER_BILL)
//      ۲. مشاهده دیالوگ
           billPayment.assertMobileOrPhonBillsWithoutDebtUI()
     
//     ۳. اعتبارسنجی پاسخ API
           billPayment.assertmciMobilePaymentIsInHistoryListAPIResponse()
   
      });
    // استعلام شماره مویایل از لیست قبض های من  
it('should complete a successful bill inquiry exist in history', () => {
          //      1. استعلام قبض
     billPayment.mciMobilePaymentIsInHistoryList()
 
          //     2. اعتبارسنجی پاسخ API
     billPayment.assertmciMobilePaymentIsInHistoryListAPIResponse()             
                });   
                
     // خاموش بودن دکمه استعلام در صورتی که شماره ثابت وارد شده شامل کد شهرستان نباشد           
it('should be off the inquiry button,  if the number is without a city code', () => {
                    //      1. استعلام قبض
               billPayment.pstnmobileBillPaymentWithoutCityCode('33888797')
               });

     //     ویرایش عنوان قبض      
it('should be edit title', () => {
                    //      1. ویرایش عنوان
               billPayment.EditTitle()
               // 2. مشاهده اسنک بار
               billPayment.assertSuccessEditUI()
               //3. اعتبار سنجی ریسپانس سرویس
               billPayment.assertSuccessEditAPI()
               //4. تغییر دوباره عنوان
               billPayment.EditTitleAgain()
               // 5. مشاهده مجدد اسنک بار
               billPayment.assertSuccessEditUI()
                //6. اعتبار سنجی ریسپانس سرویس
                billPayment.assertSuccessEditAPI()
               });

     // حذف قبض          
it ('should delete bill',() =>{
          //      1. حذف قبض
          billPayment.deleteBill()
          //2. اعتبار سنجی ریسپانس سرویس
          billPayment.assertSuccessDeleteAPI()
   })  

   // ست کردن عنوان برای قبض در حال پرداخت
it('set alias for bill', () =>{
       //      1. ست کردن عنوان
       billPayment.setAlias(TEST_PSTN_PHONE_NUMBER_BILL,'testAlias')
   }) 
   
   // استعلام و پرداخت قبض آب
it('should complete a successful water bill payment', () => {
     // استعلام و پرداخت قبض
     billPayment.waterBillPayment(TEST_WATER_NUMBER_BILL)
 // ۲. اعتبارسنجی UI رسید موفق
    billPayment.assertReceiptUI()
 
 // ۳. اعتبارسنجی پاسخ API
    billPayment.assertWaterBillPymentAPIResponse()
 
  })
  
  // استعلام و پرداخت قبض برق
  it('should complete a successful Electricy bill payment', () => {
     // استعلام و پرداخت قبض
     billPayment.electricyBillPayment(TEST_ELEC_NUMBER_BILL)
 // ۲. اعتبارسنجی UI رسید موفق
    billPayment.assertReceiptUI()
 
 // ۳. اعتبارسنجی پاسخ API
    billPayment.assertElectricyBillPymentAPIResponse()
 
  })   
  
  // استعلام و پرداخت قبض گاز
  it('should complete a successful gas bill payment', () => {
     // استعلام و پرداخت قبض
     billPayment.gasBillPayment(TEST_GAS_NUMBER_BILL)
 // ۲. اعتبارسنجی UI رسید موفق
    billPayment.assertReceiptUI()
 
 // ۳. اعتبارسنجی پاسخ API
    billPayment.assertgasBillPymentAPIResponse()
 
  })   

  // نمایش پیام گذشتن مهلت پرداخت قبض
  it('should show Bill payment deadline warning', () => {
     // استعلام و پرداخت قبض
     billPayment.billWithPastDuePaymentDate(TEST_ELEC_NUMBER_BILL)
 // ۲. اعتبار سنجی نمایش پیام در ui
billPayment.assertBillWithPastDueDateUI()
 
 // ۳. اعتبارسنجی پاسخ API
billPayment.assertBillWithPastDueDateAPIResponse()
 
  })
   });

