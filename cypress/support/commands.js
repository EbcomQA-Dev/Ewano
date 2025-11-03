/// <reference types="cypress" />

Cypress.Commands.add('getAuthToken', () => {
    cy.request({
      method: 'GET',
      url: 'https://stage-ebcom.mci.ir/services/auth/v1.0/user/login/otp/1234',
      headers: {
        clientId: 'd92375a5-0281-4289-b14c-b001214ac8c2',
        scope: 'testGroup',
        username: '9195944597',
        mciChannelId: '693'
      }
    }).then((result) => {
      const token = result.body.result.data.token;
      cy.wrap(token).as('authToken'); 
    });
  });
  
