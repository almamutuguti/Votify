document.getElementById("register-form").addEventListener("submit", function (e){
    e.preventDefault();

    const form = e.target;
    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    if (password !== confirmPassword) {
        alert('passwords do not match!');
        return;
    }

    const user = {username, email, password};

    //get existing users or initialize empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];

    //check if email or username already exists
    const emailExists = users.some(user => user.email === email);
    const usernameExists = users.some(user => user.username === username);

    if (emailExists) {
        alert("This email already registered.");
        return;
    }

    if (usernameExists) {
        alert("This username already taken.");
        return;
    }

    const newUser = {
        username: username,
        email: email,
        password: password
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered successfully! You can now log in");
    window.location.href = "login.html"
})