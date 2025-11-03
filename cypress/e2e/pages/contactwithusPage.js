export class ContactwithusPage {

    moreButton = () => cy.contains('button', 'بیشتر')
    faqLink = () => cy.contains('سوالات پرتکرار')
    submitComment = () => cy.contains('ثبت نظر')
    commentField = () => cy.get('textarea.MuiInputBase-input:visible')
    submitButton = () => cy.get('button').contains('ثبت نظر')
    toastMessage = () => cy.contains('حله! نظرتون ثبت شد.');  
    aboutUsLink  = () => cy.contains('درباره‌ی ما')
    inviteFriendsOption = () => cy.contains('دعوت از دوستان')
    ContactSupport = () => cy.contains('تماس با پشتیبانی')




    openFAQSection() {
        this.moreButton().click()
        this.faqLink().click()
    }

    openSubmitComment(){

        this.moreButton().click()
        this.submitComment().click();
        this.submitComment().should('be.visible')

    }


    openAboutUs() {
        this.moreButton().click();
        this.aboutUsLink().click();
        
      }

    assertAboutUs(){

        this.aboutUsLink().should('be.visible')
        cy.get('a[href="https://instagram.com/ewano.app"]').should('exist');
        cy.get('a[href="https://www.linkedin.com/company/ebcom-ir/"]').should('exist');
        cy.get('a[href="https://ewano.app"]').should('exist');

    }

    SubmitComment(text) {
        this.commentField().type(text);
        this.submitButton().click();
      }
    
      assertCommentSuccessToast() {
        this.toastMessage().should('be.visible');
      }

    assertOpenFAQ() {
        this.faqLink().should('be.visible')
    }

    checkAllAccordionItems() {
        cy.get('.MuiAccordionSummary-root').each(($accordion) => {
            cy.wrap($accordion).click();
            cy.wrap($accordion)
                .parents('.MuiAccordion-root')
                .find('.MuiAccordionDetails-root')
                .should('be.visible')
                .and('not.be.empty');
        });
    }


    clickInviteFriends() {


        this.moreButton().click()
        this.inviteFriendsOption().should('be.visible')
      }

      openContactSupport() {
        cy.get('[data-testid="support"]').click();
      }
      
      assertContactSupportOptions() {
        // چک کردن تیتر اصلی
        cy.contains('پشتیبانی').should('be.visible');
      
        // چک کردن گزینه تماس
        cy.contains('تماس با پشتیبانی').should('be.visible');
      
        // چک کردن گزینه ایمیل
        cy.contains('ایمیل به پشتیبانی').should('be.visible');
      }

      openContactSupport() {

        this.moreButton().click()
        this.ContactSupport().click();
      }
      
      
      
}
