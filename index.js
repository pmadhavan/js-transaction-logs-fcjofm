// Import stylesheets
import './style.css';
// These are all the merchants in our little example universe

const merchants = ['Aamzon', 'Costco', 'Safeway', 'Trader Joes'];

// These are all the cardholders
const cardholders = {
  Rishi: {
    balance: 220, // Transactions attempted at other merchants should be denied.
    approvedMerchants: ['Costco', 'Safeway', 'Aamzon'],
  },
  Aura: {
    balance: 110,
    approvedMerchants: ['Costco'],
  },
  Dash: {
    balance: 200,
    approvedMerchants: ['Safeway', 'Trader Joes'],
  },
  Hydra: {
    balance: 460,
    approvedMerchants: ['Costco', 'Safeway', 'Aamzon', 'Trader Joes'],
  },
};

// Helper function
function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// This function will create a transaction for you to process
function createTransaction() {
  const transactionInfo = {
    amount: (Math.random() * 100).toFixed(2),
    cardholder: randomFromArray(Object.keys(cardholders)),
    merchant: randomFromArray(merchants),
  };

  var transactionEvent = new CustomEvent('transaction', {
    detail: transactionInfo,
  });

  window.dispatchEvent(transactionEvent);
}

let myInterval = setInterval(createTransaction, 5000);
setTimeout(() => {
  console.info('Interval cleared');
  clearInterval(myInterval);
}, 15000);
function checkMerchant(merchant, cardholder) {
  return cardholders[cardholder]?.approvedMerchants?.includes(merchant);
}

function checkBalance(amount, cardholder) {
  return amount <= cardholders[cardholder]?.balance;
}

function validateTransaction(transactionInfo) {
  const { amount, cardholder, merchant } = transactionInfo;
  if (!checkMerchant(merchant, cardholder)) return false;
  if (!checkBalance(amount, cardholder)) return false;
  return true;
}

function addTrasactionLogs(message, cardholder, failure = false) {
  const logs = cardholders[cardholder]?.logs ?? [];
  logs.push(message);
  cardholders[cardholder].logs = logs;
  renderTransaction(message, cardholder, failure);
}

function modifyBalance(amount, cardholder) {
  const balance = cardholders[cardholder]?.balance;
  cardholders[cardholder].balance = balance - amount;
  console.log('Modified balance', cardholders[cardholder].balance);
}
function makeTransaction({ amount, cardholder, merchant }) {
  addTrasactionLogs(
    `Transaction approved for ${merchant} ${amount} ${cardholder}`,
    cardholder
  );
  modifyBalance(amount, cardholder);
}
window.addEventListener('transaction', (event) => {
  event.stopImmediatePropagation();
  console.log('Transaction processing...');
  const transactionInfo = event && event.detail;
  if (validateTransaction(transactionInfo)) {
    makeTransaction(transactionInfo);
  } else {
    // Error
    console.error('Transaction failed', transactionInfo);
    const { amount, cardholder, merchant } = transactionInfo;
    addTrasactionLogs(
      `Transaction failed for ${merchant} ${amount} ${cardholder}`,
      cardholder,
      true
    );
  }
});

// helper function
function createElementAndAddText(element, text, className) {
  const ele = document.createElement(element);
  ele.className = className;
  ele.textContent = text;
  return ele;
}

function renderTransaction(log, name, failure = false) {
  const cardholderEle = document.querySelector(`#${name}`);
  console.log(log, 'Log came');
  const liEle = createElementAndAddText('li', log);
  !!failure ? (liEle.style.color = 'red') : (liEle.style.color = 'green');
  cardholderEle.append(liEle);
}
const transactionEle = document.querySelector('.transaction');
const cardholdersName = Object.keys(cardholders);

cardholdersName.forEach((name) => {
  const cardholderEle = createElementAndAddText('div', [,], 'cardholder');
  cardholderEle.id = name;
  transactionEle.append(cardholderEle);
  cardholderEle.append(createElementAndAddText('h2', name));
});
