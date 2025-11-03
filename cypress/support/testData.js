// cypress/support/testData.js
export const DEFAULT_WAIT_TIME = 2000;
export const wait = () => cy.wait(DEFAULT_WAIT_TIME);
export class TestData {
    getTestPhoneNumber() {
      return '09123456789';
    }
    getTestOtp() {
      return '4030';
    }
    getServiceCode() {
      return '1234';
    }
    getTestYear() {
      return '1400';
    }
    getTestCardNumber() {
      return '6362141120337689';
    }
    getTestMciPhonNumberBill() {
      return '09123456789';
    }
    getTestMtnPhonNumberBill() {
      return '09359565566';
    }
    getTestRtlPhonNumberBill() {
      return '09209565566';
    }
    getTestPstnPhonNumberBill() {
      return '02133333333';
    }
    getTestWaterNumberBill() {
      return '7701268801514';
    }
    getTestElecNumberBill() {
      return '6923957704320';
    }
    getTestGasNumberBill() {
      return '6923957704320';
    }
    getTestTlyNumberPackage() {
      return '09322234567';
    }
    getTestPerMtnNumberPackage() {
      return '09379563344';
    }
    getTestPostMtnNumberPackage() {
      return '09002131368';
    }
    getTestPostRtlNumberPackage() {
      return '09204000796';
    }
    getTestPreRtlNumberPackage() {
      return '09206066035';
    }
    getTestPreMciNumberPackage() {
      return '09933333333';
    }
    getTestPostMciNumberPackage() {
      return '09123333333';
    }
    getAcceptorCode() {
      return '9021019961';
    }
    getDestnationNumber() {
      return '09122222222';
    }
    getDestnationNationalCode() {
      return '2669849288';
    }
  }
  
  export const TEST_PHONE_NUMBER = '9195944597';
  export const TEST_PHONE_NUMBER2 = '9961056339';
  export const TEST_PHONE_NUMBER3 = '9391010015';
  export const TEST_PHONE_NUMBER4 = '9324938984';
  export const TEST_PHONE_NUMBER5 = '9961055762';
  export const TEST_PHONE_NUMBER6 = '9133539588';
  export const TEST_PHONE_NUMBER7 = '9125056114';
  export const TEST_OTP_NUMBER1 = '123456';
  export const TEST_OTP_NUMBER2 = '4030';
  export const TEST_YEAR1 = '1408';
  export const TEST_MONTH1 = '06';
  export const TEST_SERVICE_CODE = '123456';
  export const TEST_CARDNUMBER = '6362141120337689';
  export const TEST_MCI_PHONE_NUMBER_BILL = '09120196324';
  export const TEST_MTN_PHONE_NUMBER_BILL = '09002131368';
  export const TEST_RTL_PHONE_NUMBER_BILL = '09201613023';
  export const TEST_PSTN_PHONE_NUMBER_BILL = '09209202310';
  export const TEST_WATER_NUMBER_BILL = '7701268801514';
  export const TEST_ELEC_NUMBER_BILL = '6923957704320';
  export const TEST_GAS_NUMBER_BILL = '0170700806238';
  export const TEST_TLY_PHONE_NUMBER_PACKAGE = '09324938984';
  export const TEST_PER_MTN_PHONE_NUMBER_PACKAGE = '09379563344';
  export const TEST_POST_MTN_PHONE_NUMBER_PACKAGE = '09002131368';
  export const TEST_POST_RTL_PHONE_NUMBER_PACKAGE = '09201613023';
  export const TEST_PRE_RTL_PHONE_NUMBER_PACKAGE = '09224049526';
  export const TEST_PRE_MCI_PHONE_NUMBER_PACKAGE = '09933934590';
  export const TEST_POST_MCI_PHONE_NUMBER_PACKAGE = '09102085461';
  export const TEST_ACCEPTOR_CODE = '9021019961';
  export const TEST_DESTNATION_NUMBER = '09133539588';
  export const TEST_DESTNATION_NATIONAL_CODE = '2669849288';

  

  