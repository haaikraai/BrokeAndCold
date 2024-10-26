// document.addEventListener('DOMContentLoaded', function() {};

console.log('beanService.mjs');

const modal = document.getElementById('modal');
console.log(modal);





const debugAction = document.getElementById('action');
const lastDate = document.getElementById('lastDate');
const statusTag = document.getElementById('status-bar');

let logEntryTemplate =
{
    date: new Date(),
    tags: [],
    amount: 0
}

let globalBalanceData = {
    balance: 5,
    date: new Date('2024-10-05'),
    incAmount: 55,
    decAmount: -5,
    dailyAmount: 555
}
/**
 * 
 * @class BeanService
 */
class BeanService {

    // literallyCounting = 0;

    /**
     * @type {Object}
     * @desciption current balance and settings as a json object
    */
    balanceData = {
        balance: -1,
        date: new Date('2024-09-16'),
        incAmount: 33,
        decAmount: -3,
        dailyAmount: 333
    }

    /**
     * @type {number}
     * @default -4
     * @private
     * @description current balance
     */
    balance = 1;

    // A flag determining whether a button was recently clicked. This is used to allow multiple clicks to be registered and agglomerated as one total transaction


    // timeBeforeNewTransaction = 3500;
    timeBeforeNewTransaction = 3500;
    runningTotal = 0;
    // VERY fine tuning: the milliseconds to elapse before allowing a click to be registered to a new transaction
    clickTimer;
    ledger = new LedgerBook();

    testButton = document.querySelector('#testButton')
    balanceTag = document.querySelector('#balnace');

    constructor() {
        // this.literallyCounting += 1;
        // console.log(`There is now ${this.literallyCounting} beans`);
        this.balance = this.balanceData.balance;
        console.log('BeanService constructor. Hardcoded balance: ', this.balance);
        console.log(this.balanceData);

        this.updateBalance();

        this.clickTimer = new eventTimer(this.timeBeforeNewTransaction, () => {
            console.log('should display cordially that amount added was: ' + this.runningTotal);
            this.updateBalance();
        });

        this.testButton.addEventListener('click', () => {
            console.log(this.ledger);
            this.ledger.renderLedger(5);
        })


        // Here is the actual constructor. Real version should have no setTimeout
        setTimeout(() => {
            lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
            this.loadBalance();
            this.updateDate();
            this.updateBalance();
            debugAction.textContent = 'Updated balance from saved file';
            this.saveBalance("Loaded balance from saved file and applied daily allowances");

        }, 1500);
    }

    testInstance() {
        console.log('Testing beanService');
        console.log(this.balanceData);
    }

    increment() {
        console.log(this);
        console.log('BeanService increment');
        // console.log(this.balanceData);
        this.runningTotal += this.balanceData.incAmount;
        statusTag.textContent = "Adding: " + this.runningTotal;
    }

    decrement() {
        console.log('BeanService decrement');
        // this.balance -= this.balanceData.decAmount;
        console.log(this.balanceData.decAmount);
        this.runningTotal += this.balanceData.decAmount;
        statusTag.textContent = "Subtracting: " + this.runningTotal;
    }

    updateBalance() {
        this.balance += this.runningTotal;
        this.balanceTag.innerText = this.balance;
        debugAction.innerText = 'Updated balance by: ' + this.runningTotal;
        statusTag.textContent = "Transaction saved. Total: " + this.runningTotal;

        // TODO: tags are temporary for now. Get real tags method. Also in wrong place, should only be after buttons were clicked
        const tags = ['before', 'tags', 'implemented']
        this.ledger.addEntry(this.runningTotal, Date.now(), tags);
        console.log('Added entry:');
        console.log(this.ledger.ledgerData[this.ledger.ledgerData.length - 1]);

        this.runningTotal = 0;
    }

    saveBalance(msg) {
        console.log('BeanService saveBalance');
        console.log('Saving: ', this.balance);
        this.balanceData.balance = this.balance;
        this.balanceData.date = new Date(Date.now()).getTime();
        const data = JSON.stringify(this.balanceData);
        console.log(data);
        // window.localStorage.setItem('balance', this.balance);
        window.localStorage.setItem('data', data);

        statusTag.textContent = 'Balance after transaction: ' + this.balance.toString() + '---' + msg;
        setTimeout(() => statusTag.textContent = '', 3000);
        lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
    }

