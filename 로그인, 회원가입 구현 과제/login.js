const bcrypt = require("bcrypt");

async function register() {
    const email = document.getElementById("signup-email").value.toLowerCase();
    const password = document.getElementById("signup-password").value;

    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (users[email]) {
        document.getElementById("message").innerText = "❌ 이미 가입된 이메일입니다.";
    } else {
        const hashedPassword = await bcrypt.hash(password, 10); // 🔥 비밀번호 해시화
        users[email] = hashedPassword; // 🔥 해시된 비밀번호 저장
        localStorage.setItem("users", JSON.stringify(users));

        document.getElementById("message").innerText = "✅ 회원가입 성공!";
        
        setTimeout(() => {
            showPage("login"); // 🔥 2초 후 로그인 화면으로 이동
        }, 2000);
    }
}

async function login() {
    const email = document.getElementById("login-email").value.toLowerCase();
    const password = document.getElementById("login-password").value;
    let users = JSON.parse(localStorage.getItem("users")) || {};

    if (!users[email]) {
        document.getElementById("message").innerText = "❌ 회원가입되지 않은 이메일입니다.";
    } else {
        const hashedPassword = users[email];
        const match = await bcrypt.compare(password, hashedPassword); // 🔥 비밀번호 비교

        if (match) {
            document.getElementById("message").innerText = "✅ 로그인 성공! 환영합니다.";
            sessionStorage.setItem("loggedInUser", email); // 🔥 세션 스토리지 저장
            showPage("home"); // 로그인 후 홈 화면으로 이동
        } else {
            document.getElementById("message").innerText = "❌ 비밀번호가 틀렸습니다.";
        }
    }
}

function showPage(pageId) {
    console.log(`Navigating to: ${pageId}`);

    // 홈 화면으로 이동하면 자동 로그아웃
    if (pageId === "home") {
        sessionStorage.removeItem("loggedInUser"); // 🔥 로그인 정보 초기화
    }

    document.getElementById("home").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("signup").style.display = "none";
    document.getElementById(pageId).style.display = "block";
}

document.addEventListener("DOMContentLoaded", function() {
    if (sessionStorage.getItem("loggedInUser")) {
        showPage("home"); // 🔥 세션 데이터 기반 자동 로그인
    }
});

function logout() {
    sessionStorage.removeItem("loggedInUser"); // 🔥 로그인 정보 삭제
    showPage("home"); // 홈 화면으로 이동
}
