/// <reference types="cypress" />

export class wallettowalletPage {

    SelectWalletToWallet = () => cy.contains('کیف به کیف')
    wait = (time)  => cy.wait(time);
    incorrectNumber = () => cy.get('p.MuiFormHelperText-root.Mui-error span.MuiTypography-caption')
    incorrectNationalID = () =>cy.contains('span.MuiTypography-caption', 'عجب! کد ملی معتبر نیست!')
    mobileNumberEditButton = () => cy.get('span.MuiTypography-root.MuiTypography-body1.css-1kqmcvj')
    destinationMobileInput = () => cy.get('h3').contains('وارد کردن شماره همراه') 
         .parentsUntil('.MuiDrawer-paper') 
         .find('input[type="tel"]') 
    
    confirmModal =()=>  cy.contains('تایید')
    destinationNationalIdInput() {
        return cy.contains('label', 'کد ملی مقصد')
                 .parent()
                 .find('input[type="tel"]');
      }
      
    customAmountInput() {
        return cy.contains('label', 'مبلغ دلخواه (ریال)')
        .parent()
        .find('input');
      }

    continue = () => cy.contains('ادامه')
    confirmWalletToWalletButton = () => 
        cy.contains('h3', 'تایید اطلاعات کیف به کیف') // پیدا کردن تیتر مودال
          .parentsUntil('.MuiDrawer-paper')           // بالا رفتن تا بدنه‌ی مودال
          .parent()                                   // رسیدن به خود .MuiDrawer-paper
          .find('button')                             // همه دکمه‌ها رو پیدا می‌کنیم
          .contains('تایید')                          // دکمه‌ی تایید را انتخاب می‌کنیم

    cancelWallet = () =>
        cy.contains('h3', 'تایید اطلاعات کیف به کیف') // پیدا کردن تیتر مودال
          .parentsUntil('.MuiDrawer-paper')           // بالا رفتن تا بدنه‌ی مودال
          .parent()                                   // رسیدن به خود .MuiDrawer-paper
          .find('button')                             // همه دکمه‌ها رو پیدا می‌کنیم
          .contains('انصراف')                          // دکمه‌ی انصراف را انتخاب می‌کنیم
   
    receiptCard =() => cy.contains('عملیات موفق', { timeout: 10000 }).should('be.visible');
    Successful = () =>cy.contains('h6', 'عملیات موفق' , { timeout: 10000 })
    PhoneNumber = () =>cy.contains('div', 'انتقال به شماره') 
    ServiceType = () => cy.contains('h6', 'برداشت کیف به کیف');
    selectedMobileNumber = () => cy.get('div[data-testid="9125056114"] p.MuiTypography-root.MuiTypography-body1.css-11w0oze')
    sharingReceiptButton =() => cy.contains('اشتراک گذاری');
    sharingReceiptText   =() => cy.contains('متنی');
    backToHome = () => cy.contains('بازگشت به خانه', { timeout: 10000 })
    homePage = () => cy.contains('خرید شارژ' , { timeout: 10000 })
    print = (text) => cy.log(text);
    toast = () => cy.get('.Toastify__toast--error div.Toastify__toast-body div.toast-container > div', { timeout: 5000 })
    below = () => cy.get('span.MuiTypography-root.MuiTypography-caption.css-1ugl9ec')
    clearButton = () => cy.get('label')
    .contains('کد ملی مقصد')
    .parents('.MuiFormControl-root')
    .find('[data-testid="CloseIcon"]')
    amount = () => cy.contains('p', '100,000')
    exceeding = () =>  cy.get('.toast-container > div', { timeout: 10000 })



        



