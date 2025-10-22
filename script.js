const API_URL = "https://script.google.com/macros/s/AKfycbwELaIFgk_a83u2uxbxT2nfaHRuuVzVVUfzI2CunauNt2TsGsTxp6XPr-a3mgcmGkfEMQ/exec";

const loginInput = document.getElementById("login");
const checkBtn = document.getElementById("checkLogin");
const passwordSection = document.getElementById("passwordSection");
const passwordInput = document.getElementById("password");
const submitBtn = document.getElementById("submitBtn");
const message = document.getElementById("message");

let currentLogin = "";
let isNewUser = false;

// === Проверка логина ===
checkBtn.onclick = async () => {
  const login = loginInput.value.trim();
  if (!login) return alert("Введите логин");

  message.textContent = "Проверяем...";
  passwordSection.style.display = "none";

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "checkLogin",
        login
      })
    });

    const data = await res.json();

    if (data.status === "not_found") {
      message.textContent = "Пользователь не найден ❌";
      return;
    }

    currentLogin = login;
    isNewUser = data.status === "new_user";

    passwordSection.style.display = "block";
    submitBtn.textContent = isNewUser ? "Установить пароль" : "Войти";
    message.textContent = isNewUser
      ? "Первый вход — придумайте пароль 🔒"
      : "Введите пароль 🔑";
  } catch (err) {
    console.error(err);
    message.textContent = "Ошибка соединения ❗";
  }
};

// === Установка / ввод пароля ===
submitBtn.onclick = async () => {
  const password = passwordInput.value.trim();
  if (!password) return alert("Введите пароль");

  const payload = {
    action: isNewUser ? "setPassword" : "login",
    login: currentLogin,
    password
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.success) {
      message.textContent = "✅ Успешный вход";
      localStorage.setItem("login", currentLogin);
      // можно добавить редирект:
      // window.location.href = "store.html";
    } else {
      message.textContent =
        data.error === "wrong_password"
          ? "❌ Неверный пароль"
          : data.error === "password_already_set"
          ? "⚠️ Пароль уже установлен"
          : "⚠️ Ошибка";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "Ошибка соединения ❗";
  }
};
