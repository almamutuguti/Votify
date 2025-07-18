

function renderCandidates() {
    const candidatesList = document.getElementById("candidates-list");
    const candidates = JSON.parse(localStorage.getItem("candidates-list")) || [];


    candidatesList.innerHTML = ``;
    // candidates.forEach((c, index) => {
    //     const div = document.createElement("div");
    //     div.classList.add( "rounded-lg", "bg-gray-600",  "p-4", "flex", "flex-col", "items-center" , "text-white");

    //     div.innerHTML =
    //         `<img src="${c.profile}" alt="profile" class="h-32 object-cover rounded-full mb-4 w-32">
    //         <h2 class="text-3xl font-bold">${c.name}</h2>
    //         <h4 class="text-xl font-semibold">${c.position}</h4>
    //         <p class="text-sm">${c.email}</p>
    //         <p class="text-l">Click here to read the manifesto: <a href="${c.manifesto}">Read Manifesto</a></p>

    //         <button class="bg-red-600 text-white px-4 py-2 mt-4 rounded delete-btn" data-index="${index}"> Delete</button>

    //         `;

    //     candidatesList.appendChild(div);
    // });

    const grouped = {};
    candidates.forEach((c, index) => {
        if (!grouped[c.position]) {
            grouped[c.position] = [];
        }
        if (grouped[c.position].length < 3) {
            grouped[c.position].push({ ...c, index })
        }
    });

    Object.keys(grouped).forEach(position => {
        const section = document.createElement("div");
        section.classList.add("border-b", "border-gray-300", "pb-6", "mb-10");

        const title = document.createElement("h3");
        title.textContent = position;
        title.classList.add("text-3xl", "underline", "font-bold", "mb-4", "text-gray-800");

        const grid = document.createElement("div");
        grid.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6");

        grouped[position].forEach((c) => {
            const div = document.createElement("div");
            div.classList.add("rounded-lg", "bg-gray-300", "p-4", "flex", "flex-col", "items-center", "text-black", "shadow-2xl");

            div.innerHTML =
                `<img src="${c.profile}" alt="profile" class="h-32 object-cover rounded-full mb-4 w-32">
                <h2 class="text-3xl font-bold">${c.name}</h2>
                <h4 class="text-xl font-semibold">${c.position}</h4>
                <p class="text-sm">${c.email}</p>
                <p class="text-l">Click here to read the manifesto: <a href="${c.manifesto}" target="_blank" class="text-blue-400 hover:underline">Read Manifesto</a></p>

                <button class="bg-red-600 text-white px-4 py-2 mt-4 rounded delete-btn duration-700 ease-in-out hover:bg-red-400" data-index="${c.index}"> Delete</button>
                
            `;
            grid.appendChild(div);

        });
        section.appendChild(title);
        section.appendChild(grid);
        candidatesList.appendChild(section);
    });
    document.getElementById("candidate-form").reset();

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const index = this.getAttribute("data-index");
            let candidates = JSON.parse(localStorage.getItem("candidates-list")) || [];
            candidates.splice(index, 1);
            localStorage.setItem("candidates-list", JSON.stringify(candidates));
            renderCandidates();
        })
    })

}

document.addEventListener("DOMContentLoaded", renderCandidates);
const form = document.getElementById("candidate-form");
if (form) {
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("candidate-name").value;
        const position = document.getElementById("position").value;
        const email = document.getElementById("candidate-email").value;
        const manifesto = document.getElementById("manifesto").files[0];
        const profile = document.getElementById("profile-photo").files[0];
        const candidatesList = document.getElementById("candidates-list");

        const reader = new FileReader();

        reader.onload = function (e) {
            const profileURL = e.target.result;
            const manifestoURL = manifesto ? URL.createObjectURL(manifesto) : "";


            let candidates = JSON.parse(localStorage.getItem("candidates-list")) || [];

            candidates.push({ name, position, email, manifesto: manifestoURL, profile: profileURL });
            localStorage.setItem("candidates-list", JSON.stringify(candidates));

            renderCandidates();


        };

        if (profile) {
            reader.readAsDataURL(profile);
        }




    })
}


