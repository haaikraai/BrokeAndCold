console.log('in settings');
// import { globalBalanceData } from "./beanService.js";

console.log('imported: ');
// console.log(balanceDataCopy);
console.log('and: ');
// console.log(globalBalanceData);

let balanceData = {
    balance: -1,
    date: new Date('2024-10-01'),
    incAmount: 11,
    decAmount: -1,
    dailyAmount: 111
}

const balance = document.getElementById('balanceAmt');
const daily = document.getElementById('dailyAmt');
const increase = document.getElementById('increaseAmt');
const decrease = document.getElementById('decreaseAmt');
const date = document.getElementById('date');
const statusTag = document.getElementById('status-bar');

console.log('hard coded balanceData: ');
console.log(balanceData);
loadBalance();

setTimeout(() => {
    console.log('No = load balance from urrl');
    // const urlData = new URL(window.location.href).searchParams
    const urlData = new URLSearchParams(window.location.search).get('data')
    console.log('url data: ');
    console.log(urlData);
    balanceData = JSON.parse(urlData);
    // balanceData = JSON.parse(window.localStorage.getItem('data'));
    console.log('balanceData: ');
    console.log(balanceData);

    // Instead of url, just grab balanceData from local storage where it is saved anyways. Not sure if best ofstate management techniques,k but eh.
    // Which happends in loadbalance  functions!!!
    loadBalance();
    // updateBalance();
}, 3000);




// redundant, imported beanservice instance
// let balanceData = {
//     balance: -111,
//     date: new Date('2024-08-01'),
//     incAmount: 100,
//     decAmount: 50,
//     dailyAmount: 200
// }

function debug() {
    
    console.log('starting in 10 seconds');
    setTimeout(() => {

        loadBalance();
        console.log(balanceData);
    }, 10000)
}


// loadBalance();


// redundant, imported beanservice instance
function saveBalance() {
    console.log('saving settings');
    balanceData.balance = parseInt(balance.value);
    balanceData.dailyAmount = parseInt(daily.value);
    balanceData.incAmount = parseInt(increase.value);
    balanceData.decAmount = parseInt(decrease.value);
    balanceData.date = Date.parse(date.value);
    console.log('Data to save: (should be saved in theory also!');
    // balanceData.date = new Date(Date.now()).getTime();
    const data = JSON.stringify(balanceData);
    console.log(data);
    window.localStorage.setItem('data', data);
    
    
}

// redundant, imported beanservice instance
function loadBalance() {
    console.log('entering values in settings');
    console.log(balanceData);

    balance.value = balanceData.balance;
    daily.value = balanceData.dailyAmount;
    increase.value = balanceData.incAmount;
    decrease.value = balanceData.decAmount;
    date.valueAsNumber = new Date(balanceData.date).valueOf();  

    console.log('Loaded: ', balanceData);
}

// document.addEventListener('DOMContentLoaded', loadBalance, false) 

// save whenever input box loses focus

document.getElementById('backupButton').addEventListener('click', () => {
    balanceData = JSON.parse(window.localStorage.getItem('backup'));
    window.localStorage.setItem('data', JSON.stringify(balanceData));
    statusTag.textContent = 'Backup Retrieved';
    setTimeout(() => {
        statusTag.textContent = '';
    }, 3000);
    loadBalance();
})


document.addEventListener('focusout', () => {
    console.log('lost focus');
    saveBalance();
    statusTag.textContent = 'Settings saved';
    setTimeout(() => {
        statusTag.textContent = '';
    }, 3000);
}, false);