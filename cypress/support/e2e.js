// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

Cypress.on('uncaught:exception', (err, runnable) => {
    // اگر می‌خواهید خطاهای خاص را نادیده بگیرید، شرط بگذارید
    if (err.message.includes('Network Error')) {
      // نادیده گرفتن این خطا و جلوگیری از fail شدن تست
      return false;
    }
    // برای سایر خطاها، اجازه بده تست fail شود
  });

  
  Cypress.on('uncaught:exception', (err, runnable) => {
    // اگر خطا مربوط به status 520 بود، آن را نادیده بگیر
    if (err.message.includes('Request failed with status code 520')) {
      return false; // Cypress این خطا را fail نمی‌کند
    }
  });