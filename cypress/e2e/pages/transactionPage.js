/// <reference types="cypress" />

export class TransactionPage {
  // ---------- Getters ----------
  moreButton = () => cy.contains('button', 'بیشتر', { timeout: 20000 });
  transactionsTab = () => cy.contains('span', 'تراکنش‌ها');
  headerH2 = () => cy.get('h2.MuiTypography-h2');
  receiptIcon = () => cy.get('img[src*="visibleReceipt"]');
  filterButton = () => cy.contains('button', 'فیلتر', { timeout: 20000 });
  allCheckboxes = () => cy.get('input[type="checkbox"]');
  clearAllButton = () => cy.contains('p', 'حذف همه').parents('button');
  applyFilterButton = () => cy.get('button.MuiButton-containedPrimary').contains('اعمال فیلتر');
  filterResultHeader = () => cy.get('h2.MuiTypography-h2').contains('نتیجه فیلتر');
  transferTabButton = () => cy.contains('button[role="tab"]', 'کارت به کارت');
  receiptModal = () => cy.get('div.MuiDrawer-paperAnchorBottom');
  receiptModalButton = () => cy.contains('button', 'مشاهده رسید');
  shareReceiptButton = () => cy.get('#share-btn', { timeout: 10000 });
  confirmButton = () => cy.contains('button', 'تایید');
  clearFilterButton = () => cy.contains('button', 'حذف فیلتر');
  startDateInput = () => cy.contains('span', 'تاریخ شروع').parent().find('p');
  endDateInput = () =>   cy.contains('span', 'تاریخ پایان').parent().find('p');  
  editFilterButton = () => cy.contains('button', 'ویرایش فیلتر', { timeout: 10000 });
  noTransactionMessage = () => cy.contains('h6', 'هنوز تراکنشی وجود ندارد', { timeout: 10000 });
  currentMonth = () => cy.get('.slick-current').find('button');
  unknownStatus = () => cy.contains('div', 'نامشخص');

  // ---------- Actions ----------
  openTransactionPage = () => {
    this.moreButton().click();
    this.transactionsTab().click();
  };


  openStartDatePicker(){
this.startDateInput().click();
  }

  openEndDatePicker(){
this.endDateInput().click()

  }

  clickActionButton = (label) => {
    cy.contains('button', label, { timeout: 10000 }).should('be.visible').click({ force: true });
  };

  clickClearFilter = () => this.clearFilterButton().should('be.visible').click({ force: true });
  clickEditFilterButton = () => this.editFilterButton().click({ force: true });
  clickShareReceiptButton = () => this.shareReceiptButton().click({ force: true });
  clickViewReceiptButton = () => this.receiptModalButton().should('be.visible').click({ force: true });
  selectTransferTab = () => this.transferTabButton().click({ force: true });
  openFilterPanel = () => this.filterButton().should('be.visible').click({ force: true });

  selectAllCheckboxes = () => this.allCheckboxes().check({ force: true });
  clearAllCheckboxes = () => this.clearAllButton().should('be.enabled').click({ force: true });
  selectCheckboxByLabel = (label) => cy.contains('label', label).find('input[type="checkbox"]').check({ force: true });
  selectStatusFilter = (status) => cy.contains('div', status).scrollIntoView().last().click({ force: true });
  applyFilter = () => this.applyFilterButton().should('be.enabled').click({ force: true });

  clickFirstValidReceipt = () => {
    cy.get('#content-scroll div[id]', { timeout: 10000 }).each(($card, index, $cards) => {
      cy.wrap($card).within(() => {
        cy.get('span.MuiTypography-bodySelected').invoke('text').then((title) => {
          if (title.trim() !== 'پیشکش') {
            cy.get('img[src*="visibleReceipt"]').click({ force: true });
            cy.log(`✅ کلیک روی اولین تراکنش معتبر با عنوان: ${title}`);
            return false; // متوقف کردن each بعد از پیدا شدن اولین کارت معتبر
          }
        });
      });
    });
  };


  selectCheckboxes(){
    cy.contains('p', 'وضعیت تراکنش')   // پیدا کردن عنوان فیلتر
    .next('div')                      // کانتینر گزینه‌ها
    .contains('div', 'موفق')          // پیدا کردن گزینه موفق
    .click({ force: true });
  
  }

