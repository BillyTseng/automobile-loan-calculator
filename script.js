/* function generateTable() {
    var initBalance = 1000;
    var numYears = 5;
    var interestRate = 1.2;
    var currBalance;

    var initBalanceElement = document.getElementById("initBalance");
    initBalance = parseFloat(initBalanceElement.value);

    var numYearsElement = document.getElementById("numYears");
    numYears = parseFloat(numYearsElement.value);

    var interestRateElement = document.getElementById("intRate");
    interestRate = parseFloat(interestRateElement.value);

    var savingsTableElement = document.getElementById("savingsTable1");

    savingsTableHTML =  '<table>';
    savingsTableHTML += '<tr><th>Year</th><th>Balance</th></tr>';

    // Use a loop to generate the table rows with data.
    currBalance = initBalance;
    for (var i = 0; i < numYears; i++) {
        currBalance += currBalance * (1.0 * (interestRate / 100.0));
        savingsTableHTML += '<tr><td>' + (i + 1) + '</td><td>$' + currBalance.toFixed(2) + '</td></tr>';
    }

    savingsTableHTML += '</table>';
    savingsTableElement.innerHTML = savingsTableHTML;
} */

function isBadInput(element) {
  var ret = isNaN(element.value);

  switch(element.id) {
    // 1) Interest rate should be greater than 0.0% and less than 10.0%
    case "intRate":
      if (element.value <= 0 || element.value > 10)
        ret = true;
      break;
    // 2) Term in months should be greater than or equal to 24 and less than or equal to 72
    case "term":
      if (element.value < 24 || element.value > 72)
        ret = true;
      break;
    // 3) Purchase price should be greater than 0 and less than $100000.
    case "purchasePrice":
      if (element.value <= 0 || element.value > 100000)
        ret = true;
      break;
    case "cashIncentive":
      break;
    default:
      ret = true;
  }
  return ret;
}

function validateInput(element) {
  var badInput = isBadInput(element);

  if (badInput) {
    element.style.borderColor = 'red';
    element.style.borderWidth = '2px';
    element.nextElementSibling.style.display = "inline";
  } else {
    element.style.borderColor = 'black';
    element.style.borderWidth = '1px';
    element.nextElementSibling.style.display = "none";
  }
  return badInput;
}

function validateElement(element) {
  return function() {
    validateInput(element);
  };
}

function removeOption(index) {
  return function() {
    this.parentNode.parentNode.removeChild(this.parentNode);
    optionsArray.splice(index, 1);
    renderOptions();
  };
}

function calPaymentAmount(i) {
  var p = optionsArray[i].purchasePrice;
  var r = optionsArray[i].intRate / 100 / 12;
  var n = optionsArray[i].term;
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function renderOptions() {
  var optionsElem = document.getElementsByClassName('options')[0];
  optionsElem.innerHTML = ''; // Clear the privious options.
  for (var i = 0; i < optionsArray.length; i++) {
    var htmlStr = '';
    var loanCardElem = document.createElement('div');
    loanCardElem.className = 'loanCard';

    var termInMonth = optionsArray[i].term;
    var monthPay = calPaymentAmount(i);
    var totalCost = monthPay * termInMonth - optionsArray[i].cashIncentive;
    monthPay = totalCost / termInMonth;
    htmlStr += '<p>Offer ' + (i+1) + ':</p>';
    htmlStr += '<span class="close">x</span>'
    htmlStr += '<p>Interest Rate: ' + optionsArray[i].intRate.toFixed(2) + '%</p>';
    htmlStr += '<p>Loan Term (months): ' + optionsArray[i].term + '</p>';
    htmlStr += '<p>Monthly Payment: $' + monthPay.toFixed(2) + '</p>';
    htmlStr += '<p>Total cost of Ownership: $' + totalCost.toFixed(2) + '</p>';
    loanCardElem.innerHTML = htmlStr;
    optionsElem.appendChild(loanCardElem);
    document.getElementsByClassName('close')[i].addEventListener("click", removeOption(i));
  }
}

function optionView() {
  var inputObj = {};
  var badInput = false;
  for(var i=0; i < inputElements.length; i++) {
      if (inputElements[i].type == "text") {
          badInput |= validateInput(inputElements[i]);
      }
  }

  // If any input element is invalid, return so the table is not udpated.
  if (badInput) {
     return;
  }
  
  inputObj.purchasePrice = parseFloat(purchasePriceElem.value);
  inputObj.cashIncentive = parseFloat(cashIncentiveElem.value);
  inputObj.intRate = parseFloat(intRateElem.value);
  inputObj.term = parseFloat(termElem.value);

  optionsArray.push(inputObj);
  if (optionsArray.length > 3)
    optionsArray.shift();

  renderOptions();
  /*  //Debugging
  for (var i = 0; i < optionsArray.length; i ++) {
    console.log("optionView: " + Object.values(optionsArray[i]));
  }*/
};

var optionsArray = [];
var purchasePriceElem = document.getElementById('purchasePrice');
var cashIncentiveElem = document.getElementById('cashIncentive');
var intRateElem = document.getElementById('intRate');
var termElem = document.getElementById('term');

var inputElements = document.getElementsByTagName("input");

for(var i=0; i < inputElements.length; i++) {
    if (inputElements[i].type == "text") {
        inputElements[i].addEventListener("input", validateElement(inputElements[i]));
    }
}

var addOption = document.getElementById('addOption');
addOption.addEventListener('click', optionView);
