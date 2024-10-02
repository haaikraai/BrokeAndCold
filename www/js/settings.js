console.log('in settings');
// import { balanceDataCopy as balanceData } from "./beanService.js";

let balanceData = {
    balance: -1,
    date: new Date('2024-08-01'),
    incAmount: 100,
    decAmount: 50,
    dailyAmount: 230
}

const balance = document.getElementById('balanceAmt');
const daily = document.getElementById('dailyAmt');
const increase = document.getElementById('increaseAmt');
const decrease = document.getElementById('decreaseAmt');
const date = document.getElementById('date');


console.log(balanceData);
loadBalance();

setTimeout(() => {
    console.log('No = load balance from urrl');
    // const urlData = new URL(window.location.href).searchParams
    const urlData = new URLSearchParams(window.location.search).get('data')
    console.log(urlData);
    balanceData = urlData;
    console.log(balanceData);
    balanceData = JSON.parse(balanceData);

    // balanceData = JSON.parse(window.localStorage.getItem('data'));
    console.log(balanceData);

    loadBalance();
    
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
    console.log('Data to save:');
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

document.addEventListener('focusout', () => {
    console.log('lost focus');
    saveBalance();
}, false);