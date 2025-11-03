/// <reference types="cypress" />
import jalaali from 'jalaali-js';
import { LoginPage } from '../pages/LoginPage';
import { TransactionPage } from '../pages/transactionPage';
import { TEST_PHONE_NUMBER , TEST_OTP_NUMBER1 } from '../../support/testData';

function toJalaliDate(timestamp) {
  const date = new Date(timestamp);
  const j = jalaali.toJalaali(date);
  return `${j.jy}/${j.jm.toString().padStart(2, '0')}/${j.jd.toString().padStart(2, '0')}`;
}

describe('Transaction Page - Wallet and Card-to-Card Transactions', () => {
  const loginPage = new LoginPage();
  const transactionPage = new TransactionPage();

  beforeEach(() => loginPage.successfulLogIn(TEST_PHONE_NUMBER , TEST_OTP_NUMBER1));

  it('should render transaction cards correctly and match API data', () => {
    cy.intercept('GET', '**/services/account/v1.0/transactions/user?start=0&size=20').as('getTransactions');
    transactionPage.openTransactionPage();
    transactionPage.assertHeader();

    cy.wait('@getTransactions').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const transactions = response.body?.result?.data || [];
      cy.log(`✅ ${transactions.length} transactions received from API.`);
      if (transactions.length) transactionPage.assertTransactionCard(transactions[0].id);
    });
  });

  it('should show receipt icon if visibleReceipt is true', () => {
    cy.intercept('GET', '**/services/account/v1.0/transactions/user?start=0&size=20').as('getTransactions');
    cy.intercept('GET', '**/services/payment/v1.1/transactions/user?start=0&size=20&paymentType=TRANSFER').as('getTransferTransactions');

    transactionPage.openTransactionPage();
    transactionPage.assertVisibleReceiptIconFromAPI('@getTransactions', 'Wallet');
    transactionPage.selectTransferTab();
    transactionPage.assertVisibleReceiptIconForAllTransactionsFromAPI('@getTransferTransactions', 'Card-to-Card');
  });

  it('should show receipt modal on click', () => {
    cy.intercept('GET', '**/services/account/v1.0/transactions/user?start=0&size=20').as('getTransactions');
    transactionPage.openTransactionPage();
    transactionPage.assertVisibleReceiptIconFromAPI('@getTransactions', 'Wallet').then(txId => {
      if (!txId) return cy.log('No transaction with receipt available for test.');
      transactionPage.clickFirstValidReceipt();
      transactionPage.assertReceiptModalVisible();
    });
  });


  it('Redirecting to the receipt page by clicking on the View Receipt button and verifying the accuracy of the receipt information for wallet transactions', () => {
    cy.intercept('GET', '**/services/account/v1.0/transactions/user?start=0&size=20').as('getTransactions');
    transactionPage.openTransactionPage();
  
    transactionPage.assertVisibleReceiptIconFromAPI('@getTransactions', 'Wallet').then(txId => {
      if (!txId) return cy.log('No transaction with receipt available for test.');
  
      // کلیک روی اولین تراکنش معتبر
      transactionPage.clickFirstValidReceipt();
  
      // انتظار تا دکمه داخل modal در DOM قرار بگیرد (پایدارتر از انتظار برای visible)
      transactionPage.assertReceiptModalVisible();
  
      // و در نهایت کلیک روی مشاهده رسید (force در صورت لزوم)
      transactionPage.clickViewReceiptButton();
    });
  });
  
  

  it('should return to Wallet filter page with selected options preserved when clicking "ویرایش فیلتر"', () => {
    // 1. باز کردن صفحه تراکنش‌ها
    transactionPage.openTransactionPage();
  
    // 2. باز کردن پنل فیلتر
    transactionPage.openFilterPanel();
  
    // 3. انتخاب چند گزینه
    transactionPage.selectAllCheckboxes();
  
    // 4. اعمال فیلتر
    transactionPage.applyFilter();
  
    // 5. بررسی نمایش نتیجه فیلتر
    transactionPage.assertFilterResultHeader();
  
    // 6. کلیک روی دکمه ویرایش فیلتر
    transactionPage.clickEditFilterButton();
  
    // 7. بررسی بازگشت به پنل فیلتر و حفظ گزینه‌های انتخاب شده
    transactionPage.allCheckboxes().should('be.checked');
  
    // 8. بررسی اینکه دکمه اعمال فیلتر همچنان فعال است
    transactionPage.applyFilterButton().should('be.enabled');
  });


  it.only('should return to Card-to-Card filter page with selected options preserved when clicking "ویرایش فیلتر"', () => {
    transactionPage.openTransactionPage();
    transactionPage.selectTransferTab();
    transactionPage.openFilterPanel();
    transactionPage.selectCheckboxes();
    cy.wait(2000)
    transactionPage.applyFilter();
    transactionPage.assertFilterResultHeader();
    transactionPage.clickEditFilterButton();
    transactionPage.assertTransactionStatusSelected('موفق');
    transactionPage.applyFilterButton().should('be.enabled');
  });
  

  
  it('Successful filter test with all filters selected', () => {
    transactionPage.openTransactionPage();
    transactionPage.openFilterPanel();
    transactionPage.selectAllCheckboxes();
    transactionPage.clearAllCheckboxes();
    transactionPage.assertAllCheckboxesUnchecked();
    transactionPage.selectAllCheckboxes();
    transactionPage.applyFilter();
    transactionPage.assertFilterResultHeader();
  });

  it('should verify difference between start and end date in days', () => {
    transactionPage.openTransactionPage();
    transactionPage.openFilterPanel();
    transactionPage.openStartDatePicker(); transactionPage.clickActionButton('تایید');
    transactionPage.openEndDatePicker(); transactionPage.clickActionButton('تایید');

    const getDateText = label => cy.contains('span', label).siblings('p.MuiTypography-body1').invoke('text');
    cy.then(() => {
      getDateText('تاریخ شروع').then(start => {
        getDateText('تاریخ پایان').then(end => {
          const parseJalali = text => text.split('/').map(Number);
          const [sy, sm, sd] = parseJalali(start);
          const [ey, em, ed] = parseJalali(end);

          const startDate = new Date(...Object.values(jalaali.toGregorian(sy, sm, sd)).map((v,i)=> i===1? v-1:v));
          const endDate = new Date(...Object.values(jalaali.toGregorian(ey, em, ed)).map((v,i)=> i===1? v-1:v));

          const diffInDays = (endDate - startDate) / (1000*60*60*24);
          cy.log(`📅 شروع: ${start}, پایان: ${end}, اختلاف: ${diffInDays} روز`);
          transactionPage.assertDateDifferenceInDays(diffInDays);
        });
      });
    });
  });

  it('should navigate back to the wallet transactions page when Clear Filter is selected on the card-to-card filter results page', () => {
    transactionPage.openTransactionPage();
    transactionPage.selectTransferTab();
    transactionPage.openFilterPanel();
    transactionPage.openStartDatePicker();
    transactionPage.clickActionButton('تایید');
    transactionPage.applyFilter();

    cy.intercept('GET', '**/services/payment/v1.1/transactions/user?start=0&size=20&paymentType=TRANSFER*').as('getCardToCardFilter');
    cy.wait(5000)
    transactionPage.clickClearFilter();
    transactionPage.transactionsTab().should('be.visible');
    cy.wait('@getCardToCardFilter', { timeout: 15000 }).its('response.statusCode').should('eq', 200);
  });


  it('should navigate back to the wallet transactions page when Clear Filter is selected on the wallet filter results page', () => {
    transactionPage.openTransactionPage();
    transactionPage.openFilterPanel();
    transactionPage.openStartDatePicker();
    transactionPage.clickActionButton('تایید');
    transactionPage.applyFilter();

    cy.intercept('GET', '**/services/account/v1.0/transactions/user*').as('getFilteredTransactions');
    cy.wait(5000)
    transactionPage.clickClearFilter();
    transactionPage.transactionsTab().should('be.visible');
    cy.wait('@getFilteredTransactions', { timeout: 15000 }).its('response.statusCode').should('eq', 200);
  });

  it('Successful filter test with API-UI data match', () => {
    cy.intercept('GET', '**/services/account/v1.0/transactions/user?**&orderType=BILL').as('getFilteredTransactions');
    transactionPage.openTransactionPage();
    transactionPage.assertHeader();
    transactionPage.openFilterPanel();
    transactionPage.selectCheckboxByLabel('پرداخت قبض');
    transactionPage.applyFilter();

    cy.wait('@getFilteredTransactions').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const transactions = response.body?.result?.data || [];
      cy.log(`✅ ${transactions.length} transactions received from API.`);
      if (transactions.length) {
        cy.get('#layout-content', { timeout: 10000 }).should('exist');
        cy.get('#content-scroll div[id]', { timeout: 10000 }).should('have.length', transactions.length)
          .each((card,index)=> cy.wrap(card).within(()=> cy.contains(transactions[index].title).should('exist')));
      }
    });
  });

  it('Card-to-Card tab filter "Successful" test with API-UI data match', () => {
    cy.intercept('GET', '**/services/payment/v1.1/transactions/user?**&paymentType=TR**').as('getCardToCardTransactions');
    transactionPage.openTransactionPage();
    transactionPage.assertHeader();
    transactionPage.selectTransferTab();


    cy.wait('@getCardToCardTransactions').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const transactions = response.body?.result?.data || []; // همه تراکنش‌ها
      cy.log(`✅ ${transactions.length} Card-to-Card transactions received from API.`);
    
      if(transactions.length){
        cy.get('#layout-content',{timeout:10000}).should('exist');
        cy.get('#content-scroll div[id]',{timeout:10000}).should('have.length', transactions.length)
          .each((card, index) => {
            const txn = transactions[index];
            cy.wrap(card).within(() => {
              cy.contains(txn.title).should('exist');
             
    
              // نگاشت وضعیت API به متن فارسی
              let statusText = '';
              switch(txn.status){
                case 'COMPLETED': statusText = 'موفق'; break;
                case 'FAILED': statusText = 'ناموفق'; break;
                case 'RESERVED': statusText = 'نامشخص'; break;
                default: statusText = txn.status; // اگر وضعیت جدید اضافه شد
              }
              cy.contains(statusText).should('exist');
            });
          });
      }
    });
    
  });
}); 