

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
            grouped[c.position].push({...c, index})
        }
    });

    Object.keys(grouped).forEach(position => {
        const section = document.createElement("div");
        section.classList.add("border-b", "border-gray-300", "pb-6", "mb-10");

        const title = document.createElement("h3");
        title.textContent = position;
        title.classList.add("text-2xl", "font-bold", "mb-4", "text-gray-800" );

        const grid = document.createElement("div");
        grid.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6");

        grouped[position].forEach((c) => {
            const div = document.createElement("div");
            div.classList.add( "rounded-lg", "bg-gray-600",  "p-4", "flex", "flex-col", "items-center" , "text-white");

            div.innerHTML =
            `<img src="${c.profile}" alt="profile" class="h-32 object-cover rounded-full mb-4 w-32">
            <h2 class="text-3xl font-bold">${c.name}</h2>
            <h4 class="text-xl font-semibold">${c.position}</h4>
            <p class="text-sm">${c.email}</p>
            <p class="text-l">Click here to read the manifesto: <a href="${c.manifesto}" target="_blank">Read Manifesto</a></p>

            <button class="bg-red-600 text-white px-4 py-2 mt-4 rounded delete-btn" data-index="${c.index}"> Delete</button>
                
            `;
            grid.appendChild(div);

        });
        section.appendChild(title);
        section.appendChild(grid);
        candidatesList.appendChild(section);
    });
    document.getElementById("candidate-form").reset();

    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            let candidates = JSON.parse(localStorage.getItem("candidates-list")) || [];
            candidates.splice(index, 1);
            localStorage.setItem("candidates-list", JSON.stringify(candidates));
            renderCandidates();
        })
    })

}

document.addEventListener("DOMContentLoaded", renderCandidates);
document.getElementById("candidate-form").addEventListener("submit", function (event) {
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
    
});

function renderVoteResults() {
    const candidates = JSON.parse(localStorage.getItem("candidates-list")) || [];
    const votes = JSON.parse(localStorage.getItem("votes-record")) || [];

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

    const resultsContainer = document.getElementById("results-list");
    resultsContainer.innerHTML = "";

    Object.keys(voteCount).forEach(position => {
        const section = document.createElement("div");
        section.classList.add("mb-10", "p-4", "border-b", "border-gray-300");

        const title = document.createElement("h3");
        title.textContent = `Results for ${position}`;
        title.classList.add("text-xl", "font-bold", "mb-4", "text-gray-700");
        section.appendChild(title);

        const list = document.createElement("ul");
        Object.entries(voteCount[position]).forEach(([index, count]) => {
            const name = candidateLookup[position][index];
            const item = document.createElement("li");
            item.textContent = `${name}: ${count} vote${count !== 1 ? "s" : ""} `;
            item.classList.add("mb-2", "text-gray-600")
            list.appendChild(item)
        });

        section.appendChild(list);
        resultsContainer.appendChild(section);

    });

}

document.addEventListener("DOMContentLoaded", () => {
    renderCandidates();
    renderVoteResults();
});





