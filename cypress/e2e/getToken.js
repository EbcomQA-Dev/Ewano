/// <reference types="cypress" />

describe('get token' , () => {
    it('should login with OTP and get token', () => {
      cy.request({
        method: 'GET',
        url: 'https://stage-ebcom.mci.ir/services/auth/v1.0/user/login/otp/1234',
        headers: {
          clientId: 'd92375a5-0281-4289-b14c-b001214ac8c2',
          scope: 'testGroup',
          username: '9195944597',
          mciChannelId: '693',
         
        },
        failOnStatusCode: false // حذف کن اگه خواستی تست fail بشه رو خطا
      }).then((res) => {
        cy.log(`status: ${res.status}`);
        cy.log(JSON.stringify(res.body, null, 2));
    
        // اگه توکن برگشت، ذخیره کن یا assert بزن
        const token = res.body?.result?.data?.token;
        if (token) {
          cy.log('توکن دریافت شد:', token);
          Cypress.env('token', token); // برای استفاده در تست‌های بعدی
        } else {
          cy.log('توکن یافت نشد!');
        }
      });
    });
    
      
  
    
  
  })