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
/**
 * Creates a HTML profile card from a given object array.
 * @param1 [responseArray] - Object array that contains the contact information of the 12 fetched profiles.
**/
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
/**
 * Creates a "pop up" window with more information on the profile card the user has clicked.
 * @param1 [selectedCardName] - string value given by an event listener when the user clicks on the profile card.
 * @param2 [responseArray] - Object array that contains the contact information of the 12 fetched profiles.
**/
function createProfileExtension(selectedCardName, responseArray) {
    // Finding the index value of the selected card
    const responseArrayNames = [];
    responseArray.forEach(profile => responseArrayNames.push(`${profile.name.first} ${profile.name.last}`));
    const indexOfSld = responseArrayNames.findIndex(name => name === selectedCardName);
    
    // Variables that contain the contact information to be used in the Modal Markup
    let imgSrc = responseArray[indexOfSld].picture.large;
    let firstName = responseArray[indexOfSld].name.first;
    let lastName = responseArray[indexOfSld].name.last;
    let email = responseArray[indexOfSld].email;
    let city = responseArray[indexOfSld].location.city;
    let cell = responseArray[indexOfSld].cell.replace('-', ' ');
    let streetNumber = responseArray[indexOfSld].location.street.number;
    let streetName = responseArray[indexOfSld].location.street.name;
    let state = responseArray[indexOfSld].location.state;
    let postCode = responseArray[indexOfSld].location.postcode;
    let month = responseArray[indexOfSld].dob.date.slice(5,7);
    let day = responseArray[indexOfSld].dob.date.slice(8,10);
    let year = responseArray[indexOfSld].dob.date.slice(0,4);

    // Modal Markup
    const htmlModalMessage = `
        <div class="modal-container">
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${imgSrc}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${firstName} ${lastName}</h3>
                    <p class="modal-text">${email}</p>
                    <p class="modal-text cap">${city}</p>
                    <hr>
                    <p class="modal-text">${cell}</p>
                    <p class="modal-text">${streetNumber} ${streetName}., ${city}, ${state} ${postCode}</p>
                    <p class="modal-text">Birthday: ${month} / ${day} / ${year}</p>
                </div>
             </div>

            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
        </div>
        `;
        
    bodyDOM.insertAdjacentHTML('beforeend', htmlModalMessage);

    // Event Listeners for the Modal Window X, Prev, & Next Buttons
    document.querySelector('.modal-container').addEventListener('click', (e) => {

        if (e.target.closest('.modal-close-btn')) {
            e.currentTarget.remove();
        } else if (e.target.id === 'modal-prev') {
            if (indexOfSld !== 0)  {
                let x = responseArrayNames[indexOfSld-1];
                console.log(x);
                createProfileExtension(x, profilesArray);
            } 
        } else if (e.target.id === 'modal-next') {
            if (indexOfSld !== 11) {
                let y = responseArrayNames[indexOfSld+1];
                console.log(y);
                createProfileExtension(y, profilesArray);
            } 
          }
    })
}

//--------------------------------
// FETCHING DATA + DISPLAYING DATA
//--------------------------------
/**
 * "fetches" API information on 12 US profiles from an URL link. 
 * @param1 [url] - API url where the information is being requested from.
 * @return [] - returns an array with the objects of 12 different contact profiles.
**/
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


//-------------------
// FILTERING PROFILES
//-------------------
/**
 * Searches to see if any of the input name values in the search bar are included in the array returned by the fetch request.
 * @param1 [searchInput] - input value from the search bar.
 * @param2 [data] - array of the 12 profiles that were fetched.
 * @returns [matchedProfiles] - array with the values that match in the search bar & fetched response.
**/
function filter(searchInput, data) {
    let matchedProfiles = [];
    data.forEach(profile => {
        let profileNames = `${profile.name.first} ${profile.name.last}`.toLowerCase();
        profileNames.includes(searchInput) && searchInput !== 0 ? matchedProfiles.push(profile) : null;
    })
    return matchedProfiles
}

/**
 * Creates a HTML profile using the createProfiles function with the array returned from the filter function. 
 * @param1 [matchedEmployees] - Object array that contains the returned values from the filter function
**/
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
galleryDOM.addEventListener('click', (e) => {
    let nameSelected;
    let cardSelected = e.target.closest('.card');
    cardSelected !== null ? nameSelected = cardSelected.querySelector('.card-info-container h3').innerHTML : nameSelected = null;
    nameSelected !== null ? createProfileExtension(nameSelected, profilesArray) : null;
})