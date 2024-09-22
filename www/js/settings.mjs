import { beanService } from "./beanService.mjs";

const balance = document.getElementById('balanceAmt');
const daily = document.getElementById('dailyAmt');
const increase = document.getElementById('increaseAmt');
const decrease = document.getElementById('decreaseAmt');
const date = document.getElementById('date');

console.log(balance);
console.log('in settings');

// redundant, imported beanservice instance
// let balanceData = {
//     balance: -111,
//     date: new Date('2024-08-01'),
//     incAmount: 100,
//     decAmount: 50,
//     dailyAmount: 200
// }

function debug() {
    // console.log(daily);
    console.log('value');
    console.log(daily.value);
    
    setTimeout(() => {
        loadBalance();
        console.log(balanceData);
    }, 2000)
}

debug();


// redundant, imported beanservice instance
function saveBalance() {
    console.log('saving settings');
    beanService.balanceData.balance = parseInt(balance.value);
    beanService.balanceData.dailyAmount = parseInt(daily.value);
    beanService.balanceData.incAmount = parseInt(increase.value);
    beanService.balanceData.decAmount = parseInt(decrease.value);
    beanService.balanceData.date = Date.parse(date.value);
    console.log('Data to save:');
    // balanceData.date = new Date(Date.now()).getTime();
    const data = JSON.stringify(beanService.balanceData);
    console.log(data);
    window.localStorage.setItem('data', data);
    
}

// redundant, imported beanservice instance
function loadBalance() {
    console.log('Current settings important from beanService instance:');
    console.log(beanService.balanceData);

    balance.value = beanService.balanceData.balance;
    daily.value = beanService.balanceData.dailyAmount;
    increase.value = beanService.balanceData.incAmount;
    decrease.value = beanService.balanceData.decAmount;
    date.value = new Date(beanService.balanceData.date).toISOString();

    console.log('Loaded: ', beanService.balanceData);
}

// document.addEventListener('DOMContentLoaded', loadBalance);
// save whenever input box loses focus
document.addEventListener('focusout', () => {
    console.log('lost focus');
    beanService.saveBalance();
}, false);