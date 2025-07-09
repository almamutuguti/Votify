const { jsx } = require("react/jsx-runtime");

const user = JSON.parse(localStorage.getItem("loggedInUser"));


if (!user) {
    alert("Please log in to vote.");
    window.location.href = "login.html";
}

document.getElementById("welcome").textContent = `Welcome, ${user.username}.Cast your votes below:`;

const form = document.getElementById("vote-form");
const container = document.getElementById("positions-container");

const candidates = JSON.parse(localStorage.getItem("candidates")) || [];


//Check if user voted
if (user.votes && Object.keys(user.votes).length > 0) {
    container.innerHTML = `<p>You have already voted.Thank you!</p>`;
    form.querySelector("button[type='submit']").disabled = true;
} else {
    // group candidates per position
    const position = {};
    candidates.forEach(c => {
        if (!positions[c.position]) positions[c.position] = [];
        positions[c.position].push(c);
    });

    // form
    for (const position in positions) {
        const section = document.createElement("div");
        section.innerHTML = `<h3>${position}</h3>`

        positions[position].forEach(c => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="radio" name="${position}" value="${c.name}"||${c.position} required>
            <strong>${c.name}</strong>: ${c.manifesto}
            `;

            section.appendChild(label);
            section.appendChild(document.createElement("br"));
        });

        container.appendChild(section);
        
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new formData(form);
        const votes = {};
        const selectedPosition = [];

        for (const [position, value] of formData.entries()) {
            if (selectedPosition.includes(position)) {
                alert(`You have selected more than one candidate for ${position}. Only one vote allowed.`);
                return;
            }
            selectedPosition.push(position);
            const [name, pos] = value.split("||");
            votes[pos] = `${name}||${pos}`;
        }

        //check all positions have been voted for
        if (Object.keys(votes).length < Object.keys(positions).length) {
            alert("Please vote for all available positions.");
            return;
        }

        // update user in users list
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users = users.map(u => {
            if (u.email === user.email) {
                return { ...u, votes };
            }

            return u;
        });

        localStorage.setItem("users", JSON.stringify(users));
        localStorage.setItem("loggedInUser", JSON.stringify({ ...user, votes }));

        alert("Your votes have been submitted!");
        window.location.href = "thankyou.html";
    });
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

