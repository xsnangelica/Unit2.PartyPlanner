// Fetch is used correctly to GET party data from the API.
// Fetch is used correctly to POST a new party to the API.
// Fetch is used correctly to DELETE a party from the API.
// The app contains a list of the names, dates, times, locations, and descriptions of all parties.
// Each party in the list has a delete button which removes the party when clicked.
// The app contains a form that allows a user to enter information about a party and add it to the list.
// The DOM is dynamically rendered according to data stored in state.
// The data stored in state is updated to stay in sync with the API.


//store API URL
const cohort = "2311-FSA-ET-WEB-PT-SF";
const APIURL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohort}/events`;

//place to store party plans
const partyPlans = {
    partyTime: [],
};

const eventList = document.querySelector("#party");

const addEventForm = document.querySelector("#parties");
addEventForm.addEventListener("submit", parties);

async function render() {
    await getEvents();
    renderpartyTime();
}
render(); 

async function getEvents() {
    try {
const response = await fetch(APIURL);
const json = await response.json();
    console.log(json);
    partyPlans.partyTime = json.data;
    } catch (error) {
    console.error(error);
    }
}
console.log(getEvents());

function renderpartyTime() {
    if (!partyPlans.partyTime.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
    }

    const eventCards = partyPlans.partyTime.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.location}</p>
        <button class="delete-btn" data-party-id="${party.id}">Delete</button>
    `;
    return li;
    });
    console.log(eventCards, partyPlans.partyTime);
    eventList.replaceChildren(...eventCards);

    document.querySelectorAll(".delete-btn").forEach((deleteBtn) => {
        deleteBtn.addEventListener("click", (event) => {
            const partyId = event.target.dataset.partyId;
            deleteParty(partyId);
        });
    });
}

async function deleteParty(partyId) {
    try {
        const response = await fetch(`${APIURL}/${partyId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete party");
        }

        await getEvents();
        renderpartyTime();
    } catch (error) {
        console.error(error);
    }
}

async function parties(event) {
    event.preventDefault();
    try {
    const response = await fetch(APIURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        name: addEventForm.name.value,
        description: addEventForm.description.value,
        date: new Date (addEventForm.date.value),
        location: addEventForm.location.value,
        }),
    });

    if (!response.ok) {
        throw new Error("Failed to create party");
}

    render();
    } catch (error) {
    console.error(error);
    }