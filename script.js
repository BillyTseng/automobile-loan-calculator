function isBadInput(element) {
  var ret = isNaN(element.value);

  if (element.value.trim() === "")
    ret = true;

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
  var errMsgs = document.getElementsByClassName(element.id)[0];

  if (badInput) {
    element.style.borderColor = 'red';
    element.style.borderWidth = '2px';
    errMsgs.style.display = 'block';
  } else {
    element.style.borderColor = 'black';
    element.style.borderWidth = '1px';
    errMsgs.style.display = "none";
  }
  return badInput;
}

function renderErrView() {
  var badInput = false;
  for(var i=0; i < inputElements.length; i++) {
      if (inputElements[i].type == "text") {
          badInput |= validateInput(inputElements[i]);
      }
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
    console.log(totalCost + ", " + optionsArray[i].cashIncentive);
    monthPay = totalCost / termInMonth;
    htmlStr += '<p>Offer ' + (i+1) + ':<span class="close">x</span></p>';
    htmlStr += '<span>Purchase Price: <span class="answer">$' + optionsArray[i].purchasePrice +'</span></span><br>';
    htmlStr += '<span>Interest Rate: <span class="answer">' + optionsArray[i].intRate.toFixed(2) + '%</span></span><br>';
    htmlStr += '<span>Loan Term (months): <span class="answer">' + optionsArray[i].term + '</span></span><br>';
    htmlStr += '<span>Monthly Payment: <span class="answer">$' + monthPay.toFixed(2) + '</span></span><br>';
    htmlStr += '<span>Total cost of Ownership: <span class="answer">$' + totalCost.toFixed(2) + '</span></span><br>';
    loanCardElem.innerHTML = htmlStr;
    optionsElem.appendChild(loanCardElem);
    document.getElementsByClassName('close')[i].addEventListener("click", removeOption(i));
  }
}

function optionView() {
  var inputObj = {};
  var badInput = false;

  badInput = renderErrView();
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