    loadBalance() {
        console.log('BeanService loadBalance');
        const parsedData = JSON.parse(window.localStorage.getItem('data'));
        if (parsedData) { this.balanceData = parsedData }
        else {
            console.log('No data in localStorage')
            statusTag.textContent = 'No data in localStorage';
        };
        this.balance = this.balanceData.balance;
        console.log('Loaded: ', this.balanceData);

        // debugAction.textContent = 'Loaded balance: '+ this.balance.toString();
        lastDate.textContent = new Date(this.balanceData.date).toLocaleString();
    }

    /*
    Compares last saved date to now. Adds the dailyAmount * (difference in days) to the balance.
    ADDITIONALLY: if the date is a new day, it saves an extra copy to "backup"
    */
    updateDate() {
        console.log('BeanService pay daily allowances');
        // no, only update date when saving
        // const today = new Date();
        const today = new Date();
        const loadedDate = new Date(this.balanceData.date);

        // get time difference between now and last saved in milliseconds, hours, days.
        const deltaTime = today.getTime() - loadedDate.getTime();
        const deltaHours = Math.floor(deltaTime / 1000 / 60 / 60);
        const deltaDays = Math.floor(deltaTime / 1000 / 60 / 60 / 24);

        console.log('Calculations:');
        console.log(deltaTime + ' - ' + deltaHours + ' - ' + deltaDays);

        // SAVE backup if more than 24 hours passed:
        if (deltaHours >= 24) {
            window.localStorage.setItem('backup', window.localStorage.getItem('data'));
            console.log('backed up data');
            statusTag.textContent = 'Backed up data';
            setTimeout(() => statusTag.textContent = '', 3000);
        }

        // use already calculated days ellapsed to get new balance
        // Math.floor - do not want fractional salaries

        const totalIncome = deltaDays * this.balanceData.dailyAmount;
        console.log(`added income to bal. Total: ${totalIncome} - for ${deltaDays} days ellapsed`);
        this.balance = this.balance + totalIncome;
        this.balanceData.date = today;
        this.balanceData.balance = this.balance;

        statusTag.textContent = `Added ${totalIncome} to balance`;
        setTimeout(() => statusTag.textContent = '', 3000);
        debugAction.textContent = `Updated date with ${deltaDays} days`;
        lastDate.textContent = new Date(this.balanceData.date).toDateString();
    }

