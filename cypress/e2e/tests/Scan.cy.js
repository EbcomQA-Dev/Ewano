import { ScanPage } from '../pages/ScanPage';
import { LoginPage } from '../pages/LoginPage';
import { TestData,TEST_PHONE_NUMBER7,TEST_ACCEPTOR_CODE,TEST_OTP_NUMBER1,TEST_SERVICE_CODE } from '../../support/testData';

describe('Scan Flow', () => {
  const scan = new ScanPage();
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    // موفقیت آمیز لاگین و ذخیره توکن
    loginPage.successfulLogIn(TEST_PHONE_NUMBER7, TEST_OTP_NUMBER1)
      .then(() => {
        // بعد از لاگین، Cypress.env.token باید موجود باشه
        const token = Cypress.env('token');
        if (!token) throw new Error('Token هنوز در Cypress.env موجود نیست');
      });
  
    cy.wrap(TEST_PHONE_NUMBER7).as('testPhone');
  });
  
  
  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });
  Cypress.on('uncaught:exception', (err, runnable) => {
    // اگر متن خطا مربوط به video نبود اجازه بده fail شه
    if (err.message.includes("element with id 'video' not found")) {
      return false; // جلوی fail شدن تست رو می‌گیره
    }
  });
  
   //  شارژ کیف پول از طریق اسکن ووچر کارت
 it('should simulate QR scan and open voucher bottom sheet', () => {
 scan.simulateScanVoucher(TEST_SERVICE_CODE);
 });

  // پرداخت با کد پذیرنده تردپارتی  
  it('should login, get code and pay using third party acceptor code', () => {
    const amount = 100000;
  
    cy.wrap(amount).as('testAmount'); // ✅ ثبت مبلغ برای مقایسه بعدی
  
    cy.request({
      method: 'GET',
      url: 'https://stage-ebcom.mci.ir/services/auth/v1.0/client/login',
      headers: {
        clientId: 'd92375a5-0281-4289-b14c-b001214ac8c2',
        ClientSecret: 'mahsa',
        scope: 'testGroup',
        Cookie: 'cookiesession1=678B783579DEB3E357683E69F416A07A',
      },
    }).then(loginResp => {
      const token = loginResp.body.result.data.token;
  
      return cy.request({
        method: 'POST',
        url: 'https://stage-ebcom.mci.ir/services/mp/v1.0/order/thirdparty/qr',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Cookie: 'cookiesession1=678B783579DEB3E357683E69F416A07A',
        },
        body: {
          provider: {
            title: 'MCI CSR',
            code: 'MCI_CSR',
          },
          amount,
          msisdn: '9125056114',
          tarckId: '111222',
        },
      });
    }).then(orderResp => {
      const code = orderResp.body.result.data.code;
  
      scan.paymentWithThirdpartyAcceptorCode(code);
      scan.assertReceiptPaymentWithThirdpartyAcceptorCodeUI();
      scan.assertPaymentWithThirdpartyAcceptorCodeAPIResponse();
    });
  });
  // پرداخت با کد پذیرنده تردپارتی استفاده شده 
  it('should error when using already used thirdparty acceptor code', () => {
    const amount = 100000;
  
    cy.wrap(amount).as('testAmount'); // ذخیره مبلغ
  
    cy.request({
      method: 'GET',
      url: 'https://stage-ebcom.mci.ir/services/auth/v1.0/client/login',
      headers: {
        clientId: 'd92375a5-0281-4289-b14c-b001214ac8c2',
        ClientSecret: 'mahsa',
        scope: 'testGroup',
        Cookie: 'cookiesession1=678B783579DEB3E357683E69F416A07A',
      },
    }).then(loginResp => {
      const token = loginResp.body.result.data.token;
  
      return cy.request({
        method: 'POST',
        url: 'https://stage-ebcom.mci.ir/services/mp/v1.0/order/thirdparty/qr',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Cookie: 'cookiesession1=678B783579DEB3E357683E69F416A07A',
        },
        body: {
          provider: {
            title: 'MCI CSR',
            code: 'MCI_CSR',
          },
          amount,
          msisdn: '9125056114',
          tarckId: '111222',
        },
      });
    }).then(orderResp => {
      const code = orderResp.body.result.data.code;
  
 
      scan.paymentWithUsedThirdpartyAcceptorCode(code,'15000');
      scan.assertWrongAcceptorCodeUI();
    });
  });
  
// پرداخت با کد پذیرنده pose  
  it('should pay successfully with acceptor code', () => {
    scan.paymentWithAcceptorCode(TEST_ACCEPTOR_CODE, 100000);
    scan.assertReceiptUI();
    scan.assertAcceptorCodeApyAPIResponse();
  });

  // پرداخت ناموفق با کدپذیرنده pose نامعتبر
  it('should show error toast with wrong acceptor code', () => {
    scan.paymentWithWrongAcceptorCode('9021889961', 10_000);
    scan.assertWrongAcceptorCodeUI();
  });

    // عدم امکان پرداخت با کد پذیرندگی Thirdpartyوقتی متعلق به مشترک دیگری باشد
  it('Unable to pay with another persons thirdparty acceptor code', () => {
      const amount = 100000;
    
      cy.wrap(amount).as('testAmount'); // ✅ ثبت مبلغ برای مقایسه بعدی
    
      cy.request({
        method: 'GET',
        url: 'https://stage-ebcom.mci.ir/services/auth/v1.0/client/login',
        headers: {
          clientId: 'd92375a5-0281-4289-b14c-b001214ac8c2',
          ClientSecret: 'mahsa',
          scope: 'testGroup',
          Cookie: 'cookiesession1=678B783579DEB3E357683E69F416A07A',
        },
      }).then(loginResp => {
        const token = loginResp.body.result.data.token;
    
        return cy.request({
          method: 'POST',
          url: 'https://stage-ebcom.mci.ir/services/mp/v1.0/order/thirdparty/qr',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            Cookie: 'cookiesession1=678B783579DEB3E357683E69F416A07A',
          },
          body: {
            provider: {
              title: 'MCI CSR',
              code: 'MCI_CSR',
            },
            amount,
            msisdn: '9133539588',
            tarckId: '111222',
          },
        });
      }).then(orderResp => {
        const code = orderResp.body.result.data.code;
    
        scan.paymentWithThirdpartyAcceptorCode(code);
        scan.assertOtherAcceptorCodeUI();
      });
    });

});
