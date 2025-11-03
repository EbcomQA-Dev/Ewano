/// <reference types="cypress" />

import { PurchaseChargePage } from '../pages/purchaseChargePage'
import { LoginPage } from '../pages/LoginPage';
import { TEST_PHONE_NUMBER , TEST_OTP_NUMBER1 } from '../../support/testData';



describe('Purchase Charge - UI & API Test', () => {
  const chargePage = new PurchaseChargePage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)
  });

  it('should complete a successful MCI charge purchase and validate receipt + API response', () => {
    chargePage.completePurchaseMCI('09190727664');
    chargePage.assertReceiptAndAPI('50000');
  
  });

  it('should display an error toast for custom amount above allowed maximum', () => {
    chargePage.PurchaseMCICustomAmountUpEdage('09190727664');
    cy.wait(5000);
    const expectedMessages = 'نمیشه که! مبلغ بیشتر از صد هزار تومن نباید باشه.';
    chargePage.assertToastsVisible([expectedMessages]);
  });

  it('should display an error toast for custom amount below allowed minimum', () => {
    chargePage.PurchaseMCICustomAmountDownEdage('09190727664');
    cy.wait(5000);
    const expectedMessages = 'نمیشه که! مبلغ کمتر از پنج هزار تومن نمیشه باشه.';
    chargePage.assertToastsVisible([expectedMessages]);
  });


  it('should complete a successful MCI custom amount charge purchase and validate receipt + API response', () => {
    chargePage.PurchaseMCICustomAmount('09190727664')
    chargePage.assertReceiptAndAPI('50000');
   
  });

  it('Successful MCI Supercharge Purchase', () => {
    chargePage.completeMciSuperchargePurchase('09190727664')
    chargePage.assertReceiptAndAPI('50000');
   
  });




 // it.only('should purchase charge successfully for a ported number now using MCI ', () => {
 //    chargePage.completePurchaseMCI('09391010015');
  //   chargePage.assertReceiptAndAPI('50000');
 //  });

  it('should complete a successful MTN charge purchase and validate receipt + API response', () => {

    chargePage.completePurchaseMTN('09367892947');
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



  it('should complete charge purchase successfully for Anarestan SIM cards', () => {
    chargePage.completePurchaseMCI('09945000002');
    chargePage.assertReceiptAndAPI('50000');
  });
  
  
  it('should return to home page when clicking "بازگشت به خانه" button after successful charge', () => {

    chargePage.completePurchaseMCI('09190727664');
    chargePage.assertReceiptAndAPI('50000');
    
  });


  it('Incorrect operator selection for charge purchase', () => {

    chargePage.completePurchaseMCI('09367892947');
    chargePage.assertToast();
    
    
  });

  it('Irancell Top-Up Purchase with a 400,000 Rial Limit', () => {

    chargePage.completePurchaseMTN('09362736746');
    const expectedMessages = '4142 -  شما بسته فعال دارید و فعال‌سازی بسته جدید امکان‌پذیر نیست. اگر مبلغی از حساب شما کسر شده باشد به کیف پول شما بر‌می‌گردد. در صورت نیاز با پشتیبانی تماس بگیرید.';
chargePage.assertToastsVisible([expectedMessages]);

  });

  it("Entering an amount that is not a multiple of a thousand and displaying a toast message", () => {

    chargePage.nonThousandMultipleToast('09190727664')
    const expectedMessages = 'نمیشه که! مبلغ باید ضریبی از هزار تومن باشه. ';
chargePage.assertToastsVisible([expectedMessages]);

    
  });
  

});
