import { CurrencyCardPage } from '../pages/CurrencyCardPage.js';
import { LoginPage } from '../pages/LoginPage';
import { TestData,TEST_PHONE_NUMBER7,TEST_CARDNUMBER,TEST_OTP_NUMBER1,TEST_OTP_NUMBER2,TEST_PHONE_NUMBER3} from '../../support/testData';

describe('Currency card Flow', () => {
  const CurrencyCard = new CurrencyCardPage();
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER7,TEST_OTP_NUMBER1);
  cy.wrap(TEST_PHONE_NUMBER7).as('testPhone')
  });

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });

  // باز کردن کارت موجوی نقدی و مشاهده صحیح اطلاعات کارت
  it('should show account information and validate UI', () => {
    CurrencyCard.assertOpenCardUI();
  });

//برداشت وجه - انتخاب شماره کارت از بین کارت هایی که قبلا ذخیره شده
  it('should success wallet decrease with selected card', () => {
    CurrencyCard.successWalletDecrease(100000);
    CurrencyCard.assertReceiptUI();
    CurrencyCard.assertDecreaseAPIResponse();
  });
  // برداشت وجه - ثبت دستی شماره کارت
  it('should success wallet decrease with entred card', () => {
    CurrencyCard.successWalletDecreaseWithEntredCard(10000,TEST_CARDNUMBER);
    CurrencyCard.assertReceiptUI();
    CurrencyCard.assertDecreaseAPIResponse();
  });
  //برداشت وجه با مبلغ بیش از موجودی کیف پول و دریافت اسنک بار مربوطه
  it('should show toast for insufficent balance', () => {
    CurrencyCard.setupInterceptions(); // اول اینو        // بعد اینو
    CurrencyCard.insufficentBalance();
    CurrencyCard.assertInsufficentBalanceUI();
  });
  //برداشت وجه - دستی وارد کردن مبلغ بیشتر از 1 میلیون تومان و دریافت اسنک بار بار خطای مربوط
  it('should show toast for more allowed amount', () => {
    CurrencyCard.moreAllowedAmount(100000000);
    CurrencyCard.moreAllowedAmountUI();
  });
  //برداشت وجه - دستی وارد کردن مبلغ کمتر از  هزار تومان وعدم  برداشت موفق مبلغ
  it('should show toast for less allowed amount', () => {
    CurrencyCard.lessAllowedAmount(100);
    CurrencyCard.lessAllowedAmountUI();
  });
// برداشت وجه - آیکون حذف برای مقدار تکست فیلدها
  it('should show empty field', () => {
    CurrencyCard.deleteIconFieldForDecrease(1000);
    CurrencyCard.deleteIconFieldForDecreaseUI();
  });
  //  افزایش وجه - آیکون حذف برای مقدار تکست فیلد
  it('should show empty field', () => {
    CurrencyCard.deleteIconFieldForIncrease();
    CurrencyCard.deleteIconFieldForIncreaseUI();
  });
// افزایش وجه - دستی وارد کردن مقدار زیر 10هزار تومان و دریافت اسنک بار خطا
  it('should show toast for less amount in increase', () => {
    CurrencyCard.lessAmountForIncrease(1000);
    CurrencyCard.lessAmountForIncreaseUI();
  });
//افزایش وجه - دستی وارد کردن مقدار بالای 100 میلیون تومان و دریافت اسنک بار خطا
  it('should show toast for more amount in increase', () => {
    CurrencyCard.moreAmountForIncrease(10000000000);
    CurrencyCard.assertionMoreAmountForIncreaseUI();
  });
  //برداشت وجه - برداشت موفق وجه چک شود مبلغ از موجودی کسر شود
  it('should success wallet amount decrease', () => {
    CurrencyCard.setupInterceptions();  // مهم: قبل از هر عملیاتی که درخواست میفرسته
    CurrencyCard.successWalletDecreaseAmount(10000);
  });
//رسید افزایش وجه ناموفق ( درگاه درون برنامه ای با وارد کردن اطلاعات کارت نادرست)
  it('should unsuccess wallet increase cuz cvv2 is wrong', () => {
    CurrencyCard.increaseAmountWithWrongcvv2(150000,178,12345);
    CurrencyCard.assertNotSuccfulReceiptUI();
  });

});


describe('Currency card Flow', () => {
  const CurrencyCard = new CurrencyCardPage();
  const loginPage = new LoginPage();
  const testData = new TestData();

  beforeEach(() => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER3,TEST_OTP_NUMBER2);
  cy.wrap(TEST_PHONE_NUMBER3).as('testPhone')
  });

  Cypress.on('uncaught:exception', (err) => {
    if (err.message.includes('520') || err.message.includes('deleteRule')) return false;
  });
// افزایش وجه - دستی وارد کردن مقدار
  it('should success wallet increase with mpg and manual amount', () => {
    CurrencyCard.increaseAmountWithManualAmount('100000','674','0440034922');
    CurrencyCard.assertSuccfulReceiptUI();
  });
  //افزایش وجه - انتخاب مبلغ پیشنهادی
  it('should success wallet increase with mpg and selected amount', () => {
    CurrencyCard.increaseAmountWithSelectedAmount('674','0440034922');
    CurrencyCard.assertSuccfulReceiptUI();
  });
  //افزایش وجه - چک شود مبلغ به موجودی اضافه شود
  it('should success wallet increase and change amount balance', () => {
    CurrencyCard.setupInterceptions();  // مهم: قبل از هر عملیاتی که درخواست میفرسته
    CurrencyCard.increaseAmountBalanceCheck('100000','674','0440034922');
  });
});
