/// <reference types="cypress" />

import { DEFAULT_WAIT_TIME } from '../../support/testData';

export class CarPricePage  {
    services =() => cy.get('.MuiBottomNavigation-root > :nth-child(2)')
    carePrice = () => cy.contains('قیمت گذاری خودرو')
    wait = () => cy.wait(DEFAULT_WAIT_TIME);
    carPriceInquiryButton = () => cy.contains('استعلام قیمت خودرو')
    selectCarManufacturer =() => cy.contains('انتخاب سازنده')
    infoButton = () => cy.get('button[type="button"]').find('img[src*="info"]').parent('button')
    CarPriceDescriptionTitleModal = () => cy.contains('توضیحات قیمت گذاری خودرو')
    CarPriceDescriptionModal =() => cy.contains('چهار گام قیمت گذاری خودرو')
    CarPriceDescriptionButton =() => cy.contains('متوجه شدم')
    carPricTitle =() => cy.contains(' قیمت گذاری خودرو')
    print = (text) => cy.log(text);

    carPrice(){
      this.wait()
      this.services().click()
      this.carePrice().click()
      this.wait()
      this.carPriceInquiryButton().click()
      this.wait()
      this.selectCarManufacturer().click()
    }

    assertcarPrice(){
      this.carPricTitle().should('be.visible')
      this.print('تایتل صفحه درست می باشد')
    }

    infoCarPrice(){
      this.wait()
      this.services().click()
      this.carePrice().click()   
      this.wait()
      this.infoButton().click()
      this.wait()
    }

    assertinfoCarPrice(){
      this.CarPriceDescriptionTitleModal().should('be.visible')
      this.CarPriceDescriptionModal().should('be.visible')
    }

    assertCarPriceDescriptionButton(){
      this.CarPriceDescriptionButton().should('be.visible');
      this.CarPriceDescriptionButton().click();
    }
}
