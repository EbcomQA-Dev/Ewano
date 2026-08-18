/// <reference types="cypress" />

import { PurchaseChargePage } from '../pages/purchaseChargePage'
import { LoginPage } from '../pages/LoginPage';
import { TEST_PHONE_NUMBER , TEST_OTP_NUMBER1, TEST_PHONE_NUMBER9 } from '../../support/testData';



describe('Purchase Charge - UI & API Test', () => {
  const chargePage = new PurchaseChargePage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)
  });

  it('should complete a successful MCI charge purchase and validate receipt + API response', () => {
    chargePage.completePurchaseMCI(TEST_PHONE_NUMBER9);
    chargePage.assertReceiptAndAPI('200000');
  
  });

  it('should display an error toast for custom amount above allowed maximum', () => {
    chargePage.PurchaseMCICustomAmountUpEdage(TEST_PHONE_NUMBER9);
    cy.wait(5000);
    const expectedMessages = 'نمیشه که! مبلغ بیشتر از صد هزار تومن نباید باشه.';
    chargePage.assertToastsVisible([expectedMessages]);
  });

  it('should display an error toast for custom amount below allowed minimum', () => {
    chargePage.PurchaseMCICustomAmountDownEdage(TEST_PHONE_NUMBER9);
    cy.wait(5000);
    const expectedMessages = 'نمیشه که! مبلغ کمتر از بیست هزار تومن نمیشه باشه.';
    chargePage.assertToastsVisible([expectedMessages]);
  });


  it('should complete a successful MCI custom amount charge purchase and validate receipt + API response', () => {
    chargePage.PurchaseMCICustomAmount(TEST_PHONE_NUMBER9)
    chargePage.assertReceiptAndAPI('250000');
   
  });

  // it('Successful MCI Supercharge Purchase', () => {
  //   chargePage.completeMciSuperchargePurchase(TEST_PHONE_NUMBER9)
  //   chargePage.assertReceiptAndAPI('200000');
   
  // });


 // it.only('should purchase charge successfully for a ported number now using MCI ', () => {
 //    chargePage.completePurchaseMCI('09391010015');
  //   chargePage.assertReceiptAndAPI('50000');
 //  });

  it.only('should complete a successful MTN charge purchase and validate receipt + API response', () => {

    chargePage.completePurchaseMTN('09362736746');
    chargePage.assertReceiptAndAPI('50000');
    

  })

  it('should complete a successful TALIYA charge purchase and validate receipt + API response', () => {
    chargePage.completePurchaseTaliya('09324938984');
    chargePage.assertReceiptAndAPI('10000');
  
  });


  it('should show error toast when trying to purchase charge for a postpade number', () => {
    
    chargePage.completePurchaseMCI(TEST_PHONE_NUMBER);
    chargePage.assertPhoneRestrictionToastVisible()
    
  });

 
  
  it('should return to home page when clicking "بازگشت به خانه" button after successful charge', () => {

    chargePage.completePurchaseMCI('09190727664');
    chargePage.assertReceiptAndAPI('200000');
    
  });


  it('Incorrect operator selection for charge purchase', () => {

    chargePage.completePurchaseMCI('09367892947');
    chargePage.assertToast();
    
    
  });

  it('Irancell Top-Up Purchase with a 400,000 Rial Limit', () => {

    chargePage.completePurchaseMTN('09362736746');
    const expectedMessages = '4138 -  متاسفانه مشکلی پیش امده است. اگر مبلغی از حساب شما کسر شده باشد به کیف پول شما بر‌می‌گردد. در صورت نیاز با پشتیبانی تماس بگیرید.';
chargePage.assertToastsVisible([expectedMessages]);

  });

  it("Entering an amount that is not a multiple of a thousand and displaying a toast message", () => {

    chargePage.nonThousandMultipleToast(TEST_PHONE_NUMBER9)
    const expectedMessages = 'نمیشه که! مبلغ کمتر از بیست هزار تومن نمیشه باشه.';
    chargePage.assertToastsVisible([expectedMessages]);

    
  });
  

});
