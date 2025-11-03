
/// <reference types="cypress" />


import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/LoginPage';
import { LogOutPage } from '../pages/LogOutPage';
import {ContactwithusPage } from '../pages/contactwithusPage';
import { TEST_PHONE_NUMBER , TEST_OTP_NUMBER1 } from '../../support/testData';

describe('Home balances - UI & API Test', () => {
  const homePage = new HomePage();
  const loginPage = new LoginPage();
  const logOutPage = new LogOutPage();
  const contactWithUsPage = new ContactwithusPage(); // ✅ کلاس باید با حرف بزرگ شروع شود

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)
  });

  it('should navigate to FAQ section successfully', () => {
    contactWithUsPage.openFAQSection();
    contactWithUsPage.assertOpenFAQ();
  });

  it('should expand and collapse all FAQ accordion items correctly', () => {


    contactWithUsPage.openFAQSection();
    contactWithUsPage.checkAllAccordionItems();


  })
  it('should navigate to submit comment section successfully', () => {

    contactWithUsPage.openSubmitComment();
  })

  it('should allow the user to enter and submit a comment', () => {

    contactWithUsPage.openSubmitComment();
    contactWithUsPage.SubmitComment('این یک نظر تستی است.');
    contactWithUsPage.assertCommentSuccessToast();
  })


  it('should navigate to About Us page and display content', () => {

    contactWithUsPage.openAboutUs()
    
  });

  it('should display the "Invite Friends" option in the More section', () => {
    
    contactWithUsPage.clickInviteFriends()
    

  });

  it('should display contact support options', () => {
    contactWithUsPage.openContactSupport();
    contactWithUsPage.assertContactSupportOptions();
  });
  
  

});
