import { chatbotPage } from '../pages/chatbotPage.js';
import { LoginPage } from '../pages/LoginPage';
import { TestData,TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1} from '../../support/testData';

describe('chatbot Flow', () => {
  const chatbot = new chatbotPage();
    const loginPage = new LoginPage();
    const testData = new TestData();

beforeEach(() => {
      loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
    cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
    });

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });
 // نمایش ایکون چت بات در صورت فعال بودن در کانفیگ در هدر صفحات خانه، خدمات، فروشگاه و بیشتر 
it('check chatbot icon visibility based on config', () => {
    // 1. دریافت و لاگ کردن درخواست کانفیگ
    cy.request('https://sandbox-ebcom.mci.ir/static/app/ewano/ewano-config.json')
      .then((response) => {
        // Assertion برای پاسخ سرور
        expect(response.status).to.eq(200, 'دریافت کانفیگ با موفقیت انجام شد');
        expect(response.body).to.have.property('result');
        expect(response.body.result).to.have.property('data');
        
        // 2. بررسی وجود سرویس چت بات در کانفیگ
        const webviewServices = response.body.result.data.configuration.webviewServices;
        expect(webviewServices).to.be.an('array', 'لیست سرویس‌های وب‌ویو باید موجود باشد');
        
        const chatBotService = webviewServices.find(service => service.code === 'chatBot');
        expect(chatBotService).to.exist;
        
        // 3. بررسی وضعیت سرویس چت بات و لاگ کردن
        const isChatBotActive = chatBotService?.status === 'ACTIVE';
        cy.log(`وضعیت چت بات در کانفیگ: ${isChatBotActive ? 'فعال' : 'غیرفعال'}`);
        
        // 4. Assertion برای وضعیت سرویس
        expect(chatBotService).to.have.property('status').that.is.oneOf(['ACTIVE', 'INACTIVE']);
        
        // 5. تست نمایش یا عدم نمایش آیکون بر اساس وضعیت
        if (isChatBotActive) {
          // Assertion برای زمانی که چت بات فعال است
          cy.log('چت بات فعال است - بررسی نمایش آیکون');
          
          // بررسی نمایش آیکون
          chatbot.showCahtBotIcon();
          
          // Assertion برای وجود و قابلیت مشاهده آیکون
          cy.get('img[alt="Ewano"]')
            .should('exist')
            .and('be.visible')
            .then(($icon) => {
              cy.log('آیکون چت بات با موفقیت نمایش داده شد');
              expect($icon).to.have.attr('src');
            });
        }
        
        // 6. لاگ کردن اطلاعات کامل سرویس چت بات
        cy.log('اطلاعات کامل سرویس چت بات:', chatBotService);
      });
  });
// ورود به چت بات
  it('entry CahtBot Page', () => {
    chatbot.entryCahtBotPage();
    chatbot.assertEntryUI()
  });

 // مشاهده آیکون چت بات در صورت غیرفعال بود این سرویس و نمایش اسنک بار در صورت کلیک روی آیکون
  it('inactive Chatbot', () => {
    cy.request('https://sandbox-ebcom.mci.ir/static/app/ewano/ewano-config.json')
    .then((response) => {
      // Assertion برای پاسخ سرور
      expect(response.status).to.eq(200, 'دریافت کانفیگ با موفقیت انجام شد');
      expect(response.body).to.have.property('result');
      expect(response.body.result).to.have.property('data');
      
      // 2. بررسی وجود سرویس چت بات در کانفیگ
      const webviewServices = response.body.result.data.configuration.webviewServices;
      expect(webviewServices).to.be.an('array', 'لیست سرویس‌های وب‌ویو باید موجود باشد');
      
      const chatBotService = webviewServices.find(service => service.code === 'chatBot');
      expect(chatBotService).to.exist;
      
      // 3. بررسی وضعیت سرویس چت بات و لاگ کردن
      const isChatBotActive = chatBotService?.status === 'INACTIVE';
      
      // 4. Assertion برای وضعیت سرویس
      expect(chatBotService).to.have.property('status').that.is.oneOf(['ACTIVE', 'INACTIVE']);
      
      // 5. تست نمایش یا عدم نمایش آیکون بر اساس وضعیت
      if (isChatBotActive) {
        // بررسی نمایش آیکون
        chatbot.inactiveChatbot()
        chatbot.assertInactiveUI()
      }
    });
  });
});
