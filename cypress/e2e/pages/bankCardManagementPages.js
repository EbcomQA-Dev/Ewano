/// <reference types="cypress" />

export class bankCardManagementPages {
  constructor() {
    this.lastAddedCardNumber = '';
    this.yearMap = {};
  }

  /* ---------- helpers ---------- */
  convertToPersianDigits(num) {
    if (typeof num === 'undefined' || num === null) return '';
    return num.toString().replace(/[0-9]/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  }

  hideOverlayElements() {
    // مخفی کردن احتمالی هدرها که روی آیتم‌ها پوشش می‌گذارند
    cy.get('h4.MuiTypography-root').then($els => {
      if ($els.length) {
        cy.wrap($els).invoke('css', 'display', 'none');
      }
    });

    // بستن مودال‌ها یا دیالوگ‌های احتمالی
    cy.get('.MuiDialog-container .MuiButtonBase-root')
      .then($btns => {
        if ($btns.length) {
          cy.wrap($btns.first()).click({ force: true });
        }
      });
  }

 // مقدار سال فعلی که در ستون سال روی اسلاید مرکزی (slick-current) است
 getCurrentYearValue() {
  return cy
    .get('.thirdSliderContainer .slick-slide.slick-current button', { timeout: 10000 })
    .should('be.visible')
    .invoke('text')
    .then(t => parseInt(t.trim(), 10));
}

// مقدار ماه فعلی که در ستون ماه روی اسلاید مرکزی (slick-current) است
getCurrentMonthValue() {
  return cy
    .get('.secondSliderContainer .slick-slide.slick-current button', { timeout: 10000 })
    .should('be.visible')
    .invoke('attr', 'id')
    .then(id => parseInt(id, 10));
}

// اسکرول ستون Slick تا وقتی "متن دقیق" موردنظر قابل‌مشاهده شود، سپس کلیک
scrollSlickUntilVisibleByText(containerSel, exactText, direction = 'next', maxSteps = 24) {
  const arrowSel = direction === 'next' ? '.slick-next' : '.slick-prev';

  const tryStep = (step = 0) => {
    return cy.get(containerSel, { timeout: 10000 }).then($c => {
      const $match = $c
        .find('button:visible')
        .filter((i, el) => el.innerText.trim() === String(exactText).trim());

      if ($match.length) {
        cy.wrap($match.first()).click({ force: true });
        return;
      }

      if (step >= maxSteps) {
        throw new Error(
          `آیتم با متن "${exactText}" پس از ${maxSteps} مرحله در ${containerSel} پیدا نشد.`
        );
      }

      cy.wrap($c).find(arrowSel).click({ force: true });
      cy.wait(80);
      return tryStep(step + 1);
    });
  };

  return tryStep();
}

// اسکرول ستون Slick تا وقتی button با id موردنظر قابل‌مشاهده شود، سپس کلیک
scrollSlickUntilVisibleById(containerSel, id, direction = 'next', maxSteps = 24) {
  const arrowSel = direction === 'next' ? '.slick-next' : '.slick-prev';

  const tryStep = (step = 0) => {
    return cy.get(containerSel, { timeout: 10000 }).then($c => {
      const $match = $c.find(`button#${id}:visible`);

      if ($match.length) {
        cy.wrap($match.first()).click({ force: true });
        return;
      }

      if (step >= maxSteps) {
        throw new Error(
          `دکمه با id="${id}" پس از ${maxSteps} مرحله در ${containerSel} قابل مشاهده نشد.`
        );
      }

      cy.wrap($c).find(arrowSel).click({ force: true });
      cy.wait(80);
      return tryStep(step + 1);
    });
  };

  return tryStep();
}

// دکمه تایید (فقط اولین مورد visible)
confirmExpDate() {
  return cy.contains(/^تایید$/, { timeout: 10000 }).filter(':visible').first();
}


  formatCardNumberToUI(cardNumber) {
    // فرض: کارت 16 رقمی مثل '6362141120337689'
    return `${cardNumber.slice(0, 4)} - ${cardNumber.slice(4, 8)} - ${cardNumber.slice(8, 12)} - ${cardNumber.slice(12, 16)}`;
  }

  selectYear(targetYear) {
    const target = parseInt(targetYear, 10);
  
    return this.getCurrentYearValue().then(currentYear => {
      const direction = target >= currentYear ? 'next' : 'prev';
      return this.scrollSlickUntilVisibleByText('.thirdSliderContainer', String(target), direction, 30)
        .then(() => {
          cy.get('.thirdSliderContainer .slick-slide.slick-current button')
            .invoke('text')
            .then(text => {
              let current = parseInt(text.trim(), 10);
  
              if (current !== target) {
                const diff = target - current; // تفاوت را درست حساب می‌کنیم
                const clickArrow = diff > 0
                  ? '.thirdSliderContainer .slick-next'
                  : '.thirdSliderContainer .slick-prev';
  
                cy.wrap([...Array(Math.abs(diff))]).each(() => {
                  cy.get(clickArrow).click({ force: true });
                  cy.wait(100);
                });
              }
            });
        });
    });
  }
  
  selectMonth(targetMonth) {
    const m = parseInt(targetMonth, 10);
  
    return this.getCurrentMonthValue().then(currentMonth => {
      const direction = m >= currentMonth ? 'next' : 'prev';
      return this.scrollSlickUntilVisibleById('.secondSliderContainer', String(m), direction, 30)
        .then(() => {
          cy.get('.secondSliderContainer .slick-slide.slick-current button')
            .invoke('attr', 'id')
            .then(id => {
              let current = parseInt(id, 10);
  
              if (current !== m) {
                const diff = m - current; // تفاوت را درست حساب می‌کنیم
                const clickArrow = diff > 0
                  ? '.secondSliderContainer .slick-next'
                  : '.secondSliderContainer .slick-prev';
  
                cy.wrap([...Array(Math.abs(diff))]).each(() => {
                  cy.get(clickArrow).click({ force: true });
                  cy.wait(100);
                });
              }
            });
        });
    });
  }
  
  

  
  
  
  
  /* ---------- selectors ---------- */
  morePge = () => cy.contains('بیشتر', { timeout: 30000 });
  bankCardManagement = () => cy.contains('مدیریت کارت بانکی');
  verifiedCards = () => cy.contains('کارت‌های احراز شده');
  myCards = () => cy.contains('کارت های من');
  otherCards = () => cy.contains('کارت های دیگران');
  firstVerifiedCards = () =>  cy.get('div.MuiBox-root:has(span.MuiTypography-bodySelected)').first();
  secondVerifiedCard = () => 
    cy.get('#header-tabpanel-0 div.MuiBox-root')
      .filter((i, el) => el.querySelector('span.MuiTypography-bodySelected'))
      .eq(1);
  firstMyCards = () => cy.get('#header-tabpanel-1 > div > div').first();
  defaultIcon = () => cy.get('button img[src*="save"], img[src*="unSave"]').first();
  defaultSelectorMyCard = () => cy.contains('span', 'تاریخ انقضاء')      // span که متن تاریخ انقضاء دارد
  .first()                                // اولین کارت
  .parent()                               // div والد span تاریخ انقضاء
  .find('button img')                      // img داخل دکمه پیش‌فرض
  servicesPage = () => cy.contains('خدمات');
  backIcon = () => cy.get('[data-testid="ArrowForwardIosOutlinedIcon"]');
  homeButton = () => cy.contains('خانه');
  balanceInquiry = () => cy.contains('موجودی کارت');
  cardToCard = () => cy.contains('کارت به کارت');
  detailsSelector = () => cy.get('button img[src*="dots"]').parents('button').first();
  editBankCard = () => cy.contains('ویرایش کارت من');
  titleVerifiedCardInput = () => cy.get('input[type="text"][autocomplete="off"]').eq(2);
  titleMyCard = () => cy.get('input[type="text"]:visible').eq(2)
  cardNumberInputInOtherCards = () => cy.get('input[inputmode="numeric"]:visible').first()
  titleInputInOtherCards = () => cy.get('div.MuiFormControl-root input[inputmode="text"]')
  saveButton = () => cy.contains('ذخیره');
  addMyCard = () => cy.contains('افزودن کارت من');
  addOtherCards = () => cy.contains('افزودن کارت');
  confirmAddCardButton = () => cy.contains('ثبت کارت');
  cardInputMyCardInput = () => cy.get('input[type="text"][inputmode="numeric"].MuiInputBase-input');
  expInputMyCardInput = () => cy.get('input[readonly][type="text"].MuiInputBase-input').eq(0);
  titleMyCardInput = () => cy.get('input[type="text"][inputmode="text"].MuiInputBase-input');
  confirmExpDate = () => cy.contains('تایید');
  firstOtherCard = () => cy.get('div[role="tabpanel"]:visible')
  .find('div:has(img[alt="bank logo"])')
  .first()
deleteOtherCard = () => cy.get('div:visible')
.contains('حذف کارت')
.click();

deleteConfirmButton =() =>  cy.get('div[role="dialog"]:visible')
.contains('button', 'بله حذف بشه')


  showToast = () => cy.get('.Toastify__toast-body');

  /* ---------- flows ---------- */

  slectDefaultCardInVerifiedCards() {
    cy.intercept('PATCH', '**/services/payment/card/v1.0/**').as('patchDefaultCard');
    cy.intercept('GET', '**/services/payment/card/v1.0/cards?target=TRANSFER').as('getCardsForTransfer');

    this.morePge().click();
    this.bankCardManagement().click();
    this.verifiedCards().click();

    this.firstVerifiedCards().click();
    cy.wait(500);

    this.defaultIcon()
      .should('be.visible')
      .invoke('attr', 'src')
      .then(src => {
        const isSaved = src?.includes('save') && !src.includes('unSave');

        if (isSaved) {
          this.defaultIcon().click();
          cy.wait('@patchDefaultCard');

          this.defaultIcon().click();
          cy.wait('@patchDefaultCard');
        } else {
          this.defaultIcon().click();
          cy.wait('@patchDefaultCard');
        }

        this.defaultIcon()
          .invoke('attr', 'src')
          .should('include', 'save')
          .and('not.include', 'unSave');
      });

    this.backIcon().click();
    this.homeButton().click();
    this.cardToCard().click();
    cy.wait(500);
  }

  maskedDisplayCardsInVerifiedCards() {
    this.morePge().click();
    this.bankCardManagement().click();
    this.verifiedCards().click();

    cy.get('span.MuiTypography-bodySelected').should('have.length.at.least', 1).each($el => {
      const cardNumber = $el.text();
      expect(cardNumber).to.match(/^\d{4} - \d{2}\*\* - \*{4} - \d{4}$/);
    });
  }

  maskedDisplayCardsInMyCards() {
    this.morePge().click();
    this.bankCardManagement().click();
    this.myCards().click();

    cy.get('span.MuiTypography-bodySelected').should('have.length.at.least', 1).each($el => {
      const cardNumber = $el.text();
      expect(cardNumber).to.match(/^\d{4} - \d{2}\*\* - \*{4} - \d{4}$/);
    });
  }

  editCardInVerifiedCards(title) {
    this.morePge().click();
    this.bankCardManagement().click();
    this.verifiedCards().click();
    cy.wait(1000);
    this.detailsSelector().click();
    cy.wait(1000);
    this.editBankCard().click({ force: true });
    cy.wait(1000);
    this.titleVerifiedCardInput().clear().type(title);
    cy.wait(1000);
    this.saveButton().click();
  }
  addMyCardInMyCards(cardNumber, month, year) {
    this.morePge().click();
    this.bankCardManagement().click();
    this.myCards().click();
  
    this.addMyCard().click();
    this.cardInputMyCardInput().clear().type(cardNumber);
  
    // باز کردن دیت‌پیکر
    this.expInputMyCardInput().click();
    cy.get('.MuiDialog-container', { timeout: 10000 }).should('exist');
  
    // انتخاب سال و ماه
    this.selectYear(year)
        .then(() => this.selectMonth(month))
        .then(() => this.confirmExpDate().click({ force: true }));
  
    this.saveButton().click();
  
    cy.wait(100);
  }


  slectDefaultCardInMyCards() {
    cy.intercept('PATCH', '**/services/payment/card/v1.0/**').as('patchDefaultCard');
    cy.intercept('GET', '**/services/payment/card/v1.0/cards').as('getCardsForBalanceInquiry');

    this.morePge().click();
    this.bankCardManagement().click();
    this.myCards().click();
    this.firstMyCards().click();

    cy.wait(500);

    this.defaultSelectorMyCard()
      .should('be.visible')
      .invoke('attr', 'src')
      .then(src => {
        const isOn = src?.includes('save');

        if (isOn) {
          this.defaultSelectorMyCard().click();
          cy.wait(500);
          this.defaultSelectorMyCard().click();
          cy.wait(500);
          this.defaultSelectorMyCard()
            .invoke('attr', 'src')
            .should('include', 'save');
        } else {
          this.defaultSelectorMyCard().click();
          cy.wait('@patchDefaultCard');
          cy.wait(500);
          this.defaultSelectorMyCard()
            .invoke('attr', 'src')
            .should('include', 'save');
        }

        this.backIcon().click();
        this.servicesPage().click();
        this.balanceInquiry().click();
        cy.wait('@patchDefaultCard');
        cy.wait(500);
      });
  }

  editCardInMyCards(title) {
    this.morePge().click();
    this.bankCardManagement().click();
    this.myCards().click();
    cy.wait(1000);
    this.detailsSelector().click();
    cy.wait(1000);
    this.editBankCard().click({ force: true });
    cy.wait(1000);
    this.titleMyCard().clear().type(title);
    cy.wait(1000);
    this.saveButton().click();
  }

  addCardInOtherCards(cardNumber, title) {
    this.lastAddedCardNumber = cardNumber;
    cy.intercept('PUT', '**/services/user/v1.0/profile/attribute').as('updateProfileAttribute');

    this.morePge().click();
    this.bankCardManagement().click();
    this.otherCards().click();

    this.addOtherCards().click();
    this.cardNumberInputInOtherCards().clear().type(cardNumber);
    cy.wait(500);
    this.titleInputInOtherCards().clear().type(title);
    cy.wait(500);
    this.confirmAddCardButton().click();
    cy.wait('@updateProfileAttribute');
    cy.wait(500);
  }

  deleteCardInOtherCards() {
    cy.intercept('PUT', '**/services/user/v1.0/profile/attribute').as('updateProfileAttribute');
  
    this.morePge().click();
    this.bankCardManagement().click();
    this.otherCards().click();
  
    this.firstOtherCard().click();
    this.detailsSelector().click();
  
    // صبر تا دراور باز شود و دکمه حذف کارت visible شود
    cy.get('div:visible').contains('حذف کارت', { timeout: 10000 }).should('be.visible');
  
    // کلیک روی حذف کارت
    cy.get('div:visible').contains('حذف کارت').click({ force: true });
  
    // صبر تا مودال دیالوگ باز شود
    cy.get('div[role="dialog"]:visible', { timeout: 10000 }).should('exist');
  
    // کلیک روی دکمه بله حذف بشه در مودال
    cy.get('div[role="dialog"]:visible')
      .contains('button', 'بله حذف بشه', { timeout: 10000 })
      .should('be.visible')
      .click({ force: true });
  
    // انتظار برای پاسخ API
    cy.wait('@updateProfileAttribute');
    cy.wait(500);
  }
  

  /* ---------- assertions ---------- */

  assertDefaultCardIsSelected() {
    this.defaultIcon()
      .should('be.visible')
      .and('not.be.disabled');
  }

  assertAPIResponse() {
    cy.get('@patchDefaultCard').then(interception => {
      const result = interception.response.body.result;
      expect(result.status.code).to.eq(200);
    });
  }

  assertGetCardsAPIHasStarred() {
    cy.get('@getCardsForTransfer').then(interception => {
      const result = interception.response.body.result;

      expect(result.status.code).to.eq(200);

      const cards = result.data;
      const hasStarredCard = cards.some(card => card.starred === true);

      expect(hasStarredCard).to.be.true;
    });
  }

  assertGetCardsAPIHasStarredForBalanceInquiry() {
    cy.get('@getCardsForBalanceInquiry').then(interception => {
      const result = interception.response.body.result;

      expect(result.status.code).to.eq(200);

      const cards = result.data;
      const hasStarredCard = cards.some(card => card.starred === true);

      expect(hasStarredCard).to.be.true;
    });
  }


  editTitleUI() {
    this.showToast()
      .should('be.visible')
      .and('contain.text', 'حله! اطلاعات کارت ذخیره شد.');
  }

  addotherCardUI() {
    this.showToast()
      .should('be.visible')
      .and('contain.text', 'حله! اطلاعات کارت ثبت شد.');

// بررسی اینکه کارت اضافه شده با فرمت درست در لیست دیده شود
    const formattedCardNumber = this.formatCardNumberToUI(this.lastAddedCardNumber);

    // بررسی در تب کارت‌های دیگران
    cy.get('#header-tabpanel-2') // تب کارت‌های دیگران
      .find('span.MuiTypography-bodySelected')
      .should('contain.text', formattedCardNumber)
      .and('be.visible');
  }

  addMyCardUI() {
    this.showToast()
      .should('be.visible')
      .invoke('text')
      .then(text => {
        expect(text).to.include('حله! کارت با موفقیت اضافه شد'); });
  }

  assertAPIResponseInAddOtherCard() {
    cy.get('@updateProfileAttribute').then(interception => {
      const result = interception.response.body.result;
      expect(result.status.code).to.eq(200);
    });
  }

  deleteotherCardUI() {
    this.showToast()
      .should('be.visible')
      .and('contain.text', 'حله! کارت حذف شد.');
  }
  
}
