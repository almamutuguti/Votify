const user = JSON.parse(localStorage.getItem("LoggedInUser"));
if (!user || user.role !== "admin") {
    alert("Access denied. Admins only.");
    window.location.href = "login.html";
}

const form = document.getElementById("add-candidate-form");
const candidateList = document.getElementById("candidate-list");
const resultsList = document.getElementById("results-list");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = form.name.value.trim();
    const position = form.position.value.trim();
    const manifesto = form.manifesto.value.trim();

    if (!name || !position || !manifesto) return;

    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

    const exists = candidateList.some(c => c.name === name && c.position === position);
    if (exists) {
        alert("Candidate already exists for this position");
        return;
    }

    candidateList.push({name, position, manifesto});
    localStorage.setItem("candidates", JSON.stringify(candidates));

    form.reset();
    loadCandidates();
    loadResults();

});

function loadCandidates () {
    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
    candidateList.innerHTML = ""

    candidates.forEach((c, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
        <input type="text" value="${c.name} data-type="name" data-index="${index}" disabled>
        <input type="text" value="${c.position} data-type="position" data-index="${index}" disabled>
        <textarea data-type="manifesto" data-index="${index}" disabled>${c.manifesto}</textarea>
        <button onclick="enableEdit(${index})">Edit</button>
        <button onclick="saveEdit(${index})">Save</button>
        <button onclick="deleteCandidate(${index})">Delete</button>
        `;

        candidateList.appendChild(div);
    });

}

function enableEdit(index) {
    document.querySelectorAll(`[data-index="${index}"]`).forEach(el => el.disabled = false);

}

function saveEdit(index) {
    const inputs = document.querySelectorAll(`[data-index="${index}"]`);
    const name = inputs[0].value.trim();
    const position = inputs[1].value.trim();
    const manifesto = inputs[2].value.trim();

    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
    candidates[index] = {name, position, manifesto};
    localStorage.setItem("candidates", JSON.stringify(candidates));

    loadCandidates();
    loadResults();
}

function deleteCandidate(index) {
    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
    candidates.splice(index, 1);
    localStorage.setItem("candidates", JSON.stringify(candidates));
    loadCandidates();
    loadResults();
}

function loadResults() {
    const candidates= JSON.parse(localStorage.getItem("candidates")) || [];
    const users = JSON.parse(localStorage.getItem("users")) || [];


    //group by position
    const results = {};

    candidates.forEach(c => {
        if (!results[c.position]) {
            results[c.position] = {};
        }

        results[c.position][c.name] = 0;
    });

    users.forEach(u => {
        if (u.vote) {
            const [votedName, votedPosition] = u.vote.split("||");

            if (results[votedPosition] && results[votedPosition][votedName] !== undefined) {
                results[votedPosition][votedName]++;
            }
        }
    });

    resultsList.innerHTML = "";

    for (const position in results) {
        const section = document.createElement('div');
        section.innerHTML = `<strong>${position}</strong><ul>${
            Object.entries(results[position])
        .map(([name, count]) => `<li>${name}: ${count} voter(s)</li>`)
        .join("")}</ul>`;

        resultsList.appendChild(section);
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

loadCandidates();
loadResults();