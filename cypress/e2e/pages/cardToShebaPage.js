/// <reference types="cypress" />




export class CardToShebaPage {

  services =() => cy.get('.MuiBottomNavigation-root > :nth-child(2)')
  cardInfo = () => cy.contains('اطلاعات کارت')
  viewCardInfoButton = () => cy.get('button:has(img[alt="button"])')
  getFirstCard = () => cy.contains('span', 'پارسیان')
  CloseIcon = () =>cy.get('[data-testid="CloseIcon"]')
  ConfirmInformation= () =>cy.contains('تایید اطلاعات');
  ContinueandPay =() => cy.contains('ادامه و پرداخت');
  ConfirmandContinue =() =>cy.contains('تایید و ادامه');
  wait = () => cy.wait(2000);
  cardInfoTitle = () => cy.contains('اطلاعات کارت');
  cardOwnerLabel = () => cy.contains('نام دارنده کارت');
  shebaLabel = () => cy.contains('شماره شبا');
  accountNumberLabel = () => cy.contains('شماره حساب');
  backToHomeButton = () => cy.contains('بازگشت به خانه');
  cardNumber = () => cy.get('input[type="text"][inputmode="numeric"]');
  toast = () => cy.get('div[role="alert"].Toastify__toast-body');
  fee =() => cy.contains('جهت اطلاع! این سرویس ۱۰۰۰۰ تومن کارمزد داره.')
  infoButton = ()  => cy.get('button img[src*="info"]').parent()
  ConvertCardtoShebaDescriptionTitleModal = ()=> cy.contains('توضیحات اطلاعات کارت')
  ConvertCardtoShebaDescriptionModal = () => cy.contains('چهار گام اطلاعات کارت')
  CardtoShebaeDescriptionButton = () => cy.contains('متوجه شدم')
  getSecondCard  = () =>cy.contains('span', 'ملی')


  ConvertCardtoShebafromMyCardList(){
    cy.intercept('GET' , '**/services/payment/card/v1.0/iban?id=*').as('getIban');
    this.wait()
    this.services().click();
    this.cardInfo().click();
    this.viewCardInfoButton().click();
    this.wait
    this.getSecondCard().click();
    this.wait();
    this.ConfirmInformation().click();
    this.ContinueandPay().click();
    this.wait();
    this.ConfirmandContinue().click();
  }


  ConvertCardtoSheba(){
    cy.intercept('GET', '**/services/payment/card/v1.0/iban?pan=*').as('getIban');
    this.wait()
    this.services().click();
    this.cardInfo().click();
    this.cardNumber().type('6037997269082096')
    this.wait();
    this.ConfirmInformation().click();
    this.ContinueandPay().click();
    this.wait();
    this.ConfirmandContinue().click();


  }

  invalidCardNumber(){
    this.services().click();
    this.cardInfo().click();
    this.cardNumber().type('53142514524')
    this.wait();
    this.ConfirmInformation().click();
    this.toast().should('contain.text', 'عجب شماره کارت اشتباه است');
  }

  
  serviceHasFee(){
    this.services().click();
    this.cardInfo().click();
    this.fee().should('be.visible');

  }

  infoCarPrice(){

    this.services().click();
    this.cardInfo().click();
    this.wait()
    this.infoButton().click()
    this.wait()


  }


  AssertCardInformationReceiptUI(){    
    this.cardInfoTitle().should('be.visible');
    this.cardOwnerLabel().should('be.visible');
    
    this.shebaLabel()
      .should('be.visible')
      .next()
      .invoke('text')
      .should('match', /^IR\d+/);

      this.accountNumberLabel()
      .should('be.visible')
      .next()
      .invoke('text')
      .should('match', /^\d+$/);

    this.backToHomeButton().should('be.visible');



  }
  AssertCardInformationReceiptAPI(){

    cy.wait('@getIban').then((interception) => {
      const res = interception.response;
      expect(res.statusCode).to.eq(200);

      const body = res.body;
      expect(body).to.have.property('result');
      expect(body.result).to.have.property('data');
      expect(body.result.status.code).to.eq(200);

      const data = body.result.data;
      expect(data).to.have.property('iban');
      expect(data.iban).to.match(/^IR\d{2}/);
      expect(data).to.have.property('fullName');
      expect(data).to.have.property('accountId');
      expect(data).to.have.property('ts');
      
    });
 
  }


  assertinfoConvertCardtoSheba(){
    this.ConvertCardtoShebaDescriptionTitleModal().should('be.visible')
    this.ConvertCardtoShebaDescriptionModal().should('be.visible')
    

  }
  assertConvertCardtoShebaDescriptionButton(){
    this.CardtoShebaeDescriptionButton().should('be.visible');
    this.CardtoShebaeDescriptionButton().click();
  }

  assertTwoInvalidCardsToast() {
    this.services().click();
    this.cardInfo().click();
    this.cardNumber().clear().type(6221061241930645);
    this.wait();
    this.ConfirmInformation().click();
  
  
    this.toast().should('contain.text', 'بانک مورد نظر پاسخگو نیست');
  
    // صبر برای پاک شدن Toast
    cy.wait(2000);
  
    // بار دوم
    this.cardNumber().clear().type(5041721084599696);
    this.ConfirmInformation().click();
    this.toast().should('contain.text', 'بانک مورد نظر پاسخگو نیست');
  }

  selectDeleteAndReSelectCard() {
    this.services().click();
    this.cardInfo().click();
    this.viewCardInfoButton().click();
    this.getFirstCard().click();
    this.CloseIcon().click();
    this.viewCardInfoButton().click();
    this.getFirstCard().click();
    this.cardNumber().should('have.value', '6221-06**-****-0645');


  }
  

  

    
  }
  

