// Fetching Data from HTML
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";

let password = "";
let passwordLength = 10;
let checkCount = 0;
setIndicator("#ccc");

handleSlider();

function handleSlider() {
  inputSlider.value = passwordLength;
  lengthDisplay.innerText = passwordLength;
  const min = inputSlider.min;
  const max = inputSlider.max;
  inputSlider.style.backgroundSize = ( (passwordLength - min) * 100 / (max - min)) + "% 100%"
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  //shadow
  indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomInteger() {
  return getRndInteger(0, 9);
}

function generateLowercase() {
  return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
  return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength() {
  let hasUpper = uppercaseCheck.checked;
  let hasLower = lowercaseCheck.checked;
  let hasNum = numbersCheck.checked;
  let hasSym = symbolsCheck.checked;
  const passwordLength = passwordDisplay.value.length;

  // Debugging logs
  console.log("hasUpper:", hasUpper);
  console.log("hasLower:", hasLower);
  console.log("hasNum:", hasNum);
  console.log("hasSym:", hasSym);
  console.log("passwordLength:", passwordLength);

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0"); // Strong password
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setIndicator("#ffe"); // Medium strength password
  } else {
    setIndicator("#f00"); // Weak password
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText = "copied";
  } catch (e) {
    copyMsg.innerText = "Failed";
  }

  copyMsg.classList.add("active");

  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 2000);
}

function shufflePassword(array) {
  // Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked) checkCount++;
  });

  // If pass length is 1 and checkbox count is 4
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
  }
  handleSlider();
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

inputSlider.addEventListener("input", (e) => {
  passwordLength = e.target.value;
  handleSlider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) copyContent();
});

generateBtn.addEventListener("click", () => {
  // Ensure at least one checkbox is selected
  if (checkCount <= 0) return;

  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }

  // Initialize the password string
  password = "";

  // Array to hold the functions based on selected checkboxes
  let funcArr = [];
  if (uppercaseCheck.checked) {
    funcArr.push(generateUppercase);
  }
  if (lowercaseCheck.checked) {
    funcArr.push(generateLowercase);
  }
  if (numbersCheck.checked) {
    funcArr.push(generateRandomInteger);
  }
  if (symbolsCheck.checked) {
    funcArr.push(generateSymbol);
  }

  // Generate the mandatory characters (one from each selected category)
  let mandatoryChars = [];
  funcArr.forEach((func) => {
    mandatoryChars.push(func());
  });

  // Fill the remaining characters randomly from the selected categories
  for (let i = 0; i < passwordLength - mandatoryChars.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    password += funcArr[randIndex]();
  }

  // Combine mandatory characters and remaining characters
  password += mandatoryChars.join("");

  // Shuffle the generated password
  password = shufflePassword(Array.from(password));

  // Display the password
  passwordDisplay.value = password;

  // Calculate Strength
  calcStrength();
});