  // ---------- Assertions ----------
  assertHeader = () => this.headerH2().should('contain.text', 'تراکنش');
  assertFilterResultHeader = () => this.filterResultHeader().should('exist');
  // assert: modal رسید آماده است (نیاز به visible والد ندارد)
assertReceiptModalVisible = () => {
  // منتظر می‌مانیم که drawer/modal در DOM باشد (exist) و دکمه داخلش قابل پیدا شدن باشد
  cy.get('div.MuiDrawer-paperAnchorBottom').first({ timeout: 10000 }).should('exist');

  // سپس روی دکمه "مشاهده رسید" صبر می‌کنیم که درون DOM قرار بگیرد و enabled باشد
  cy.contains('button', 'مشاهده رسید', { timeout: 10000 })
    .should('exist')
    .and('not.be.disabled');
};
clickViewReceiptButton = () => {
  // چون بعضی‌وقت‌ها modal کامل visible نیست، از click({ force: true }) استفاده می‌کنیم
  cy.contains('button', 'مشاهده رسید', { timeout: 10000 }).click({ force: true });
  cy.log('✅ دکمه "مشاهده رسید" کلیک شد');
};


  assertNoTransactionMessage = () => this.noTransactionMessage().should('be.visible');
  assertAllCheckboxesUnchecked = () => this.allCheckboxes().should('not.be.checked');
  assertAllCheckboxesChecked = () => this.allCheckboxes().should('be.checked');
  assertTransactionStatusSelected = (status) => {
    cy.contains('button', 'اعمال فیلتر')  // پیدا کردن دکمه بر اساس متن
  .should('be.enabled');               // assert که فعال است

  };
  

  statusFilterContainer() {
    return cy.contains('p', 'وضعیت تراکنش').parent();
  }

  // انتخاب وضعیت تراکنش (موفق، ناموفق، نامشخص)
  selectTransactionStatus(status) {
    this.statusFilterContainer().within(() => {
      cy.contains('div', status, { timeout: 10000 })
        .parent()                // parent که کلاس انتخاب شده روی آن است
        .click({ force: true });
    });
  }
  
  
  assertDateDifferenceInDays = (diffInDays) => {
    expect(diffInDays, '⚠️ اختلاف تاریخ‌ها باید دقیقاً ۶۰ روز باشد').to.eq(60);
  };

  assertTransactionCard = (id) => {
    this.getTransactionCardById(id).within(() => {
      cy.contains('وضعیت').should('exist');
      cy.contains('تاریخ - ساعت').should('exist');
      cy.contains('مبلغ').should('exist');
    });
  };

  assertVisibleReceiptIconFromAPI = (aliasName, tabName) => {
    return cy.wait(aliasName).then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const transactions = response.body?.result?.data || [];
      const txWithReceipt = transactions.find((tx) => tx.visibleReceipt === true);
      if (!txWithReceipt?.id) {
        cy.log(`⚠️ هیچ تراکنش ${tabName} با visibleReceipt: true یافت نشد.`);
        return cy.wrap(null);
      }
      this.getTransactionCardById(txWithReceipt.id).within(() => this.receiptIcon().should('be.visible'));
      return cy.wrap(txWithReceipt.id);
    });
  };

  assertVisibleReceiptIconForAllTransactionsFromAPI = (aliasName, tabName) => {
    return cy.wait(aliasName).then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      const transactions = response.body?.result?.data || [];
      if (transactions.length === 0) {
        cy.log(`⚠️ هیچ تراکنشی در تب ${tabName} یافت نشد.`);
        return;
      }
      transactions.forEach((tx) => {
        this.getTransactionCardById(tx.id).within(() => this.receiptIcon().should('be.visible'));
      });
    });
  };

  // ---------- Utils ----------
  getStartDateValue = () => this.startDateInput().invoke('val');
  getEndDateValue = () => this.endDateInput().invoke('val');
  getTransactionCardById = (id) => cy.get(`#${id}`);
  getCurrentMonthInDatePicker = () => this.currentMonth().invoke('text');
}
