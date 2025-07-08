document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();

    const form = e.target;
    const identifier = form.identifier.value.trim();
    const password = form.password.value;
    const remember = form.remember.checked;

    //retrieve saved users
    const users =JSON.parse(localStorage.getItem("users")) || [];

    //match by email or username
    const user = users.find(u => (u.email === identifier || u.username === identifier)
    && u.password === password
    );

    if (user) {
        //save session
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        if (remember) {
            localStorage.setItem("rememberMe", "true");
        } else {
            localStorage.setItem("rememberMe");
        }

        alert(`Welcome, ${user.username}!`);
        window.location.href = "ballot.html" //redirect after login successfully
    } else {
        alert("Invalid username/email or password.")
    }

})