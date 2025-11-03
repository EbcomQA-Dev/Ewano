/// <reference types="cypress" />

export class HomePage {

  WalletToWallet = () => cy.contains('کیف به کیف');
  more = () => cy.contains('button', 'بیشتر')
  home = () => cy.contains('خانه')
  service = () => cy.contains('خدمات')
  Store = () => cy.contains('فروشگاه')

 

  infoButton = () =>
    cy.get('.slick-slide.slick-active')
      .contains('اعتبار همراهی')
      .closest('.MuiCard-root')
      .find('button');

  findHamrahiCreditCard() {
    cy.get('.MuiCard-root').then(cards => {
      const cardsArr = [...cards];
      const index = cardsArr.findIndex(card => card.textContent.includes('اعتبار همراهی'));
      expect(index).to.be.gte(0);

      const container = cards[0].parentElement;

      function findCard() {
        const nextCards = cardsArr.slice(index + 1);
        return nextCards.find(card => card.textContent.includes('اعتبار همراهی'));
      }

      function scrollRight() {
        return new Cypress.Promise(resolve => {
          container.scrollBy({ left: 200, behavior: 'smooth' });
          setTimeout(resolve, 500);
        });
      }

      function scrollUntilFound(maxAttempts = 10) {
        return new Cypress.Promise(async (resolve, reject) => {
          let attempts = 0;
          let card = null;

          while (attempts < maxAttempts) {
            card = findCard();
            if (card) {
              return resolve(card);
            }
            await scrollRight();
            attempts++;
          }
          reject('کارت موجودی نقدی پیدا نشد بعد از چند بار اسکرول');
        });
      }

      return scrollUntilFound()
        .then(card => {
          cy.wrap(card).click({ force: true });
          cy.wait(500);
          // کلیک دوم برای بستن کارت
          cy.wrap(card).click({ force: true });
        });
    });
  }

  findCashCard() {
    cy.get('.MuiCard-root' , { timeout: 10000 }).then(cards => {
      const cardsArr = [...cards];
      const index = cardsArr.findIndex(card => card.textContent.includes('اعتبار همراهی'));
      expect(index).to.be.gte(0);

      const container = cards[0].parentElement;

      function findCard() {
        const nextCards = cardsArr.slice(index + 1);
        return nextCards.find(card => card.textContent.includes('موجودی نقدی'));
      }

      function scrollRight() {
        return new Cypress.Promise(resolve => {
          container.scrollBy({ left: 200, behavior: 'smooth' });
          setTimeout(resolve, 500);
        });
      }

      function scrollUntilFound(maxAttempts = 10) {
        return new Cypress.Promise(async (resolve, reject) => {
          let attempts = 0;
          let card = null;

          while (attempts < maxAttempts) {
            card = findCard();
            if (card) {
              return resolve(card);
            }
            await scrollRight();
            attempts++;
          }
          reject('کارت موجودی نقدی پیدا نشد بعد از چند بار اسکرول');
        });
      }

      return scrollUntilFound()
        .then(card => {
          cy.wrap(card).click({ force: true });
        });
    });
  }

  infoIcon() {
    this.infoButton().click({ force: true });
  }

  getCardContainer() {
    return cy.get('.MuiCard-root').first().parent();
  }

  getAllCards() {
    return cy.get('.MuiCard-root');
  }

  checkWalletCardOrder(expectedOrder, maxScroll = 10) {
    this.getCardContainer().then($container => {
      const container = $container[0];
      const foundTitles = [];

      function scrollAndCollect(attempt = 0) {
        if (attempt >= maxScroll || foundTitles.length >= expectedOrder.length) {
          expect(foundTitles).to.deep.equal(expectedOrder);
          return;
        }

        cy.get('.MuiCard-root').then(cards => {
          cards.each((_, el) => {
            const text = el.innerText.trim();
            const match = expectedOrder.find(title => text.includes(title));
            if (match && !foundTitles.includes(match)) {
              foundTitles.push(match);
            }
          });
        }).then(() => {
          container.scrollBy({ left: 300 });
          cy.wait(500);
        }).then(() => {
          scrollAndCollect(attempt + 1);
        });
      }

      scrollAndCollect();
    });
  }

  checkStatusAssert(status){

    if (status === 'AVAILABLE') {
      cy.get('.slick-slide').contains('در انتظار فعال‌سازی').should('exist');
    }
  
    if (status === 'PENDING') {
      cy.get('.slick-slide').contains('در انتظار نتیجه فعال‌سازی').should('exist');
    }
  
    if (status === 'AWAITING_CARD') {
      cy.get('.slick-slide').contains('در انتظار درخواست کارت').should('exist');
    }
  
    if (status === 'DUNNING') {
      cy.get('.slick-slide').contains('غیرفعال').should('exist');
    }
  
    if (status === 'INACTIVE') {
      cy.get('.slick-slide').contains('به زودی').should('exist');
    }
  
    if (status === 'ACTIVE') {
      cy.get('.slick-slide').contains('فعال').should('not.exist'); // چون hide شده
    }
  
    if (status === 'SUSPENDED') {
      cy.get('.slick-slide').contains('معلق').should('not.exist'); // چون hide شده
    }


  }

  assertOpen() {
    this.WalletToWallet().should('be.visible');
  }

  assertServiceIconsAndBottomMenuVisible(){

    this.home().should('be.visible')
    this.more().should('be.visible')
    this.service().should('be.visible')
    this.service().should('be.visible')
    


    
  }



  assertInfo() {
    cy.get('.MuiDialog-root')
      .should('be.visible')
      .within(() => {
        cy.contains('h2', 'توضیحات اعتبار همراهی').should('be.visible');
        cy.contains('متوجه شدم').should('be.visible');
      });
  }

}
