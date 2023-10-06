const passBox = document.getElementById("password");
const button = document.getElementById("button");
const copy = document.getElementById("copy");

const lowerCase = "abcdefghijklmnopqrstuvwxyz";
const upperCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const symbol = "!@#$%^&*()_+{}<>/";
const number = "0123456789";

const allChars = lowerCase + upperCase + symbol + number;

function createPass() {
  const minLength = 8;
  const maxLength = 20;
  const randomLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let password = "";

  password = password + lowerCase[Math.floor(Math.random() * lowerCase.length)];
  password = password + upperCase[Math.floor(Math.random() * upperCase.length)];
  password = password + symbol[Math.floor(Math.random() * symbol.length)];
  password = password + number[Math.floor(Math.random() * number.length)];

  while (randomLength > password.length) {
    password = password + allChars[Math.floor(Math.random() * allChars.length)];
  }
  passBox.value = password;
  copy.setAttribute("aria-disabled", "false"); // teoretycznie zabezpieczenie przed pustym li po resecie, ale do sprawdzenia
}

button.addEventListener("click", createPass);

let lastCopiedPassword = "";
let tooltipTimeOut;

function copyPass() {
  const newPassword = passBox.value;
  //zabezpieczenie przed duplikacją

  navigator.clipboard.writeText(newPassword).then(
    () => {
      tooltip.style.display = "block";
      if (tooltipTimeOut) clearTimeout(tooltipTimeOut); //reset
      tooltipTimeOut = setTimeout(function () {
        tooltip.style.display = "none";
      }, 2000); //asynchroniczny tooltip

      if (newPassword === lastCopiedPassword) return;
      if (!newPassword) return;
      const passwordList = document.getElementById("password-list");
      const lastPasswords = document.querySelector(".last-passwords h2");
      const listItem = document.createElement("li");

      listItem.textContent = newPassword;
      passwordList.appendChild(listItem);
      passwordList.insertBefore(listItem, passwordList.firstChild); // Dodanie nowego hasła na początek listy

      const listItems = passwordList.getElementsByTagName("li");
      // ustawienie limitu dla wyświetlanych li do 5
      if (listItems.length > 5) {
        passwordList.removeChild(listItems[5]); // usuwanie najstarszego elementu z listy
      }

      lastPasswords.style.display = "block";

      lastCopiedPassword = newPassword;
      savePasswordToLocalStorage(newPassword); // localstorage
    },
    () => {
      console.error("Failed to copy");
    }
  );
}

copy.addEventListener("click", copyPass);

function savePasswordToLocalStorage(password) {
  // Pobierz istniejące hasła z localStorage lub utwórz pustą tablicę
  let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

  // Dodanie hasła do tablicy
  passwords.unshift(password);

  if (passwords.length > 5) {
    passwords.pop(); // Usuń najstarsze hasło
  }

  // zapisz zaktualizowaną listę z powrotem do localStorage
  localStorage.setItem("passwords", JSON.stringify(passwords));
}

// funkcja do wczytywania i wyświetlania haseł z localStorage podczas ładowania strony
function loadPasswordsFromLocalStorage() {
  const passwords = JSON.parse(localStorage.getItem("passwords")) || [];
  const passwordList = document.getElementById("password-list");
  const lastPasswords = document.querySelector(".last-passwords h2");

  // wypełnij listę haseł zapisanymi hasłami
  passwords.forEach((password) => {
    const listItem = document.createElement("li");
    listItem.textContent = password;
    passwordList.appendChild(listItem);
  });

  // wyświetl sekcję ostatnich haseł, jeśli są zapisane
  if (passwords.length > 0) {
    lastPasswords.style.display = "block";
  }
}

// Wywołanie funkcji do wczytywania zapisanych haseł podczas ładowania strony
window.addEventListener("load", loadPasswordsFromLocalStorage);

function clearPassword() {
  const passwordList = document.getElementById("password-list");
  const lastPasswords = document.querySelector(".last-passwords h2");
  localStorage.removeItem("passwords");
  passwordList.innerHTML = "";
  passBox.value = "";

  lastPasswords.style.display = "none";

  tooltipclear.style.display = "block";
  setTimeout(function () {
    tooltipclear.style.display = "none";
  }, 2000);
}

// Przykład wywołania funkcji do usuwania haseł z localStorage
const clearButton = document.getElementById("clear-button");

clearButton.addEventListener("click", () => {
  clearPassword();
});
