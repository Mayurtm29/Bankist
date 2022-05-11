"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

const account1 = {
  owner: "Mayur Mali",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2021-12-18T21:31:17.178Z",
    "2022-01-23T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-02-01T10:17:24.185Z",
    "2022-02-08T14:11:59.604Z",
    "2022-03-28T17:01:17.194Z",
    "2022-03-30T23:36:17.929Z",
    "2022-04-02T10:51:36.790Z",
  ],
  currency: "INR",
  locale: "en-IN",
};

const account2 = {
  owner: "Samarth Mali",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2021-11-01T13:15:33.035Z",
    "2021-11-30T09:48:16.867Z",
    "2021-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-03-10T14:43:26.374Z",
    "2022-03-25T18:49:59.371Z",
    "2022-04-02T12:01:20.894Z",
  ],
  currency: "JPY",
  locale: "ja-JP",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

const lgScreen = document.querySelector(".lg-screen");
const lgScreen1 = document.querySelector(".lg-screen-1");
const loginNav = document.querySelector(".nav-login");

const btnLogout = document.querySelector(".logout");

const errorLogin = document.querySelector(".err-message-login");

/////////////////////////////////////////////////
// Functions/

/**
 * format dates
 */
const formatMovementDate = function (date, locale) {
  // dates
  const caldays = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const dayspassed = caldays(new Date(), date);
  // console.log(dayspassed);
  if (dayspassed === 0) return "Today";

  if (dayspassed === 1) return "Yesterday";

  if (dayspassed <= 7) return `${dayspassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};
/**
 * format currency
 */
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

/**
 * display movements
 */
const displayMovements = function (acc, sort = false) {
  //clearing value
  containerMovements.innerHTML = "";

  //sorting
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  //dispalying movment
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    //date
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    // number formatter
    const formatter = formatCurrency(mov, acc.locale, acc.currency);

    // displayig movements
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatter}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// displayMovements(account1.movements);
// console.log(accounts);

/**
 * showing balance
 */
const calBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;

  // currency formatter
  const formatter = formatCurrency(balance, acc.locale, acc.currency);

  labelBalance.textContent = ` ${formatter}`;
};

// calBalance(account1.movements);

/**
 * Display Summary
 */
const displaySummary = function (acc) {
  // Display In
  const totalIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(totalIn, acc.locale, acc.currency);

  // display Out
  const totalOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + Math.abs(mov), 0);
  labelSumOut.textContent = formatCurrency(totalOut, acc.locale, acc.currency);

  //Interest
  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

// displaySummary(account1.movements);

/**
 * creating username
 */
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
    /*.map => creates the array of first character of name ["m","m"] 
        after join eg. mayur mali => mm */
  });
};

createUsername(accounts);

/**
 * update ui
 */
const upadteUI = function (acc) {
  // diaplay movements
  displayMovements(acc);

  // display balance
  calBalance(acc);

  // display summary
  displaySummary(acc);
};

/**
 * Start Logout Timer
 */
const startLogout = function () {
  const tick = () => {
    //converting time into min and sec
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //update time on ui
    labelTimer.textContent = `${min}:${sec}`;

    //logout
    if (time === 0) {
      labelTimer.textContent = `${min}:${sec}`;
      clearInterval(timer);
      containerApp.style.display = "none";
      lgScreen.style.display = "block";
      lgScreen1.style.display = "flex";
      loginNav.style.display = "none";
    }

    // decrease
    time--;
  };
  let time = 600;

  tick();

  const timer = setInterval(tick, 1000);

  return timer;
};

/**
 * Event Handler
 */
let currentAccount, timer;
//fake login for dev perpose
// currentAccount = account1;
// upadteUI(currentAccount);
// containerApp.style.opacity = 1;

//login
btnLogin.addEventListener("click", function (e) {
  // prevent form From submitting
  e.preventDefault();
  //Login
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    //displaying ui
    containerApp.style.display = "grid";
    lgScreen.style.display = "none";
    lgScreen1.style.display = "none";
    loginNav.style.display = "flex";

    //Logout Timer
    if (timer) clearInterval(timer); //if timer has value them clear it if doesn't them assign timer⬇️
    timer = startLogout();

    //current date
    // const local = navigator.language;
    let now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
      // weekday: 'long',
    };
    setInterval(() => {
      now = new Date();
      labelDate.textContent = new Intl.DateTimeFormat(
        currentAccount.locale,
        options
      ).format(now);
    }, 1000);

    // display messege
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(" ")[0]
    }!`;

    //upadte UI
    upadteUI(currentAccount);

    //clear input fileds
    inputLoginUsername.value = inputLoginPin.value = "";
  } else {
    errorLogin.style.display = "block";
    inputLoginUsername.classList.add("wrongdetails");
    inputLoginPin.classList.add("wrongdetails");
    setTimeout(() => {
      errorLogin.style.display = "none";
      inputLoginUsername.classList.remove("wrongdetails");
      inputLoginPin.classList.remove("wrongdetails");
    }, 6000);
  }
});
/**
 * transfer
 */
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  //clear input field
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username //optional chaning "?"
  ) {
    //transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(
      receiverAcc.username === "sm" ? amount * 1.68149 : amount * 0.594701
    );

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    //Upadte UI
    upadteUI(currentAccount);
  } else {
    alert("Invalid Details");
  }
  //reset Timer
  clearInterval(timer);
  timer = startLogout();
});

/**
 * Close Account
 */
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    //delete account
    accounts.splice(index, 1);

    //Hide ui
    containerApp.style.display = "none";
    lgScreen.style.display = "block";
    lgScreen1.style.display = "flex";
    loginNav.style.display = "none";
    errorLogin.style.display = "none";
    inputLoginUsername.classList.remove("wrongdetails");
    inputLoginPin.classList.remove("wrongdetails");
  } else {
    alert("Enter Valid Details");
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

/**
 * Loan
 */
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //timeout
    setTimeout(() => {
      //Adding Loan to account
      currentAccount.movements.push(amount);

      //add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      // receiverAcc.movementsDates.push(new Date());

      //Update UI
      upadteUI(currentAccount);
    }, 3000);
  } else {
    alert("Enter Valid Amount");
  }

  inputLoanAmount.value = "";

  //reset Timer
  clearInterval(timer);
  timer = startLogout();
});

btnLogout.addEventListener("click", function (e) {
  e.preventDefault();

  // logout
  containerApp.style.display = "none";
  lgScreen.style.display = "block";
  lgScreen1.style.display = "flex";
  loginNav.style.display = "none";
  errorLogin.style.display = "none";
  inputLoginUsername.classList.remove("wrongdetails");
  inputLoginPin.classList.remove("wrongdetails");
});
