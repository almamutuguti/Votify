function renderWinners() {
    const winnerList = document.getElementById("winner-list");
    const resultsVisible = localStorage.getItem("resultsVisible");

    if (resultsVisible !== "true") {
        winnerList.innerHTML = "<p class='text-center text-yellow-500'>Results have not been released yet.Please check back later.</p>";
        return;
    }

    const candidates = JSON.parse(localStorage.getItem("candidates-list")) || [];
    const votes = JSON.parse(localStorage.getItem("votes-record")) || [];

    if (!votes.length) {
        winnerList.innerHTML = "<p class='text-center text-red-500'>No votes have been cast yet.</p>";
        return;
    }

    const candidatesMap = {};
    candidates.forEach((c, index) => {
        if (!candidatesMap[c.position]) candidatesMap[c.position] = {};
        candidatesMap[c.position][index] = { name: c.name, profile: c.profile};

    });

    const voteCount = {};
    votext.forEach(vote => {
        Object.entries(vote).forEach(([position, index]) => {
            if (!voteCount[position]) voteCount[position] = {};
            voteCount[position][index] = (voteCount[position][index] || 0) + 1;

        });
    });

    Object.entries(voteCount).forEach(([position, results]) => {
        let highestVotes = 0;
        let winnerIndex = null;

       Object.entries(results).forEach(([index, count]) => {
        if (count > highestVotes) {
            highestVotes = count;
            winnerIndex = index;
        }
       });

       if (winnerIndex !== null) {
        const winner = candidatesMap[position][winnerIndex];


        const card = document.createElement("div");
        card.classList.add("bg-white", "rounded-lg", "shadow", "p-6", "mb-6", "flex", "items-center", "gap-6");


        card.innerHTML = 
        `<img src="${winner.profile}" alt="${winner.name}" class="h-24 w-24 rounded-full object-cover"/>
        <div>
            <h2 class="text-xl font-bold">${winner.name}</h2>
            <p class="text-gray-600">Position: ${position}</p>
            <p class="text-green-600 font-semibold">Votes: ${highestVotes}</p>
        </div>
        `;
        winnerList.appendChild(card);
       }
    });
}

document.addEventListener("DOMContentLoaded", renderWinners);