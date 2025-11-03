/// <reference types="cypress" />

/* ---------- selector ---------- */
export class chatbotPage {
charge = () => cy.contains('خرید شارژ', { timeout: 10000 });
cahtbotIcon = () => cy.get('img[alt="Ewano"]').eq(1)
servicesButton     = () => cy.get('.MuiBottomNavigation-root > :nth-child(2)', { timeout: 10000 })
shopButton = () => cy.contains('button.MuiBottomNavigationAction-root', 'فروشگاه')     
morePge = () => cy.contains('بیشتر');
Toast         =  () => cy.get('.toast-container') // مشاهده اسنک بار
          


  /* ---------- flows ---------- */
  // نمایش ایکون چت بات در صورت فعال بودن در کانفیگ در هدر صفحات خانه، خدمات، فروشگاه و بیشتر 
  showCahtBotIcon() {
    cy.wait(5000)
    this.charge().should('be.visible');

    this.cahtbotIcon().should('be.visible');
    this.servicesButton().click()
    cy.wait(500);
    this.cahtbotIcon().should('be.visible');
    cy.wait(500);
    this.shopButton().click();
    cy.wait(500);
    this.cahtbotIcon().should('be.visible');
    this.morePge().click();
    cy.wait(500);
    this.cahtbotIcon().should('be.visible');
  }

    // ورود به چت بات
    entryCahtBotPage() {
        this.charge().should('be.visible');
    
        this.cahtbotIcon().should('be.visible').click()
      }



     // مشاهده آیکون چت بات در صورت غیرفعال بود این سرویس و نمایش اسنک بار در صورت کلیک روی آیکون
    inactiveChatbot() {
        cy.wait(10000)
        this.charge().should('be.visible');
    
        this.cahtbotIcon().click({ force: true })
      }

  /* ---------- assertions ---------- */

  assertInactiveUI() {
    this.Toast({ timeout: 30000 })

      .should('be.visible')
      .and('contain.text', 'در حال حاضر،‌ این سرویس غیرفعال است.')
  }
  assertEntryUI() {
    cy.wait (5000)
    // بررسی تغییر URL بعد از کلیک
cy.url({ timeout: 15000 }).should('include', '/webview');
  }
}
