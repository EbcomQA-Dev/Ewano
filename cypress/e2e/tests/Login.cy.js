import { LoginPage } from '../pages/LoginPage'
import { TEST_PHONE_NUMBER , TEST_OTP_NUMBER1, TEST_PHONE_NUMBER3 ,TEST_OTP_NUMBER2 } from '../../support/testData';
import {SecuritySettingPages } from '../pages/SecuritySettingPages'

describe('Login Test', () => {
  const loginPage = new LoginPage()
  
  

  it('should successfully log in with correct OTP code after entering valid phone number', () => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER, TEST_OTP_NUMBER1)
    loginPage.AssertHomePage()
  })


  it('should show error for invalid phone number format during login',()=>{
    loginPage.invalidPhoneNumberLogin('355545352')
    loginPage.verifyInvalidPhoneNumberToast()
  })


  it('should prevent login when phone number lacks leading zero ', () => {
    loginPage.successfulLogIn(TEST_PHONE_NUMBER , TEST_OTP_NUMBER1)
    loginPage.AssertHomePage()
  });
  

  it.only('should show error when incorrect OTP is entered after valid phone number', () => {
    loginPage.invalidOtpLogin(TEST_PHONE_NUMBER , '543555')
    const expectedMessages = '1203 - خطای نامشخص';
    loginPage.assertToastsVisible([expectedMessages]);
  });



  it('should keep the login button disabled if OTP is not entered', () => {
    loginPage.verifyLoginButtonDisabledWithoutOTP(TEST_PHONE_NUMBER)

  });
  

  it('should return to phone number input step when "Edit Phone Number" is clicked' , ()=> {
    loginPage.EditPhoneNumber(TEST_PHONE_NUMBER , TEST_OTP_NUMBER1)
    loginPage.AssertHomePage()
  });


  it('should resend OTP code when "Resend Code" button is clicked', () => {
    
    loginPage.clickResendOTP(TEST_PHONE_NUMBER)
    loginPage.assertResendConfirmationVisible()
    
  });

  it('Edit Phone Number and Login with New Number', () => {

    loginPage.editPhoneNumberFlow(TEST_PHONE_NUMBER, TEST_PHONE_NUMBER3 , TEST_OTP_NUMBER2)
    
  });
  

})