    findCard(){


        cy.intercept('GET', /\/services\/account\/wallet\/v1\.\d+\/balance/).as('getWalletBalance');
        cy.wait('@getWalletBalance').then(({ response }) => {
            const balances = response.body.result.data.balances;
            const cashBalance = balances.find(b => b.title === 'موجودی نقدی');
            cy.wrap(cashBalance.value).as('initialCash');
          });


        this.wait(2000)
        cy.get('.MuiCard-root').then(cards => {
            const cardsArr = [...cards];
            const index = cardsArr.findIndex(card => card.textContent.includes('اعتبار همراهی'));
            expect(index).to.be.gte(0);
          
            const container = cards[0].parentElement; // کانتینر اسکرول افقی کارت‌ها
          
            function findMojoodiNaghdiCard() {
              const nextCards = cardsArr.slice(index + 1);
              return nextCards.find(card => card.textContent.includes('موجودی نقدی'));
            }
          
            function scrollRight() {
              return new Cypress.Promise(resolve => {
                container.scrollBy({ left: 200, behavior: 'smooth' });
                setTimeout(() => resolve(), 500);
              });
            }
          
            function scrollUntilFound(maxAttempts = 10) {
              return new Cypress.Promise(async (resolve, reject) => {
                let attempts = 0;
                let card = null;
          
                while (attempts < maxAttempts) {
                  card = findMojoodiNaghdiCard();
                  if (card) {
                    return resolve(card);
                  }
                  await scrollRight();
                  attempts++;
                }
                reject('کارت موجودی نقدی پیدا نشد بعد از چند بار اسکرول');
              });
            }
          
            return scrollUntilFound()
              .then(card => {
                cy.wrap(card).click({ force: true });
              });
          });
    
          

    }
    completeWalletToWallet(mobile, nationalId, amount){

        cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=ACCOUNT/).as('getAccountTransaction');

