let grouped = {} ;
function renderVotingForm() {
    const form = document.getElementById("voting-form");
    const candidates = JSON.parse(localStorage.getItem("candidates-list"))

    
    candidates.forEach((c, index) => {
        if (!grouped[c.position]) {
            grouped[c.position] = [];
        }
        grouped[c.position].push({...c, index});
        
    });

    Object.keys(grouped).forEach(position => {
        const section = document.createElement("div");
        section.classList.add("border-b", "border-gray-300", "pb-6", "mb-10");

        const title = document.createElement("h3");
        title.textContent = `Vote for ${position}`;
        title.classList.add("text-3xl", "outline-dotted", "font-semibold", "italic", "mb-4", "text-center", "mx-auto");
        section.appendChild(title);

        const grid = document.createElement("div");
        grid.classList.add("grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-3", "gap-6");

        grouped[position].forEach((c) => {
            const label = document.createElement("label");
            label.classList.add("rounded-lg", "bg-gray-200", "p-4", "flex", "flex-col", "items-center", "text-gray-800", "cursor-pointer", "shadow-2xl", "hover:animate-pulse", "duration-200", "ease-in-out");
            label.innerHTML = 
            `<input type="radio" name="${position}" value="${c.index}" class="mb-4"/>
            <img src="${c.profile}" alt="profile" class="h-32 object-cover rounded-full mb-4 w-32">
            <h2 class="text-3xl font-bold">${c.name}</h2>
            <p class="text-l">Click here to read the manifesto: <a href="${c.manifesto}" target="_blank" class="text-blue-500 hover:underline">Read Manifesto</a></p>
            `;
            grid.appendChild(label);
        });
        section.appendChild(grid);
        form.appendChild(section);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const hasVoted = localStorage.getItem("hasVoted");

    if (hasVoted === "true") {
        document.getElementById("voting-form").innerHTML = "<p class='text-center text-red-600 font-semibold'>You have already voted</p>";
        document.getElementById("submit-vote").style.display ="none";
        return;
    }

    renderVotingForm();
});

document.getElementById("submit-vote").addEventListener("click", () => {
    const form = document.getElementById("voting-form");
    const inputs = form.querySelectorAll("input[type='radio']");

    const requiredGroups = Object.keys(grouped);
    if (inputs.length < requiredGroups.length) {
        alert("Please vote for every position before submitting.");
        return;
    }

    const votes = {};
    inputs.forEach(input => {
        votes[input.name] = input.value;
    });

    let stored = JSON.parse(localStorage.getItem("votes-record")) || [];
    stored.push(votes);
    localStorage.setItem("votes-record", JSON.stringify(stored));

    localStorage.setItem("hasVoted", "true");
    console.log("Votes cast:", votes);
    alert("Your vote has been submitted");
   
    form.innerHTML = "<p class='text-center text-red-600 font-semibold'>Thank you! Your vote has been recorded.</p>";
    document.getElementById("submit-vote").style.display ="none";

    
});

document.getElementById("logout-btn")?.addEventListener("click", () => {
    // Remove session-specific data
    localStorage.removeItem("hasVoted");
    localStorage.removeItem("user-votes");
    localStorage.removeItem("voteTime");

    //clear all if needed....localeStorage.clear()

    //redirect to the home page
    window.location.href = "index.html";
   
});

