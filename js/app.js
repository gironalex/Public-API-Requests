//-----------------
// GLOBAL VARIABLES 
//-----------------
const headerTextDOM = document.querySelector('.header-text-container h1');
const searchContainerDOM = document.querySelector('.search-container');
const galleryDOM = document.querySelector('.gallery');
const bodyDOM = document.querySelector('body');

const url = 'https://randomuser.me/api/?nat=us&results=12&?';
const profilesArray = [];

//--------------
// SEARCH MARKUP
//--------------
const searchMarkup = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
         `;
searchContainerDOM.insertAdjacentHTML('beforeend', searchMarkup);

//----------------
// GALLERY MARKUP
//----------------
function createProfiles(responseArray) {
    responseArray.forEach(profile => {
        let htmlGalleryMessage = `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src="${profile.picture.large}" alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${profile.name.first} ${profile.name.last}</h3>
                    <p class="card-text">${profile.email}</p>
                    <p class="card-text cap">${profile.location.city}, ${profile.location.state}</p>
                </div>
            </div>
            `;
        galleryDOM.insertAdjacentHTML('beforeend', htmlGalleryMessage);
    })
}

//--------------
// MODAL MARKUP
//--------------
function createProfileExtension(selectedCard, responseArray) {
    
    const htmlModalMessage = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
                    <h3 id="name" class="modal-name cap">name</h3>
                    <p class="modal-text">email</p>
                    <p class="modal-text cap">city</p>
                    <hr>
                    <p class="modal-text">(555) 555-5555</p>
                    <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
                    <p class="modal-text">Birthday: 10/21/2015</p>
                </div>
             </div>

            // IMPORTANT: Below is only for exceeds tasks 
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `;
    bodyDOM.insertAdjacentHTML('beforeend', htmlModalMessage);
}

//--------------------------------
// FETCHING DATA + DISPLAYING DATA
//--------------------------------
async function fetchData(url) {
        let response = await fetch(url);
        let data = await response.json();
        return data.results;
}

fetchData(url)
    .then(headerTextDOM.innerHTML = `<h1>Loading...</h1>`)
    .then(data => {
        createProfiles(data)
        profilesArray.push(...data)
        headerTextDOM.innerHTML = `<h1>AWESOME STARTUP EMPLOYEE DIRECTORY</h1>`;
    })
    .catch(error => console.log(error))


//----------
// FILTERING
//----------
function filter(searchInput, data) {
    let matchedProfiles = [];
    data.forEach(profile => {
        let profileNames = `${profile.name.first} ${profile.name.last}`.toLowerCase();
        profileNames.includes(searchInput) && searchInput !== 0 ? matchedProfiles.push(profile) : null;
    })
    return matchedProfiles
}

function createFilteredProfiles (matchedEmployees) {
    if (matchedEmployees.length === 0) {
        headerTextDOM.innerHTML = `<h1>No results found!</h1>`;
        galleryDOM.innerHTML = '';
    } else if (matchedEmployees.length >= 1) {
        headerTextDOM.innerHTML = `<h1>AWESOME STARTUP EMPLOYEE DIRECTORY</h1>`;
        galleryDOM.innerHTML = '';
        createProfiles(matchedEmployees);
    } else {
        createProfiles(profilesArray);
    }
}

//-----------------
// EVENT LISTENERS
//-----------------
// Search Bar
document.querySelector('#search-input').addEventListener('keyup', (e) => {
    let searchInput = e.target.value.toLowerCase();
    createFilteredProfiles(filter(searchInput, profilesArray));
})

// Search Button
document.querySelector('#search-submit').addEventListener('click', () => {
    let searchInput = document.querySelector('#search-input').value.toLowerCase();
    createFilteredProfiles(filter(searchInput, profilesArray));
});

// Clicking on Profile Cards
const profileCards = document.querySelector('.gallery');
profileCards.addEventListener('click', (e) => {
    console.log(e.target.closest('.card'));
})