        this.SelectWalletToWallet().click();
        this.mobileNumberEditButton().click();
        this.wait(2000)
        this.destinationMobileInput().clear().type(mobile)
        this.confirmModal().click()
        this.destinationNationalIdInput().clear().type(nationalId);
        this.customAmountInput().clear().type(amount);
        this.continue().click();
        this.wait(2000);
        this.confirmWalletToWalletButton().click();


    }
    executeWalletToWallet(mobile, nationalId, amount){

      cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=ACCOUNT/).as('getAccountTransaction');

      this.SelectWalletToWallet().click();
      this.mobileNumberEditButton().click();
      this.wait(2000)
      this.destinationMobileInput().clear().type(mobile)
      this.confirmModal().click()
      this.destinationNationalIdInput().clear().type(nationalId);
      this.customAmountInput().clear().type(amount);
   


  }

    deductionWalletToWallet(mobile, nationalId, amount){
        cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=ACCOUNT/).as('getAccountTransaction');

        this.SelectWalletToWallet().click();
        this.mobileNumberEditButton().click();
        this.wait(2000)
        this.destinationMobileInput().clear().type(mobile)
        this.confirmModal().click()
        this.destinationNationalIdInput().clear().type(nationalId);
        this.customAmountInput().clear().type(amount);
        this.continue().click();
        this.wait(2000);
        this.confirmWalletToWalletButton().click();       
        this.backToHome().click();
          
    }


    transferExceedingBalance(mobile, nationalId){

        this.print('@initialCash');
        cy.get('@initialCash').then(initialCash => {
            const overAmount = initialCash + 10000;
            if(overAmount<= 2000000){
        cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=ACCOUNT/).as('getAccountTransaction');

        this.SelectWalletToWallet().click();
        this.mobileNumberEditButton().click();
        this.wait(2000)
        this.destinationMobileInput().clear().type(mobile)
        this.confirmModal().click()
        this.destinationNationalIdInput().clear().type(nationalId);
        this.customAmountInput().clear().type(overAmount);
        this.continue().click();
        this.wait(2000);
        this.confirmWalletToWalletButton().click();
          }           
          
        });
        
        
        
    }
    incorrecNumbertWalletToWallet(mobile){

        this.SelectWalletToWallet().click();
        this.mobileNumberEditButton().click();
        this.wait(2000)
        this.destinationMobileInput().clear().type(mobile)
        

    }

    incorrecNatonalIdtWalletToWallet(nationalId){

        this.SelectWalletToWallet().click();
        this.destinationNationalIdInput().clear().type(nationalId);



    }
    aseertIncorrecNatonalIdtWalletToWallet(){
        this.incorrectNationalID().should('have.text', 'عجب! کد ملی معتبر نیست!');


    }

    assertincorrectNumberWalletToWallet(){
        
      this.incorrectNumber().should('be.visible')
      .and('contain.text', 'عجب! شماره همراهی که وارد کردید درست نیست!')



    }

    aseertDeduction(amount){

        cy.wait('@getWalletBalance').then(({ response }) => {
            const balances = response.body.result.data.balances;
            const cashBalance = balances.find(b => b.title === 'موجودی نقدی');
            const finalCash = cashBalance ? cashBalance.value : null;
            
            expect(finalCash).to.be.a('number');
            cy.wrap(finalCash).as('finalCash');
            this.print(`💰 موجودی بعد از کسر: ${finalCash}`);
          });
        const amountToDeduct = amount; // مبلغی که انتظار داری کسر شده باشه

        cy.get('@initialCash').then(initialCash => {
        cy.get('@finalCash').then(finalCash => {
          // بررسی می‌کنیم که مقدار کم شده دقیقاً برابر amountToDeduct باشد
        expect(initialCash - finalCash).to.eq(Number(amount));
        this.print(`✅ مبلغ ${amountToDeduct} تومان از موجودی کم شده است.`);
             });
        });

    }

    completeWalletToWalletExistingNumber(){
        cy.intercept('GET', /\/services\/account\/v1\.\d+\/transaction\/.*type=ACCOUNT/).as('getAccountTransaction');

        this.SelectWalletToWallet().click();
        this.mobileNumberEditButton().click();
        this.wait(2000)
        this.selectedMobileNumber().click();
        this.confirmModal().click()
        this.amount().click();
        this.continue().click();
        this.wait(2000);
        this.confirmWalletToWalletButton().click();
    }

    clearField(mobile, nationalId){
        this.SelectWalletToWallet().click();
        this.mobileNumberEditButton().click();
        this.wait(2000)
        this.destinationMobileInput().clear().type(mobile)
        this.confirmModal().click()
        this.destinationNationalIdInput().clear().type(nationalId);
        this.clearButton().click();


    }

    cancelWalletToWallet(mobile, nationalId, amount){

        this.SelectWalletToWallet().click();
        this.mobileNumberEditButton().click();
        this.wait(2000)
        this.destinationMobileInput().clear().type(mobile)
        this.confirmModal().click()
        this.destinationNationalIdInput().clear().type(nationalId);
        this.customAmountInput().clear().type(amount);
        this.continue().click();
        this.wait(2000);
        this.cancelWallet().click();

    }
    

    assertReceipt(mobile , expectedPrice , expectedServiceType) {
        cy.wait('@getAccountTransaction', { timeout: 30000 }).then((interception) => {
            this.wait(2000);
        
            const result = interception.response.body.result;
            expect(result.status.code).to.eq(200);
            expect(result.data.status).to.eq('COMPLETED');
            expect(result.data.title).to.eq('انتقال کیف به کیف نقدی');
        
            const items = result.data.data;
            const mobileItem   = items.find(i => i.title === 'انتقال به شماره');
            const priceItem    = items.find(i => i.title === 'مبلغ (ریال)');
            const serviceItem  = items.find(i => i.title === 'نوع خدمت');
            expect(mobileItem.value).to.eq(mobile);
            expect(priceItem.value.toString()).to.eq(expectedPrice);
            expect(serviceItem.value).to.eq(expectedServiceType);
          });
        
          // بررسی‌های UI
          this.receiptCard().should('be.visible');
          this.Successful().should('be.visible');
          this.PhoneNumber().should('contain.text', this.toPersianNumber(mobile));
          this.ServiceType().should('be.visible');
          // دکمه اشتراک گذاری
          this.sharingReceiptButton().should('be.visible').click();
            this.wait(2000);
          this.sharingReceiptText().should('be.visible');
      }
      
      assertBackTOHome(){
        this.backToHome().click();
        this.homePage().should('be.visible')
        this.print('بازگشت به خانه موفق بود')
      }
      
      assertMismatch(expectedMessages = []){

        this.wait(2000)
        this.toast().should('be.visible');
        expectedMessages.forEach((message) => {
             this.toast()
            .should('contain.text', message);
         });

      }


      assertBelow(){
        this.below()
          .should('be.visible')
          .and('contain.text', 'نمیشه! حداقل مبلغ قابل انتقال ده هزار تومنه.');
      }


    aseertExceeding(){

       this.exceeding()
         .should('be.visible')
         .and('contain.text', 'نمیشه! حداکثر مبلغ قابل انتقال دویست هزار تومنه.');

      }


      assertClear(){
        this.destinationNationalIdInput().should('be.empty')
      }


      assertCancel(){
        this.SelectWalletToWallet().should('be.visible');
      }


      toPersianNumber(str) {
        const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
        return (str ? str.toString() : '').replace(/\d/g, d => persianDigits[d]);
      }
      
      
      
      
      


      

      
      
      
      



}