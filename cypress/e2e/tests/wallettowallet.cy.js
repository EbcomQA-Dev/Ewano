/// <reference types="cypress" />

import { wallettowalletPage } from '../pages/wallettowalletPage'
import { LoginPage } from '../pages/LoginPage';
import { TEST_PHONE_NUMBER , TEST_PHONE_NUMBER2 , TEST_OTP_NUMBER1} from '../../support/testData';


describe('wallet to wallet - UI & API Test', () => {
    const WallettowalletPage = new wallettowalletPage();
    const loginPage = new LoginPage();

    beforeEach(() => {
        loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)
        Cypress.on('uncaught:exception', () => false);
      });



      it('should complete a successful wallet to wallet for newe number', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.completeWalletToWallet('09125056114', '2669849288', '110000');
        WallettowalletPage.assertReceipt('09125056114' , '110000' , 'برداشت کیف به کیف');
 
      });

      it('should complete a successful wallet to wallet for existing number', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.completeWalletToWalletExistingNumber();
        WallettowalletPage.assertReceipt('09125056114' , '100000' , 'برداشت کیف به کیف');
 
      });

      it('should complete a successful wallet to wallet for back to home aseertion', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.completeWalletToWalletExistingNumber('110000');
        WallettowalletPage.assertBackTOHome()
 
      });

      it(' Mismatch between national ID and mobile number ', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.completeWalletToWallet('09125056114', '5100098295', '110000');
        const expectedMessages = '1093 - نشد! کدملی وارد شده درست نیست.';
        WallettowalletPage.assertMismatch([expectedMessages]);
        
      });

      it(' "Error received for amount below 10000 Tomans"', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.executeWalletToWallet('09125056114', '2669849288', '1');
        WallettowalletPage.assertBelow();
        
    });

    it('The senders and recipients national ID numbers are the same.', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.completeWalletToWallet('09195944597', '5100098295', '110000');
        const expectedMessages = '1095 - حیف شد! امکان انتقال به کیف پول مقصد وجود ندارد.';
        WallettowalletPage.assertMismatch([expectedMessages]);
        
      });



      it('Clear the field text', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.clearField('09125056114', '5100098295');
        WallettowalletPage.assertClear();
       
        
      });


      it('"Transfer to a number that does not have an Ewano wallet"', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.completeWalletToWallet('09308259184', '0570033128', '110000');
        const expectedMessages = '1070 - شماره وارد شده کیف اوانو ندارد';
        WallettowalletPage.assertMismatch([expectedMessages]);
       
        
      });

      it('Cancel Wallet-to-Wallet Payment', () => {
        WallettowalletPage.findCard()
        WallettowalletPage.cancelWalletToWallet('09125056114', '2669849288', '110000');
        WallettowalletPage.assertCancel();
         
      });


     
      it('Deduction of wallet balance after successful transfer ', () => {
       WallettowalletPage.findCard()
       WallettowalletPage.deductionWalletToWallet('09125056114', '2669849288', '110000');
       WallettowalletPage.aseertDeduction('110000');
 
      });


       it('Display error when the mobile number is incorrect' , () => {
        WallettowalletPage.findCard();
        WallettowalletPage.incorrecNumbertWalletToWallet('123456');
        WallettowalletPage.assertincorrectNumberWalletToWallet();
        
      });

      it('Display error when the national id is incorrect' , () => {
        WallettowalletPage.findCard();
        WallettowalletPage.incorrecNatonalIdtWalletToWallet('123456');
        WallettowalletPage.aseertIncorrecNatonalIdtWalletToWallet();
        
      });

      it.only('Display error for amount exceeding 200,000 Toman' , () => {
        WallettowalletPage.findCard();
        WallettowalletPage.completeWalletToWallet('09125056114', '2669849288', '5000000000');
        WallettowalletPage.aseertExceeding();
      });
           

})

describe('wallet to wallet - test with different user for amount greater than the wallet balance', () => {
    const WallettowalletPage = new wallettowalletPage();
    const loginPage = new LoginPage();

    before(() => {
        loginPage.successfulLogIn(TEST_PHONE_NUMBER2 , TEST_OTP_NUMBER1);
        Cypress.on('uncaught:exception', () => false);
    });
  
    it('"Transferring an amount greater than the wallet balance and receiving an error"' , () => {
      WallettowalletPage.findCard();
      WallettowalletPage.transferExceedingBalance('09125056114', '2669849288');
      const expectedMessages = '1007 - نشد! گویا موجودی کافی نیست.';
      WallettowalletPage.assertMismatch([expectedMessages]);
    });
  });