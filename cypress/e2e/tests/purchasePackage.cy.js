/// <reference types="cypress" />
import { PurchasePackagePage } from '../pages/purchasePackagePage.cy.js'
import { LoginPage} from '../pages/LoginPage'
import { TestData,TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1,TEST_TLY_PHONE_NUMBER_PACKAGE,TEST_PER_MTN_PHONE_NUMBER_PACKAGE,TEST_POST_MTN_PHONE_NUMBER_PACKAGE,TEST_POST_RTL_PHONE_NUMBER_PACKAGE,TEST_PRE_RTL_PHONE_NUMBER_PACKAGE,TEST_PRE_MCI_PHONE_NUMBER_PACKAGE,TEST_POST_MCI_PHONE_NUMBER_PACKAGE} from '../../support/testData';

describe('Purchase Package Flow', () => {
  const packagePage = new PurchasePackagePage()
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
  cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
  });

it('should complete a successful TLY charge purchase', () => {
    // ۱. عملیات خرید و شنود API
  packagePage.tlyCompletePurchase(TEST_TLY_PHONE_NUMBER_PACKAGE)

// ۲. اعتبارسنجی UI رسید موفق
packagePage.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
packagePage.assertTLYTopupAPIResponse()
 })
 it('should display correct recently filter.', () => {

  packagePage.recentlyFilterCheck(TEST_TLY_PHONE_NUMBER_PACKAGE)

})
it('should complete a successful preMTN charge purchase', () => {
  // ۱. عملیات خرید و شنود API
packagePage.preMTNCompletePurchase(TEST_PER_MTN_PHONE_NUMBER_PACKAGE)

// ۲. اعتبارسنجی UI رسید موفق
packagePage.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
packagePage.assertMTNTopupAPIResponse()
})
it('should complete a successful postMTN charge purchase', () => {
  // ۱. عملیات خرید و شنود API
packagePage.postMTNCompletePurchase(TEST_POST_MTN_PHONE_NUMBER_PACKAGE)

// ۲. اعتبارسنجی UI رسید موفق
packagePage.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
packagePage.assertMTNTopupAPIResponse()
})
it('should complete a successful postRTL charge purchase', () => {
  // ۱. عملیات خرید و شنود API
packagePage.postRTLCompletePurchase(TEST_POST_RTL_PHONE_NUMBER_PACKAGE)

// ۲. اعتبارسنجی UI رسید موفق
packagePage.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
packagePage.assertRTLTopupAPIResponse()
})
it('should complete a successful preRTL charge purchase', () => {
  // ۱. عملیات خرید و شنود API
packagePage.preRTLCompletePurchase(TEST_PRE_RTL_PHONE_NUMBER_PACKAGE)

// ۲. اعتبارسنجی UI رسید موفق
packagePage.assertReceiptUI()

// ۳. اعتبارسنجی پاسخ API
packagePage.assertRTLTopupAPIResponse()
})
it('should complete a successful preMCI charge purchase', () => {
  // ۱. عملیات خرید و شنود API
  packagePage.preMCICompletePurchase(TEST_PRE_MCI_PHONE_NUMBER_PACKAGE)

  // ۲. اعتبارسنجی UI رسید موفق
 packagePage.assertReceiptUI()
  
  // ۳. اعتبارسنجی پاسخ API
  packagePage.assertpreMCITopupAPIResponse()

}) 
it('should complete a successful postMCI charge purchase', () => {
  // ۱. عملیات خرید و شنود API
  packagePage.postMCICompletePurchase(TEST_POST_MCI_PHONE_NUMBER_PACKAGE)

  // ۲. اعتبارسنجی UI رسید موفق
 packagePage.assertReceiptUI()
  
  // ۳. اعتبارسنجی پاسخ API
  packagePage.assertpostMCITopupAPIResponse()

}) 
it('should complete a unsuccessful preMCI charge purchase cuz reserve package', () => {
  // 1. عملیات خرید بسته و برگشت یک Promise از Cypress
  packagePage.reserveMciPackagePurchase(TEST_POST_MCI_PHONE_NUMBER_PACKAGE)

    // 2. مشاهده اسنک بار خطا
    packagePage.assertSubmitUI();

    // 3. اعتبارسنجی پاسخ API خطا
    packagePage.assertWalletSubmitAPIResponse();

});
it('should complete a unsuccessful MCI charge purchase cuz wrong operator', () => {
  // ۱. عملیات خرید و شنود API
  packagePage.wrongOperatorSelecte(TEST_POST_MCI_PHONE_NUMBER_PACKAGE)

  // ۲. مشاهده رسید نامشخص
  packagePage.assertReceiptUIForWrongOperator()
  
  // ۳. اعتبارسنجی پاسخ API
  packagePage.assertWalletConfirmAPIResponse()

}) 
it('should complete a unsuccessful MCI charge purchase cuz wrong simType', () => {
  // ۱. عملیات خرید و شنود API
  packagePage.wrongSimTypeSelecte(TEST_POST_MCI_PHONE_NUMBER_PACKAGE)

  // ۲. مشاهده اسنک بار محدودیت
  packagePage.assertSubmitUIForWrongSimType()
  
  // ۳. اعتبارسنجی پاسخ API
  packagePage.assertWalletSubmitAPIResponseForWrongSimType()

}) 
it('should display an hellper text due to entering a number in an invalid format.', () => {
  // ۱. عملیات خرید و شنود API
  packagePage.wrongFormatInput('2135253225')

  // ۲. مشاهده هلپر تکست
  packagePage.assertWrongFormatInput()
})
it('should display filters based on common config & service durations', () => {
  // 1️⃣ گرفتن کانفیگ
  cy.request('https://sandbox-ebcom.mci.ir/static/app/ewano/ewano-config.json')
    .then(configResponse => {
      const configItems = configResponse.body.result.data.configuration.coreServices.packages.filters;

      const configData = configItems.map(item => ({
        title: item.title.trim(),
        duration: item.duration,
        durationType: item.durationType
      }));

      cy.wrap(configData).as('configData');
    });

  // 2️⃣ اجرای سناریوی انتخاب شماره و اپراتور
  packagePage.filterCheck(TEST_PRE_MCI_PHONE_NUMBER_PACKAGE);
});

})