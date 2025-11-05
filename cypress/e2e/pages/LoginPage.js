/// <reference types="cypress" />

import { wait } from '../../support/testData';

export class LoginPage {
    gotIt = () => cy.contains('متوجه شدم', { timeout: 20000 });
    insertPhoneNumber = () => cy.get('input[type="tel"]').first();
    confirmation = () => cy.contains('تایید');
    insertOtp = () => cy.get('input[type="tel"]').first();
    homePage = () => cy.contains('خرید شارژ');
    loginButton = () => cy.contains('ورود به اوانو');
    invalidNumber = () => cy.contains('عجب! شماره همراهی که وارد کردید درست نیست!');
    clickEditPhoneNumberButton = () => cy.contains('button', 'اصلاح شماره تلفن');
    insetEditPhoneNumberText = () => cy.get('input[type="tel"][id="msisdnInput"]').first();
    insertEditPhoneNumberOtp = () => cy.get('input[type="tel"][id="msisdnInput"]').first();
    clickResendOTPButton = () => cy.contains('ارسال مجدد');
    verifyResendOTPMessage = () => cy.contains('تا ارسال مجدد');
    


    visit() {
        cy.visit('/login');
    }

    print(text) {
        cy.log(text);
    }

    AssertHomePage() {
        this.homePage().should('be.visible');
        this.print('لاگین موفق انجام شد');
    }

    successfulLogIn(phoneNumber, otp) {
        this.visit();
        wait();
        this.gotIt().click();
        wait();
        this.insertPhoneNumber().type(phoneNumber, { force: true });
        this.confirmation().click();
        wait();
        this.insertOtp().type(otp);
        
    }

    invalidPhoneNumberLogin(phoneNumber) {
        this.visit();
        wait();
        this.gotIt().click();
        wait();
        this.insertPhoneNumber().type(phoneNumber);
    }

    verifyInvalidPhoneNumberToast() {
        this.invalidNumber().should('be.visible');
        this.print('سناریو شماره اشتباه درست تست شد');
    }

    invalidOtpLogin(phoneNumber, otp) {
        this.visit();
        wait();
        this.gotIt().click();
        wait();
        this.insertPhoneNumber().type(phoneNumber);
        this.confirmation().click();
        wait();
        this.insertOtp().type(otp);
    }

    assertToastsVisible(expectedMessages = []) {
        cy.get('.toast-container').should('be.visible');
        expectedMessages.forEach((message) => {
            cy.get('.toast-container').should('contain.text', message);
        });
        this.print('سناریو otp اشتبه درست تست شد');
    }

    verifyLoginButtonDisabledWithoutOTP(phoneNumber) {
        this.visit();
        wait();
        this.gotIt().click();
        wait();
        this.insertPhoneNumber().type(phoneNumber);
        this.confirmation().click();
        wait();
        this.insertOtp().should('be.visible');
        this.insertOtp().should('have.value', '');
        this.loginButton().should('exist').and('be.disabled');
        this.print('با توجه به اینکه otp وارد نشده دکمه تایید غیر فعال است.');
    }

    EditPhoneNumber(phoneNumber , otp) {
        this.visit();
        wait();
        this.gotIt().click();
        wait();
        this.insertPhoneNumber().type(phoneNumber);
        this.confirmation().click();
        wait();
        this.clickEditPhoneNumberButton().click();
        wait();
        
        this.confirmation().click();
        wait();
        this.insertOtp().type(otp)
        this.print('بعد از زدن دکمه اصلاح مجدد باز هم بتوان لاگین کرد');
    }

    clickResendOTP(phoneNumber) {
        this.visit();
        wait();
        this.gotIt().click();
        wait();
        this.insertPhoneNumber().type(phoneNumber);
        this.confirmation().click();
        cy.wait(70000);
        this.clickResendOTPButton().click();
    }


    editPhoneNumberFlow(oldPhoneNumber, newPhoneNumber, otp) {
        this.visit();
        wait();
        this.gotIt().click();
        wait();
    
        // شماره اولیه
        this.insertPhoneNumber().type(oldPhoneNumber, { force: true });
        this.confirmation().click();
        wait();
    
        // اصلاح شماره تلفن
        this.clickEditPhoneNumberButton().click();
        wait();
    
        // وارد کردن شماره جدید و تایید
        this.insertPhoneNumber().clear().type(newPhoneNumber);
        this.confirmation().click();
        wait();
    
        // وارد کردن OTP شماره جدید
        this.insertOtp().type(otp);
    
        // assert ورود موفق
        this.homePage().should('be.visible');
        this.print('کاربر با شماره جدید با موفقیت وارد شد');
    }
    

    assertResendConfirmationVisible() {
        this.verifyResendOTPMessage().should('be.visible');
        this.print('دکمه ارسال مجدد موفق زده شد');
    }
}
