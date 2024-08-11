const balance = document.getElementById('balanceAmt');
const daily = document.getElementById('dailyAmt');
const increase = document.getElementById('increaseAmt');
const decrease = document.getElementById('decreaseAmt');
const date = document.getElementById('date');

console.log(balance);
console.log('in settings');

let balanceData = {
    balance: -111,
    date: new Date('2024-08-01'),
    incAmount: 100,
    decAmount: 50,
    dailyAmount: 200
}

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



function saveBalance() {
    console.log('saving settings');
    balanceData.balance = parseInt(balance.value);
    balanceData.dailyAmount = parseInt(daily.value);
    balanceData.incAmount = parseInt(increase.value);
    balanceData.decAmount = parseInt(decrease.value);
    balanceData.date = new Date(date.value).getTime();
    console.log('Data to save:');
    // balanceData.date = new Date(Date.now()).getTime();
    const data = JSON.stringify(balanceData);
    console.log(data);
    window.localStorage.setItem('data', data);
    
}

function loadBalance() {
    console.log('Settings loadBalance');
    balanceData = JSON.parse(window.localStorage.getItem('data'));
    console.log(balanceData);

    balance.value = balanceData.balance;
    daily.value = balanceData.dailyAmount;
    increase.value = balanceData.incAmount;
    decrease.value = balanceData.decAmount;
    date.value = new Date(balanceData.date).toISOString();

    console.log('Loaded: ', balanceData);
}

// document.addEventListener('DOMContentLoaded', loadBalance);
// save whenever input box loses focus
document.addEventListener('focusout', () => {
    console.log('lost focus');
    saveBalance();
}, false);