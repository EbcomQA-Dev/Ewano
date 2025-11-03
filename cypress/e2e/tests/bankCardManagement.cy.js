import { bankCardManagementPages } from '../pages/bankCardManagementPages';
import { LoginPage } from '../pages/LoginPage';
import { TestData,TEST_PHONE_NUMBER7,TEST_YEAR1,TEST_CARDNUMBER,TEST_MONTH1,TEST_OTP_NUMBER1} from '../../support/testData';

describe('bankCardManagement Flow', () => {
  const bankCardManagement = new bankCardManagementPages();
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
  cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
  });

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });

  // انتخاب کارت پیش فرض روی کارت های احراز شده در شرایطی که کاربر بیش از یک کارت احراز شده داشته باشد
  it('select default card in verified cards', () => {
    bankCardManagement.slectDefaultCardInVerifiedCards();
    bankCardManagement.assertAPIResponse();
    bankCardManagement.assertGetCardsAPIHasStarred();
  });

  // نمایش کارت های من به صورت مسک شده در لیست کارتهای احراز شده
  it('masked display of cards in verified cards', () => {
    bankCardManagement.maskedDisplayCardsInVerifiedCards();
  });

  // نمایش کارت های من به صورت مسک شده در لیست کارتهای من
  it('masked display of cards in my cards', () => {
    bankCardManagement.maskedDisplayCardsInMyCards();
  });

  // ویرایش کارت احراز شده: فقط عنوان کارت قابل ویرایش
  it('edit title card in verified cards', () => {
    bankCardManagement.editCardInVerifiedCards('test');
    bankCardManagement.editTitleUI();
  });

  // افزودن کارت من در صفحه کارت های من
  it('add new card with scrollable month/year pickers', () => {
    bankCardManagement.addMyCardInMyCards(TEST_CARDNUMBER, TEST_MONTH1, TEST_YEAR1);
    bankCardManagement.addMyCardUI()
    
});
  
    // انتخاب، حذف و انتخاب دوباره یک کارت برای پیش فرض در کارت های من و بررسی پیش فرض روی موجودی کارت
    it('select default card in verified cards', () => {
      bankCardManagement.slectDefaultCardInMyCards();
      bankCardManagement.assertAPIResponse();
      bankCardManagement.assertGetCardsAPIHasStarredForBalanceInquiry();
    });

      // ویرایش کارت من: فقط عنوان کارت و تاریخ انقضا قابل ویرایش
  it('edit title card in my cards', () => {
    bankCardManagement.editCardInMyCards('test');
    bankCardManagement.editTitleUI();
  });
        // افزودن کارتهای دیگران
  it('add card in others cards', () => {
  bankCardManagement.addCardInOtherCards(TEST_CARDNUMBER,'test');
  bankCardManagement.addotherCardUI();
  bankCardManagement.assertAPIResponseInAddOtherCard()
        });

        it('delete card in others cards', () => {
          bankCardManagement.deleteCardInOtherCards();
                });
});
