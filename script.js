"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Chinthaparthi Sunil Reddy ",
  movements: [200, 4000, -400, 3000, -800, -120, 70, 160],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Priya Reddy",
  movements: [3000, 3400, -150, -800, -3500, -1000, 900, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Sreenivas Kummara ",
  movements: [200, -200, 340, -300, -20, 100, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sowmya Marrikagari",
  movements: [430, 1000, 700, 50, 90, 500],
  interestRate: 1,
  pin: 4444,
};
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const moves = sort ? movements.slice().sort((a, b) => a - b) : movements;
  moves.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
////////////////////////////
///////////////////show balance
////////////////////////////////////////
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

///////////////////////
//----------labal values
//////////////
const calcDisplaySummery = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${out}€`;

  const intrest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${intrest}€`;
};

//////////////////////////Genarating usernames
///////////////////////////////////////////////
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUserNames(accounts);

///////////////////////////
const updateUi = function (acc) {
  // -----------------------------------------------------display balance
  calcDisplayBalance(acc);
  // -----------------------------------------------------display movements
  displayMovements(acc.movements);
  //---------------------------------------------------------display summery
  calcDisplaySummery(acc);
  // console.log("login");
};
// ----------------------------------------------event listerners /////////
//  IMPLIMENTING LOIGIN FUNCTIONALLITY

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // display ui and welcome message
    labelWelcome.textContent = `wlcome Back ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;
    // clear the input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    updateUi(currentAccount);
  }
});

//////////////////////////////transfering money

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const revcieverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    revcieverAcc &&
    currentAccount.balance >= amount &&
    revcieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    revcieverAcc.movements.push(amount);
    updateUi(currentAccount);
  }
});

/////////////////-----------------REQUESTING MONEY FROM BANK
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount / 10)
  ) {
    currentAccount.movements.push(amount);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
});

///////////////////////////////deleting account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    // console.log(index);

    // hide ui
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

let sortMov = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sortMov);
  sortMov = !sortMov;
});

/////////////////////////////////////////
//////////////GETTING MAXIMUM VALUE
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]);

// console.log(max);
///////////////////??//////////////////////////
/////////////
////////////////////////////////////////////////

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });
// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// const balace = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balace);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// PRACTICE

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];

// // slice operator
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]); //breat operator

// splice operator
// console.log(arr);
// arr.splice(-1);
// console.log(arr);

// console.log(arr.splice(1, 2));
// console.log(arr);

// Reverse
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2); //which mutates the actual array

// //concat
// const letters = arr.concat(arr2);
// console.log(letters);
// //or
// console.log([...arr, ...arr2]);

// console.log(letters.join('-'));

////////////////

// FOR-of METHOD

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     // console.log(`your account credited by ${movement}`);
//   } else {
//     // console.log(`your account debited  by ${Math.abs(movement)}`);
//   }
// }
// console.log('----------FOR EACH------------');
// //FOR - EACH METHOD

// movements.forEach(function (movement) {
//   if (movement > 0) {
//     // console.log(`your account credited by ${movement}`);
//   } else {
//     // console.log(`your account debited  by ${Math.abs(movement)}`);
//   }
// });

// // ACCESING INDEX OF THE ARRAY

// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     // console.log(`movement ${i + 1} your account credited by ${movement}`);
//   } else {
//     console
//       .log
//       // `movement ${i + 1} your account debited by ${Math.abs(movement)}`
//       ();
//   }
// }

// //forEach method
// console.log('-------FOR EACH INDEX');
// movements.forEach(function (movement, i, arr) {
//   if (movement > 0) {
//     // console.log(`movement ${i + 1} your account credited by ${movement}`);
//   } else {
//     console
//       .log
//       // `movement ${i + 1} your account debited by ${Math.abs(movement)}`
//       ();
//   }
// });

//////////////////
// MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// // sets

// const currenciesUnique = ['USD', 'EUR', 'EUR', 'USD', 'GBP'];
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

// const eurToUsd = 1.1;
// const movementsUsd = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// console.log(movements);
// console.log(movementsUsd);

/// coding challege
////////////////////

// const ages = [5, 2, 4, 1, 15, 8, 3];

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter(age => age >= 18);

//   console.log(humanAges);
//   console.log(adults);
//   console.log(average);
// };

// const age1 = calcAverageHumanAge(ages);
// const calcAverage = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age) / arr.length;
// console.log(calcAverage(ages));

///find method ---which is not gonna give new array like filter method but it gives only the first element of the array
// const firstWithdrawl = movements.find((mov) => mov < 0);
// console.log(firstWithdrawl);

// const account = accounts.find((acc) => acc.owner === "Jessica Davis");
// console.log(account);
