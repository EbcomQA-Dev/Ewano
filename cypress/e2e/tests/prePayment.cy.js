
import { prePaymentPage } from '../pages/prePaymentPage';
import { LoginPage } from '../pages/LoginPage';
import { TestData,TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1 } from '../../support/testData';

describe('prePayment Flow', () => {
  const prePayment = new prePaymentPage();
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
  cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
  });

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });

  // نمایش کتگوری بالانس ها در صفحه prePayment به ترتیب کانفیگ
  it('should validate UI balance titles appear in config order', () => {
    cy.request('https://sandbox-ebcom.mci.ir/static/app/ewano/ewano-config.json')
      .then((configResponse) => {
        const configItems = configResponse.body.result.data.configuration.basic.walletTags.payment;
        const configTitles = configItems.map(item => item.title.trim());
  
        cy.log('📦 Config Titles:', JSON.stringify(configTitles));
  
        prePayment.ShowBalanceCategoriesBasedOnconfig('9933934590');
  
        cy.get('[id^="payment-method-"]').then(($cards) => {
          const uiTitles = [...$cards].map(card => {
            const titleSpan = card.querySelector('span.MuiTypography-body');
            return titleSpan ? titleSpan.innerText.trim() : '';
          }).filter(Boolean);
  
          cy.log('🖥️ UI Titles:', JSON.stringify(uiTitles));
  
          function isSubsequence(sub, full) {
            let i = 0;
            for (const item of full) {
              if (i < sub.length && sub[i] === item) {
                i++;
              }
            }
            return i === sub.length;
          }
  
          expect(isSubsequence(uiTitles, configTitles), 
            `UI titles (${JSON.stringify(uiTitles)}) should be a subsequence of config titles (${JSON.stringify(configTitles)})`
          ).to.be.true;
        });
      });
  });
  
  const isExpired = (expts) => {
    if (!expts) return false;
    const expiryDate = new Date(expts);
    const now = new Date();
  
    const expiryDateOnly = new Date(expiryDate.getFullYear(), expiryDate.getMonth(), expiryDate.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
    return expiryDateOnly < nowDateOnly;
  };
  
  it('Validate visible balance titles and their priority labels in UI based on sorted order', () => {
    const priorityLabels = [
      'انتخاب اول', 'انتخاب دو', 'انتخاب سه', 'انتخاب چهار',
      'انتخاب پنج', 'انتخاب شش', 'انتخاب هفت', 'انتخاب هشت'
    ];
  
    const testMobileNumber = '9933934590';
  
    cy.log('⏳ اجرای متد page برای گرفتن بالانس‌ها و مرتب‌سازی بر اساس priority');
    prePayment.balancesTitlesSortedByPriority(testMobileNumber);
  
    cy.get('@sortedBalances', { timeout: 15000 }).then(sortedBalances => {
      cy.log(`✅ تعداد بالانس‌های فعال مرتب شده (status=ACTIVE): ${sortedBalances.length}`);
  
      cy.get('label.MuiFormControlLabel-root', { timeout: 20000 }).should('exist').and('be.visible');
  
      cy.get('label.MuiFormControlLabel-root').then($labels => {
        cy.log(`🔍 تعداد کل label های UI: ${$labels.length}`);
  
        const items = [...$labels].map(labelEl => {
          const $el = Cypress.$(labelEl);
          const title = $el.find('span.MuiFormControlLabel-label').text().trim();
          const $captionEl = $el.parent().siblings('span.MuiTypography-caption');
          const caption = $captionEl.length > 0 ? $captionEl.text().trim() : '';
          const isDisabled = $el.prop('disabled') || $el.hasClass('Mui-disabled');
          return { title, caption, isDisabled };
        });
  
        cy.log('--- شروع بررسی تطابق کپشن‌ها با ترتیب priority مرتب شده ---');
  
        // چک کردن بالانس های value=0 که باید غیرفعال و بدون کپشن باشند
        const zeroValueBalances = sortedBalances.filter(balance => balance.value === 0);
        zeroValueBalances.forEach(balance => {
          const uiItem = items.find(i => i.title === balance.title);
          if (uiItem) {
            cy.log(`🔎 بالانس با مقدار 0: "${balance.title}" باید غیرفعال باشد و کپشن اولویت نداشته باشد.`);
            expect(uiItem.isDisabled).to.be.true;
            expect(uiItem.caption).to.be.oneOf(['', null, undefined]);
          }
        });
  
        // فیلتر: فقط بالانس‌های value>0 و فعال در UI
        const activeBalancesInUI = sortedBalances.filter(balance =>
          balance.value > 0 &&
          items.some(uiItem => uiItem.title === balance.title && uiItem.isDisabled === false)
        );
  
        activeBalancesInUI.forEach((balance, index) => {
          const uiItem = items.find(i => i.title === balance.title);
          if (!uiItem) {
            cy.log(`⚠️ بالانس "${balance.title}" با مقدار >0 و فعال در API در UI پیدا نشد، صرفنظر می‌کنیم.`);
            return;
          }
  
          const expectedLabel = priorityLabels[index] || `انتخاب ${index + 1}`;
  
          cy.log(`✅ بررسی بالانس "${balance.title}" با مقدار ${balance.value} و priority=${balance.priority}`);
          cy.log(`    کپشن UI: "${uiItem.caption}"`);
          cy.log(`    کپشن مورد انتظار: "${expectedLabel}"`);
          cy.log(`    وضعیت فعال بودن: ${uiItem.isDisabled ? 'غیرفعال' : 'فعال'}`);
  
          expect(uiItem.isDisabled).to.be.false;
          cy.wrap(null).then(() => {
            expect(uiItem.caption).to.eq(expectedLabel);
          });
        });
  
        cy.log('✅ بررسی کپشن‌ها به پایان رسید.');
      });
    });
  });
  
  
  
  
  
  
  
  
  

      // پرداخت موفقیت آمیز با چند بالانس و چک باقی مانده مبلغ 0
      it('Successful payment with multiple balances', () => {
        prePayment.successPaymentWithMultipleBalances('09933934590');
        prePayment.assertReceiptUI();
        prePayment.assertSuccessPayment();
      });

      //باقی مانده داشتن مبلغ پرداخت خرید و تایید صحت آن در صورت انتخاب بیش از یک کیف پول
      it('Confirm correct amount remaining', () => {
            prePayment.ConfirmCorrectAmountRemaining('09933934590');
            
          });
          
  
  
    
  
});




      
      
      
      
  
  
  
  
  