function renderVoteResults() {
    const resultsVisible = localStorage.getItem("resultsVisible") === "true";
    if (!resultsVisible) return;

    const candidates = JSON.parse(localStorage.getItem("candidates-list")) || [];
    const votes = JSON.parse(localStorage.getItem("votes-record")) || [];

    const resultsContainer = document.getElementById("results-list");
    resultsContainer.innerHTML = "";

    if (!votes.length) {
        resultsContainer.innerHTML = "<p class='text-center text-gray-500'>No votes have been submitted yet.</p>";
        return;
    }

    const candidateLookup = {};
    candidates.forEach((c, index) => {
        if (!candidateLookup[c.position]) candidateLookup[c.position] = {};
        candidateLookup[c.position][index] = c.name;
    });

    const voteCount = {};
    votes.forEach(vote => {
        Object.entries(vote).forEach(([position, index]) => {
            if (!voteCount[position]) voteCount[position] = {};
            voteCount[position][index] = (voteCount[position][index] || 0) + 1;
        });
    });



    Object.keys(voteCount).forEach(position => {
        const table = document.createElement("table");
        table.classList.add("w-full", "text-left", "border-collapse", "mb-10");

        const thead = document.createElement("thead");
        thead.innerHTML =
            `<tr class=""bg-gray-200 text-gray>
            <th class="py-2 px-4 border">Name</th>
            <th class="py-2 px-4 border">Position</th>
            <th class="py-2 px-4 border">Total Votes</th>
        </tr>`;

        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        Object.entries(voteCount).forEach(([position, candidatesMap]) => {
            Object.entries(candidatesMap).forEach(([index, count]) => {
                const name = candidateLookup[position][index];

                const row = document.createElement("tr");
                row.innerHTML =
                    `<td class="py-2 px-4 border">${name}</td>
                <td class="py-2 px-4 border">${position}</td>
                <td class="py-2 px-4 border text-center">${count}</td>
                `;
                tbody.appendChild(row);
            });

        });

        table.appendChild(tbody);
        resultsContainer.appendChild(table);

    });

}

// document.addEventListener("DOMContentLoaded", () => {
//     renderCandidates();
//     renderVoteResults();
// });

document.getElementById("logout-btn")?.addEventListener("click", () => {
    // Remove session-specific data
    localStorage.removeItem("hasVoted");
    localStorage.removeItem("user-votes");
    localStorage.removeItem("voteTime");

    //clear all if needed....localeStorage.clear()

    //redirect to the home page
    window.location.href = "index.html";

});


function publishResults() {
    localStorage.setItem("resultsVisible", "true");
    alert("Results are now available to voters.");
}

function renderAdminPreviewResults() {
    const candidates = JSON.parse(localStorage.getItem("candidates-list")) || [];
    const votes = JSON.parse(localStorage.getItem("votes-record")) || [];
    const container = document.getElementById("admin-preview-results");
    container.innerHTML = "";

    if (!votes.length) {
        container.innerHTML = "<p class='text-center text-gray-500'>No votes have been submitted yet.</p>";
        return;
    }

    const voteCount = {};
    const candidateLookup = {};

    candidates.forEach((c, i) => {
        if (!candidateLookup[c.position]) candidateLookup[c.position] = {};
        candidateLookup[c.position][i] = c.name;
    });
    votes.forEach(vote => {
        Object.entries(vote).forEach(([position, index]) => {
            if (!voteCount[position]) voteCount[position] = {};
            voteCount[position][index] = (voteCount[position][index] || 0) + 1;
        });
    });

    Object.entries(voteCount).forEach(([position, candidatesMap]) => {
        const section = document.createElement("div");
        section.innerHTML = `<h3 class="font-bold text-xl text-black mb-2">${position}</h3>`;

        const table = document.createElement("table");
        table.classList.add("w-full", "mb-4", "border");

        table.innerHTML =
            `<thead><tr class="bg-gray-200">
                <th class="p-2 border">Candidate</th>
                <th class="p-2 border">Total Votes</th>
            </tr></thead><tbody>
            ${Object.entries(candidatesMap)
                .map(([index, count]) => {
                    const name = candidateLookup[position][index];
                    return `<tr>
                <td class="p-2 border">${name}</td>
                <td class="p-2 border text-center">${count}</td>
            </tr>`;
                })
                .join("")}
            </tbody>`;

        section.appendChild(table);
        container.appendChild(section);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCandidates();
    renderAdminPreviewResults();
});








