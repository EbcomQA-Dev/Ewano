/// <reference types="cypress" />

import { CarPricePage } from '../pages/carPricePage';
import { LoginPage } from '../pages/LoginPage';
import { TEST_PHONE_NUMBER , TEST_OTP_NUMBER1 } from '../../support/testData';

describe('CarPricePage - UI & API Test', () => {

  const carPricePage = new CarPricePage();
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)
  });

  it.skip('CarPricePage - UI & API Test' , ()=>{

    carPricePage.carPrice()
    carPricePage.assertcarPrice()

  })


  it('should verify that clicking the info button displays correct data', () => {
    carPricePage.infoCarPrice()
    carPricePage.assertinfoCarPrice()
    carPricePage.assertCarPriceDescriptionButton()
    
  });
  
  

});