    /*
    Old version calculation per constraints. New version just gets millisecond difference, calculates day difference from it and done.
    */
    updateDate_old_version() {
        // do the math for two dates in the same month
        if (today.getMonth() === loadedDate.getMonth()) {
            console.log('Same month indeed')
            daysPassed = today.getDate() - loadedDate.getDate();
            const bal = this.balanceData.balance + daysPassed * this.balanceData.dailyAmount;
            console.log('bal', bal);
            this.balanceData.balance = bal;
            this.balance = bal;
        }

        // do more complex math for two dates in different months. This is stupid, should just do the complex math.
        if (today.getMonth() !== loadedDate.getMonth()) {
            console.log('Different month');
            if (today.getFullYear() !== loadedDate.getFullYear()) {
                alert('Whole year passed!\nDo your own math');
            } else {
                // Get the difference in days between today and the last date
                // Multiply the difference by the daily amount

                daysPassed = Math.floor((today.getTime() - loadedDate.getTime()) / (1000 * 60 * 60 * 24));
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


/*
This one. This classs checks if a double or triple or infinetuple click happened.
It has a time threshold. If the time ellapsed time between clicks is larger than the threshold, it is concidered a new cluster of clicks.
It has its own internal timer state.
It returns a integer as the state of the received. Possible return values are:
1 - symbolising the first click for a new set of clusters
0 - symbolising a click in the same cluster

Guide:
create class with an event as constructer parameter ===? maybe bad idea.

Notes:
I had to o make this a class to keep an internal state to track the cluster and time. Surely there is a simpler, functional way.
This is currently for mouse clicks. But it can be applied and extended for any event and any timeframe. 
It doesn't even have to be time, it can be for a http post event that streams chunks, where it sends if the size of two adjacent chunks differs by a certain size. Shite example.
*/
class eventTimer {
    recentClick = false;
    recentThreshold = 14000;
    activeTimer;
    callBack;

    constructor(threshold, runAfterTimeout) {
        this.recentThreshold = threshold;
        this.callBack = runAfterTimeout;
    }

    onClick(debugMsg) {
        console.log(debugMsg);
        const recentClick = this.recentClick;
        console.log('click noted. Currently have: ' + recentClick);
        console.log(this.activeTimer);

        if (recentClick == false) {
            this.startTimer();
            return (recentClick);
        }

        if (recentClick == true) {
            clearTimeout(this.activeTimer);
            this.startTimer();
            return (recentClick);
        }

        console.log("event happened. Starting or restarting timer");

    }

    startTimer() {
        console.log('Starting timer');
        this.recentClick = true;
        this.activeTimer = setTimeout(() => {
            console.log('class timer is done');
            this.recentClick = false;
            this.callBack();
        }, this.recentThreshold);
    }
}

class LedgerBook {
    ledgerData = [
        {
            date: new Date('07-15-2025'),
            tags: ['some', 'stuff'],
            amount: 690
        },
        {
            date: new Date('09-01-2025'),
            tags: ['less', 'stuff'],
            amount: 90
        }
    ]

    constuctor() {
        this.loadHistory();
    }


    loadHistory() {
        const historyFromStorage = window.localStorage.getItem('history');
        if (historyFromStorage) {
            this.ledgerData = JSON.parse(historyFromStorage);
        } else {
            console.log('No history in localStorage');
        }
        statusTag(textContent = 'History loaded');
        setTimeout(() => statusTag.textContent = '', 3000);
    }

    saveHistory() {
        window.localStorage.setItem('history', JSON.stringify(this.ledgerData));
        statusTag(textContent = 'History saved');
        setTimeout(() => statusTag.textContent = '', 3000);
    }

    addEntry(amount, date, tags = null) {
        if (!tags) {
            tags = ['no', 'tags'];
        }
        this.ledgerData.push({ date: new Date(date).toLocaleString(), tags, amount });
    }

    renderLedger(maxitems = 5) {
        // make max larger when you have actual items
        console.log('rendering');
        const entrypoint = document.querySelector('#ledgerhistory');

        // clear any old ledger still here
        while (entrypoint.firstChild) {
            entrypoint.removeChild(entrypoint.firstChild);
        }

        // check if there are actually maxitems to render. If not, render all
        if (this.ledgerData.length < maxitems) {
            maxitems = this.ledgerData.length;
        }


        for (let i = this.ledgerData.length - 1; i >= this.ledgerData.length - maxitems; i--) {
            const entry = this.ledgerData[i];
            const entryHtml = document.createElement('div');
            entryHtml.className = 'ledgercontainer';
            entryHtml.id = "modal-trigger";
            entryHtml.dataset.index = i;
            entryHtml.innerHTML = `
                <span class="ledgercell datecell">${entry.date.toLocaleString()}</span>
                <span class="ledgercell" >${entry.tags.toString()}</span>
                <span class="ledgercell amountcell" >${entry.amount}</span>
            `;

            const entryRow = entrypoint.appendChild(entryHtml);
            // const ledgerRow = entrypoint.querySelector('.ledgercontainer:last-child');


            entryRow.addEventListener('click', () => {
                // Open the modal here
                openModal(entry);
            });
        }
    }
}

function openModal(entry) {
    console.log(entry);
    modal.style.display = 'block';
    console.log('modal');
    console.log(modal);

    // TODO: FIX THIS. mthe modal.querySelector is not working. It returns null. Only date works. I think.
    // Check if form elements are indeed part of the modal's DOM

    const modDate = document.querySelector('#modal-date');
    const modTags = modal.querySelector('#modal-tags');
    const modAmount = document.querySelector('#modal-amount');

    console.log({modDate, modTags, modAmount});

    modDate.value = entry.date.toLocaleString();
    modTags.value = entry.tags.toString();
    modAmount.value = entry.amount;

    // Add event listener to close button
    modal.querySelector('#modal-close').addEventListener('click', () => {
        modal.style.display = 'none'; // Hide the modal
    });

    modal.querySelector('#modal-save').addEventListener('click', () => {
        
        const currentEntry = {
            date: new Date(modDate.value),
            tags: modTags.value,
            amount: modAmount.value
        };
        console.log('Going to be saving');
        console.log(currentEntry);
        // beanService.ledger.addEntry(currentEntry.amount, currentEntry.date, currentEntry.tags);
        modal.style.display = 'none'; // Hide the modal 
    })

    // Add event listener to modal container (for clicking outside)
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none'; // Hide the modal
        }
    });
}

// function onLoad() {
//     console.log('in onload');
//     document.addEventListener("deviceready", onDeviceReady, false);
// }

// // device APIs are available
// //

// function onDeviceReady() {
//     document.addEventListener("pause", onPause, false);
//     document.addEventListener("resume", onResume, false);
//     beanService.renderLedger();
//     // document.addEventListener("menubutton", onMenuKeyDown, false);
//     // Add similar listeners for other events
// }



// function onPause(e) {
//     beanService.saveBalance();
//     debugAction.innerText = "Did save before pause";
// }

// function onResume(e) {
//     beanService.loadBalance();
//     debugAction.innerText = "Did load before resuming";
// }

// console.log('beanService', beanService);

// function increment() {
//     console.log('increment');
// }

// function decrement() {
//     console.log('decrement');
// }

function settingsClicked() {
    console.log('yes, clocked a button. Well done');
    // balanceDataCopy = JSON.parse(JSON.stringify(beans.balanceData));
    /*************  ✨ Codeium Command 🌟  *************/
    // window.location.href='./settings.html' // this will cause a full page reload
    // window.location.assign('./settings.html') // this will cause a full page reload
    // window.location.replace('./settings.html') // this will cause a full page reload and not remember the previous page
    // history.replaceState(beans.balanceData, "", "./index.html");
    // history.pushState(balanceDataCopy, "", './settings.html') // this is the way to do a SPA navigation, it will not cause a full page reload and will remember the previous page
    // window.localStorage.setItem('data', JSON.stringify(balanceDataCopy));
    // const classData = new URLSearchParams().
    // window.location.search
    window.location.assign('./settings.html?data=' + JSON.stringify(beans.balanceData));
    /******  21cb7d48-6063-46cb-a3ea-3f884e28c03a  *******/
}



const beans = new BeanService();
const balanceDataCopy = JSON.parse(JSON.stringify(beans.balanceData));
// const balanceData = beans.balanceData;

export { debugAction, balanceDataCopy, globalBalanceData };


document.getElementById('settingsButton').addEventListener('click', settingsClicked);

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('CORDOVA ACTIVATED');

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    // document.getElementById('deviceready').classList.add('ready');
    // debugAction.textContent = 'Cordova ready';

