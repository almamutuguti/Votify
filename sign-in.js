// document.addEventListener('DOMContentLoaded', () => {

//     const saltRounds = 10;
//     const dbName = 'localUserDB_username_email';

//     // --- UTILITY FUNCTIONS ---
//     function getUsers() {
//         const users = localStorage.getItem(dbName);
//         return users ? JSON.parse(users) : [];
//     }

//     function saveUsers(users) {
//         localStorage.setItem(dbName, JSON.stringify(users));
//     }

//     function showMessage(message, isError = false) {
//         const messageBox = document.getElementById('message-box');
//         if (messageBox) {
//             messageBox.textContent = message;
//             messageBox.className = `mt-4 p-4 rounded-lg text-center text-white font-bold ${isError ? 'bg-red-500' : 'bg-green-500'}`;
//             messageBox.classList.remove('hidden');
//             setTimeout(() => {
//                 messageBox.classList.add('hidden');
//             }, 3000);
//         }
//     }

//     // --- PAGE-SPECIFIC LOGIC ---
//     const currentPage = window.location.pathname.split('/').pop();

//     // --- LOGIC FOR ADMIN-SIGN-IN.HTML ---
//     if (currentPage === 'admin-sign-in.html') {
//         // If user is already logged in, redirect to index.html
//         if (sessionStorage.getItem('loggedInUser')) {
//             window.location.href = 'admin.html';
//         }

//         const loginFormContainer = document.getElementById('login-form-container');
//         const registerFormContainer = document.getElementById('register-form-container');
//         const loginForm = document.getElementById('login-form');
//         const registerForm = document.getElementById('register-form');
//         const showRegisterLink = document.getElementById('show-register');
//         const showLoginLink = document.getElementById('show-login');

//         function toggleForms() {
//             loginFormContainer.classList.toggle('hidden');
//             registerFormContainer.classList.toggle('hidden');
//         }

//         showRegisterLink.addEventListener('click', (e) => {
//             e.preventDefault();
//             toggleForms();
//         });

//         showLoginLink.addEventListener('click', (e) => {
//             e.preventDefault();
//             toggleForms();
//         });

//         registerForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const username = e.target.username.value;
//             const email = e.target.email.value;
//             const password = e.target.password.value;

//             if (!username || !email || !password) {
//                 showMessage('Username, email, and password are required', true);
//                 return;
//             }

//             const users = getUsers();
//             if (users.find(user => user.email === email)) {
//                 showMessage('An account with this email already exists', true);
//                 return;
//             }
//             if (users.find(user => user.username === username)) {
//                 showMessage('Username is already taken', true);
//                 return;
//             }

//             const salt = dcodeIO.bcrypt.genSaltSync(saltRounds);
//             const hashedPassword = dcodeIO.bcrypt.hashSync(password, salt);
//             const newUser = { username, email, password: hashedPassword };
//             users.push(newUser);
//             saveUsers(users);

//             showMessage('Registration successful! Please login.');
//             toggleForms();
//             registerForm.reset();
//         });

//         loginForm.addEventListener('submit', (e) => {
//             e.preventDefault();
//             const email = e.target.email.value;
//             const password = e.target.password.value;

//             if (!email || !password) {
//                 showMessage('Email and password are required', true);
//                 return;
//             }

//             const users = getUsers();
//             const user = users.find(u => u.email === email);

//             if (user && dcodeIO.bcrypt.compareSync(password, user.password)) {
//                 // On successful login, save user session and redirect
//                 sessionStorage.setItem('loggedInUser', user.username);
//                 window.location.href = 'admin.html';
//             } else {
//                 showMessage('Invalid email or password', true);
//             }
//         });
//     }

//     // --- LOGIC FOR INDEX.HTML ---
//     if (currentPage === 'admin.html') {
//         const loggedInUser = sessionStorage.getItem('loggedInUser');

//         // If no user is logged in, redirect to login page
//         if (!loggedInUser) {
//             window.location.href = 'admin-sign-in.html';
//             return; // Stop further script execution
//         }

//         const welcomeUser = document.getElementById('welcome-user');
//         const logoutButton = document.getElementById('logout');

//         welcomeUser.textContent = loggedInUser;

//         logoutButton.addEventListener('click', () => {
//             sessionStorage.removeItem('loggedInUser');
//             window.location.href = 'admin-sign-in.html';
//         });
//     }
// });

document.getElementById("register-form").addEventListener('submit', (e) => {
    e.preventDefault();
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const role = document.getElementById("role").value
        const status = document.getElementById("status");

        if (!name || !email || !password) {
            status.textContent = "All fields are required";
            return;
        }

        const users = JSON.parse(localStorage.getItem("userList")) || [];
        const existing = users.find(user => user.email === email);

        if (existing) {
            status.textContent = "This email is already registered.";
            return;
        }

        users.push({ name, email, password, role });
        localStorage.setItem("userList", JSON.stringify(users));
        window.location.href = "user.html";

    
})

document.getElementById("register-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;
  const status = document.getElementById("status");

  if (!name || !email || !password) {
    status.textContent = "All fields are required.";
    return;
  }

  const users = JSON.parse(localStorage.getItem("userList")) || [];
  const existing = users.find(u => u.email === email);

  if (existing) {
    status.textContent = "This email is already registered.";
    return;
  }

  users.push({ name, email, password, role });
  localStorage.setItem("userList", JSON.stringify(users));
  window.location.href = "login.html";
});