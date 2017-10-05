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

function validateElement(element) {
  return function() {
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
  };
}

function optionView() {
  console.log("optionView");
};

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
