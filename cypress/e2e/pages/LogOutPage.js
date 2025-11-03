/// <reference types="cypress" />

export class LogOutPage {

    more = () => cy.contains('button', 'بیشتر')
    profile = () => cy.get('div[style="cursor: pointer;"]')
    exit = () => cy.contains('button', 'خروج از حساب کاربری')
    confirmExit = () => cy.contains('button', 'بله، خارج می‌شم')


    logOut(){
     
        this.more().click()
        this.profile().click();
        this.exit().click();
        this.confirmExit().click();

     }

}