    document.addEventListener('pause', () => {
        console.log('leaving shallow waters');
        beans.saveBalance();
        debugAction.textContent = 'Paused after saving';
    }, false);

    document.addEventListener('resume', () => {
        console.log('returning to deep waters');
        // maybe redunant

        statusTag.textContent = 'Resuming after being away';
        setTimeout(() => {
            beans.loadBalance();
            statusTag.textContent = '';
            debugAction.textContent = 'Resumed after loading';
        }, 3000);

    }, false);

    window.addEventListener('volumeupbutton', () => {
        alert('volume up');
    }, false);
}

document.getElementById('plus').addEventListener('click', () => {
    console.log('plussed');
    beans.increment();
    console.log(beans.clickTimer.onClick());
    console.log('Running total: ' + beans.runningTotal);
    // console.log('plussed');
    // console.log(beanService);
}, false);

document.getElementById('minus').addEventListener('click', () => {
    beans.decrement();
    console.log(beans.clickTimer.onClick());
    console.log('Running total: ' + beans.runningTotal);
}, false);

document.getElementById('save').addEventListener('click', () => {
    beans.saveBalance("Saving from button");
}, false);

document.getElementById('load').addEventListener('click', () => {
    console.log('loading balance by button');
    beans.loadBalance();
}, false);

document.getElementById('modal-trigger').addEventListener('click', (ev) => {
    console.log('opening modal');
    openModal(ev);
});

/*
// *************************************
// ********  JUST FOR TESTING **********
// *************************************

function callWhenDone() {
    debugAction.innerText = 'transaction logged';
}


const dumbdata = [
    {name: "John", age: 34},
    {name: "Katy", age: 44},
    {name: "Ben", age: 4}
    
]

function testing() {
//     const templateHtml = `
//   <div class="ledgerrow" id="ledgerrow">
//     <span id="name">${age ?? -1}</span>
//     <span id="age">${name ?? "John Doe"}</span>
//   </div>;`
    
//   const rowTemplate = new HTMLHtmlElement().createElement();
//   const rowCreator = document.createElement(newHtml);
    
    dumbdata.forEach((dummy) => {
        // const pad = document.createElement('div');
        // const pad = document.
        // console.log('Processing ' + dummy.name);
        // pad.innerText = `${dummy.name}\t\t\t---\t\t\t${dummy.age}`;
        const newHtml = `
  <div class="ledgerrow" id="ledgerrow">
    <span id="name">${dummy.name}</span>
    <span id="age">${dummy.age}</span>
  </div>`;

        ledgerAnchor.insertAdjacentHTML("beforeend", newHtml);

    })
    console.log('in testing function');
}

beanService.ledger.renderLedger();
*/