// document.addEventListener('DOMContentLoaded', function() {};
console.log('beanService.mjs');

const debugAction = document.getElementById('action');
const lastDate = document.getElementById('lastDate');

// const bod = document.getElementsByTagName('body')
// document.body.style.backgroundColor = 'rgb(41,15,84)';


// function registerServiceworker() {
//     if ('serviceWorker' in navigator) {
//         navigator.serviceWorker.register('./sw.js')
//         .then(reg => {
//             console.log('Service worker registered');
//         })
//         .catch(err => {
//             console.log('Service worker not registered', err);
//         });
//     }
// }

// registerServiceworker();
/**
 * @class BeanService
 */
class BeanService {
    /**
     * @type {Object}
     * @desciption current balance and settings as a json object
     */
    balanceData = {
        balance: -259,
        date: new Date('2024-07-26'),
        incAmount: 100,
        decAmount: 50,
        dailyAmount: 10
    }

    /**
     * @type {number}
     * @default -4
     * @private
     * @description current balance
     */
    balance = -4;

    // A flag determining whether a button was recently clicked. This is used to allow multiple clicks to be registered and agglomerated as one total transaction

    recentCall = false;

    // VERY fine tuning: the milliseconds to elapse before allowing a click to be registered to a new transaction

    timeBeforeNewTransaction = 3500;

    constructor() {
        console.log('BeanService constructor');
        console.log(this.balanceData);
        this.balance = this.balanceData.balance;        
        this.updateBalance();
        console.log('balance', this.balance);

        
        debugAction.textContent = 'Will update in 6s\t' + this.balance.toString();
        lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
        setTimeout(() => {
            this.loadBalance();
            this.updateDate();
            this.updateBalance();
            // debugAction.textContent = 'Updated balance from saved file';
            
            setTimeout(() => {
                this.saveBalance();
            }, 2000)
            
        }, 6000)
    }

    increment() {
        console.log(this);
        console.log('BeanService increment');
        // console.log(this.balanceData);
        this.balance += this.balanceData.incAmount;
        this.updateBalance();
    }

    decrement() {
        console.log('BeanService decrement');
        this.balance -= this.balanceData.decAmount;
        this.updateBalance();
    }

    updateBalance() {
        const balanceTag = document.getElementById('balnace');
        balanceTag.textContent = this.balance;
    }

    saveBalance() {
        console.log('BeanService saveBalance');
        console.log('Saving: ', this.balance);
        this.balanceData.balance = this.balance;
        this.balanceData.date = new Date(Date.now()).getTime();
        const data = JSON.stringify(this.balanceData);
        console.log(data);
        window.localStorage.setItem('balance', this.balance);
        window.localStorage.setItem('data', data);

        
        debugAction.textContent = 'Saved balance';
        lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
        
    }

    loadBalance() {
        console.log('BeanService loadBalance');
        this.balanceData = JSON.parse(window.localStorage.getItem('data'));
        this.balance = this.balanceData.balance;
        console.log('Loaded: ', this.balanceData);
        this.updateBalance();

        debugAction.textContent = 'Loaded balance';
        lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
    }

    updateDate() {
        console.log('BeanService updateDate');
        // no, only update date when saving
        // const today = new Date();
        const today = new Date(Date.now());
        const loadedDate = new Date(this.balanceData.date);
        let daysPassed = 0;

        if (today.getMonth() === loadedDate.getMonth()) {
            console.log('Same month indeed')
            daysPassed = today.getDate() - loadedDate.getDate();
            const bal = this.balanceData.balance + daysPassed * this.balanceData.dailyAmount;
            console.log('bal', bal);
            this.balanceData.balance = bal;
            this.balance = bal;
        } 
        if (today.getMonth() !== loadedDate.getMonth()) {
            console.log('Different month');
            if (today.getFullYear() !== this.balanceData.date.getFullYear()) {
                alert('Whole year passed!\nDo your own math');
            } else {
                // Get the difference in days between today and the last date
                // Multiply the difference by the daily amount
                
                daysPassed = Math.floor((today.getTime() - this.balanceData.date.getTime()) / (1000 * 60 * 60 * 24));
                const bal = this.balanceData.balance + daysPassed * this.balanceData.dailyAmount;
                console.log('added income to bal. Total: ', bal);
                this.balanceData.balance = bal;
                this.balanceData.date = today;
                this.balance = bal;
            }
        }
        // No, only update date when saving
        // this.balanceData.date = new Date();

        debugAction.textContent = `Updated date with ${daysPassed} days`;
        lastDate.textContent = new Date(this.balanceData.date).toDateString();
    }
}

const beanService = new BeanService();

document.getElementById('plus').addEventListener('click', ()=> {
    beanService.increment();
    // console.log('plussed');
    // console.log(beanService);
});
document.getElementById('minus').addEventListener('click', () => {
    beanService.decrement();
});

document.getElementById('save').addEventListener('click', () => {
    beanService.saveBalance();
});
document.getElementById('load').addEventListener('click', () => {
    
    beanService.loadBalance();
});

document.addEventListener('pause', () => {
    debugAction.textContent = 'Pausing';
    beanService.saveBalance();
}, false);

document.addEventListener('resume', () => {
    debugAction.textContent = 'Resuming';
    beanService.loadBalance();
}, false);


// console.log('beanService', beanService);

// function increment() {
//     console.log('increment');
// }

// function decrement() {
//     console.log('decrement');
// }