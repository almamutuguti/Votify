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

//     // --- LOGIC FOR LOGIN.HTML ---
//     if (currentPage === 'user.html') {
//         // If user is already logged in, redirect to index.html
//         if (sessionStorage.getItem('loggedInUser')) {
//             window.location.href = 'ballot.html';
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
//                 window.location.href = 'ballot.html';
//             } else {
//                 showMessage('Invalid email or password', true);
//             }
//         });
//     }

//     // --- LOGIC FOR INDEX.HTML ---
//     if (currentPage === 'welcome.html') {
//         const loggedInUser = sessionStorage.getItem('loggedInUser');

//         // If no user is logged in, redirect to login page
//         if (!loggedInUser) {
//             window.location.href = 'user.html';
//             return; // Stop further script execution
//         }

//         const welcomeUser = document.getElementById('welcome-user');
//         const logoutButton = document.getElementById('logout');

//         welcomeUser.textContent = loggedInUser;

//         logoutButton.addEventListener('click', () => {
//             sessionStorage.removeItem('loggedInUser');
//             window.location.href = 'login.html';
//         });
//     }
// });

// document.getElementById("logout-btn")?.addEventListener("click", () => {
//     // Remove session-specific data
//     localStorage.removeItem("hasVoted");
//     localStorage.removeItem("user-votes");
//     localStorage.removeItem("voteTime");

//     //clear all if needed....localeStorage.clear()

//     //redirect to the home page
//     window.location.href = "index.html";
   
// });


document.getElementById("login-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const status = document.getElementById("status");

    users = JSON.parse(localStorage.getItem("userList")) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        status.textContent = "Invalid Credentials";
        return;
    }

    localStorage.setItem("loggedInUser", JSON.stringify(user));

    if (user.role === "admin") {
        window.location.href = "admin.html";
    } else {
        window.location.href = "ballot.html"
    }
});

       