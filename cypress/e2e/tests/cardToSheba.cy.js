/// <reference types="cypress" />

import { CardToShebaPage } from '../pages/cardToShebaPage'  
import { LoginPage } from '../pages/LoginPage';
import { TEST_PHONE_NUMBER , TEST_OTP_NUMBER1 } from '../../support/testData';

describe('CardToShebaPage - UI & API Test', () => {

  const cardToShebaPage = new CardToShebaPage(); 
  const loginPage = new LoginPage(); 

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)
  });

  it('Retrieve account information (IBAN, account number, full name) using a previously saved card from the user card list.' , ()=>{

    cardToShebaPage.ConvertCardtoShebafromMyCardList()
    cardToShebaPage.AssertCardInformationReceiptAPI()
    cardToShebaPage.AssertCardInformationReceiptUI()

  })
  
  it('Retrieve account information (IBAN, account number, full name) by manually entering the card number.' , ()=>{

    cardToShebaPage.ConvertCardtoSheba()
    cardToShebaPage.AssertCardInformationReceiptAPI()
    cardToShebaPage.AssertCardInformationReceiptUI()

  })

  it('Conversion of card number to account number and IBAN failed due to invalid card number.' , ()=>{

    cardToShebaPage.invalidCardNumber()

  })
  it('For your information! This service has fee' , ()=>{

    cardToShebaPage.serviceHasFee()

  })

  it('should verify that clicking the info button displays correct data' , ()=>{

    cardToShebaPage.infoCarPrice()
    cardToShebaPage.assertinfoConvertCardtoSheba()
    cardToShebaPage.assertConvertCardtoShebaDescriptionButton()

  })

  it('should show error toast for two invalid card numbers entered consecutively', () => {

    cardToShebaPage.assertTwoInvalidCardsToast();
    
  });

  it('should delete the first saved card and re-select it', () => {

    
    cardToShebaPage.selectDeleteAndReSelectCard()
   
  });
  
  
  

});
