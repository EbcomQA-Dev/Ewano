/// <reference types="cypress" />

export class AccountInformationPage {
  morePge = () => cy.contains('بیشتر',{ timeout: 10000 });
  accountInformation = () => cy.contains('اطلاعات حساب کاربری');
  msisdnText = () => cy.get('h6.MuiTypography-subtitle2.css-1lvdkq6');
  firstNameInput = () => cy.contains('label', 'نام').parent().find('input');
  lastNameInput = () => cy.contains('label', 'نام خانوادگی').parent().find('input');
  emailInput = () => cy.contains('label', 'ایمیل').parent().find('input');
  saveInfo = ()  => cy.contains('ثبت اطلاعات')
  exitButton = () => cy.contains ('خروج از حساب کاربری')
  exitConfirm = () => cy.contains ('بله، خارج می‌شم')
  exitDenied = () => cy.contains ('نه! نمی‌شم')
  gotIt = () => cy.contains('متوجه شدم')
  showToast = () => cy.get('.Toastify__toast-body');



   /* ---------- flows ---------- */ 

  // نمایش اطلاعات حساب کاربری
  showAccountInformation() {
   
    cy.wait(1000);
    this.morePge().click();
    cy.wait(1000);
    this.accountInformation().click();

    cy.wait('@getProfile').its('response.statusCode').should('eq', 200);
    cy.wait(1000);

    this.firstNameInput().should('exist');
    this.lastNameInput().should('exist');
  }


// قابل ادیت بودن فیلدهای نام و نام خانوادگی برای کاربران غیر همراه اولی
  editableAccountInformation() {
    

    this.morePge().click();
    this.accountInformation().click();

    cy.wait('@getProfile', { timeout: 15000 });
    cy.wait(500);

    this.firstNameInput().should('exist');
    this.lastNameInput().should('exist');
  }


// وارد کردن نام با فرمت نامعتبر
    wrongFormatInputDataInAccountInformation(name) {
    
  
      this.morePge().click();
      this.accountInformation().click();
  
      cy.wait('@getProfile', { timeout: 15000 });
      cy.wait(500);
  
      this.firstNameInput().type(name);
    }


//  ثبت ایمیل غیر تکراری
saveEmailInAccountInformation(email) {


  this.morePge().click();
  this.accountInformation().click();

  cy.wait('@getProfile').its('response.statusCode').should('eq', 200);
  cy.wait(500);

  this.emailInput()
    .then($input => {
      const val = $input.val();
      if (!val || val.trim() === '') {
        // اگر خالی بود مستقیم تایپ کن
        cy.wait(5000)
        cy.wrap($input)
          .scrollIntoView()
          .should('be.visible')
          .clear({ force: true })
          .type(email, { force: true });
      } else {
        // اگر پر بود، روی دکمه ضربدر کلیک کن
        cy.wait(5000)
        this.emailInput().clear({ force: true }).type(email, { force: true });
      }
    });

  cy.wrap(email).as('testEmail');
  cy.wait(1000)

  this.saveInfo().should('not.be.disabled').click();

}

  //  خروج از حساب کاربری
  exitInAccount() {
 
    this.morePge().click();
    this.accountInformation().click();
    this.exitButton().click()
    cy.wait(5000)
    this.exitConfirm().click()
  
    cy.wait('@getProfile').its('response.statusCode').should('eq', 200);
    cy.wait(500);
  
  }

      //  انصراف از خروج از حساب کاربری
cancelExitInAccount() {

  this.morePge().click();
  this.accountInformation().click();
  this.exitButton().click()
  cy.wait(5000)
  this.exitDenied().click()

}

    /* ---------- assertions ---------- */

      // اعتبارسنجی نمایش شماره موبایل و پر بودن فیلدها
  assertShowInformationAccountUI() {
    cy.get('@testPhone').then((phone) => {
      const formatted = '0' + phone;
      this.msisdnText().should('be.visible').and('contain.text', formatted);
    });
  
    this.firstNameInput()
      .should('exist')
      .invoke('val')
      .should('not.be.empty')
      .and(($val) => {
        expect($val).to.be.a('string');
      });
  
    this.lastNameInput()
      .should('exist')
      .invoke('val')
      .should('not.be.empty')
      .and(($val) => {
        expect($val).to.be.a('string');
      });
  
    this.firstNameInput().should(($el) => {
      expect($el.prop('disabled') || $el.attr('readonly')).to.be.ok;
    });
  
    this.lastNameInput().should(($el) => {
      expect($el.prop('disabled') || $el.attr('readonly')).to.be.ok;
    });
  }
// اعتبار سنجی قابل ادیت بودن فیلدها
assertFieldsAreEditable() {
  this.firstNameInput()
    .should('exist')
    .and('be.visible')
    .and('not.be.disabled')
    .and('not.have.attr', 'readonly')

  this.lastNameInput()
    .should('exist')
    .and('be.visible')
    .and('not.be.disabled')
    .and('not.have.attr', 'readonly')
}  

// اعتبار سنجی نمایش فیلد ایمیل ذخیره‌شده
assertShowToastForSaveEmailUI() {
  this.showToast({ timeout: 30000 })
  .should('be.visible')
  .and('contain.text', 'حله!');
  }

    // اعتبار سنجی قابل ادیت بودن فیلدها
    assertHelperTextUI() {
      cy.get('.MuiFormHelperText-root').should('contain.text', 'مجاز به وارد کردن حروف فارسی');
    }


// اعتبار سنجی نمایش فیلد ایمیل ذخیره‌شده
assertExitAccountUI() {
    
      this.gotIt()
        .should('be.visible')
  
  
  }


// اعتبار سنجی نمایش فیلد ایمیل ذخیره‌شده
assertCancelExitAccountUI() {
    
      this.exitButton()
        .should('be.visible')
  
  
  }
}
  
