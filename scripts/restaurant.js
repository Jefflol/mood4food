/** Constant for the number of restaurants to display on restaurant page. */
const NUM_REST_DISPLAY = 10;

/** Constant for filter names for filter modal display. */
const FILTER_NAMES = {
    isMaskRequired: "Mask Required",
    isReducedSeatings: "Reduced Seatings",
    isDistancedTables: "Distanced Tables",
    isSanitizingAvailable: "Sanitizing Station Available"
};

/** Holds the restaurant ID. */
var RESTAURANT_ID;

/** Holds filters that user chooses to apply. */
var filters = {
    isMaskRequired: false,
    isReducedSeatings: false,
    isDistancedTables: false,
    isSanitizingAvailable: false
};

/**
 * Attach attachSortingMethods method to sort by select.
 */
const attachSortingMethods = () => {
    let sortOption = $("#sortOptions").val();

    if (sortOption == 1) {
        $("#restaurantCards").empty();
        getRestaurantsByFilters(filters, "average_rating", true);
    } else if (sortOption == 2) {
        $("#restaurantCards").empty();
        getRestaurantsByFilters(filters, "average_rating", false);
    } else if (sortOption == 3) {
        $("#restaurantCards").empty();
        getRestaurantsByFilters(filters, "average_cost", true);
    } else if (sortOption == 4) {
        $("#restaurantCards").empty();
        getRestaurantsByFilters(filters, "average_cost", false);
    }
}
$("#sortOptions").on("change", attachSortingMethods);

/**
 * Search Bar to find restaurants.
 */
var button;
button = document.getElementById("search-button");
button.addEventListener("click", function (event) {
    event.preventDefault();
    $("#restaurantCards").empty();
    var value = document.getElementById("search-bar").value;
    console.log(value);
    db.collection("restaurants")
        .where("name", "==", value)
        .limit(NUM_REST_DISPLAY)
        .get()
        .then(function (snap) {
            if (!(value == "")) {
                snap.forEach(function (doc) {
                    let restaurantObj = compileRestaurantData(doc);
                    // Attach a restaurant card.
                    displayRestaurants(restaurantObj);
                });
            }
            // If user searches for nothing then display every restaurants.
            else {
                getRestaurants();
            }
        });
});

/**
 * Retrieves restaurants from database and displays onto restaurant page.
 */
const getRestaurants = () => {
    db.collection("restaurants")
        .limit(NUM_REST_DISPLAY)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                let restaurantObj = compileRestaurantData(doc);

                // Attach a restaurant card.
                displayRestaurants(restaurantObj);
            });
        });
};

/**
 * Automatically loads restaurants onto restaurant page from database.
 */
const getRestaurantsOnLoad = () => {
    $(document).ready(getRestaurants);
}
getRestaurantsOnLoad();

/**
 * Displays a restaurant as a card on restaurant page.
 * @param {Object} restaurantObj The restaurant object that contains its restaurant data
 */
const displayRestaurants = (restaurantObj) => {
    let {
        id,
        name,
        avgRating,
        avgCost,
        description,
        address,
        postal_code,
        city,
        province,
        phone_number,
        url,
        isDineInAvailable,
        isTakeoutAvailable,
        isDeliveryAvailable,
        isMaskRequired,
        isReducedSeatings,
        isDistancedTables,
        isSanitizingAvailable,
        avgThumbs
    } = restaurantObj;

    let restaurantCard = $(`
        <div id="${id}" class="item card" data-toggle="collapse" href="#item__details--more-${id}" role="button" aria-expanded="false" aria-controls="collapseExample">
            <div class="item__verified-badge" data-toggle="tooltip" data-placement="top" title="This restaurant has been verified by the owner">
                <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-patch-check-fill" fill="#86cf5b" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01-.622-.636zm.287 5.984a.5.5 0 0 0-.708-.708L7 8.793 5.854 7.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z"/>
                </svg>
            </div>
            <div class="item__image">
                <img id="${id}-restImage" class="card-img-top" src="https://dummyimage.com/400x400/000/fff" alt="${name} Image">
            </div>
            <div class="item__details card-body">
                <h5 class="item__title card-title">${name}</h5>
                ${displayThumbsMain(avgThumbs)}
                <div class="item__ratings">
                    ${displayRatings(avgRating)}
                    ${displayRatingsCost(avgCost)}
                </div>
                <p class="item__desc card-text">${description}</p>
                ${displaySafetyProtocols({isMaskRequired, isReducedSeatings, isDistancedTables, isSanitizingAvailable})}
            </div>
                        
            <!-- More Details - Collapse -->
            <div class="item__details--more card-body collapse" id="item__details--more-${id}">
                <!-- Item Features - Safety -->
                <div class="restaurant__feature-group">
                    ${displaySafetyProtocolsAsList({isMaskRequired, isReducedSeatings, isDistancedTables, isSanitizingAvailable})}
                </div>

                <!-- Item Features - Others-->
                <div class="restaurant__feature-group">
                    ${displayFeaturesAsList({isDineInAvailable, isTakeoutAvailable, isDeliveryAvailable})}
                </div>

                <!-- Item Actions -->
                <div class="restaurant__action-group">
                    ${displayPhoneAction(phone_number)}
                    ${displayGoogleMapAction(address, postal_code, city, province)}
                    ${displayWebsite(url)}
                    <a class="restaurant__action" href="restaurant-details.html?${RESTAURANT_ID}">
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-emoji-smile" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path fill-rule="evenodd" d="M4.285 9.567a.5.5 0 0 1 .683.183A3.498 3.498 0 0 0 8 11.5a3.498 3.498 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.498 4.498 0 0 1 8 12.5a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683z"/>
                            <path d="M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5zm4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5z"/>
                        </svg>
                        <p class="card-text action__text">Reviews</p>
                    </a>
                </div>
            </div>
        </div>
    `);

    // Append a custom restaurant card to restaurant page
    $("#restaurantCards").append(restaurantCard);

    console.log(`${name} was read from database`);
};

/**
 * Displays the approriate number of stars given a rating.
 * @param   {Number} rating The average rating for a restaurant
 * @return  {HTMLElement}   The HTML element of star ratings
 */
const displayRatings = (rating) => {
    const MAX_STARS = 5;
    let fullStars = Math.trunc(rating);
    let halfStar = (rating - fullStars) >= 0.5 ? 1 : 0;
    let emptyStars = MAX_STARS - rating - halfStar;

    let ratings = $("<div class='item__rating'></div>");

    // Append full stars to rating
    for (let i = 0; i < fullStars; i++) {
        ratings.append(`
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.283.95l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
        `);
    }

    // Append half star to rating
    if (halfStar) {
        ratings.append(`
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star-half" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M5.354 5.119L7.538.792A.516.516 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.537.537 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.519.519 0 0 1-.146.05c-.341.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.171-.403.59.59 0 0 1 .084-.302.513.513 0 0 1 .37-.245l4.898-.696zM8 12.027c.08 0 .16.018.232.056l3.686 1.894-.694-3.957a.564.564 0 0 1 .163-.505l2.906-2.77-4.052-.576a.525.525 0 0 1-.393-.288L8.002 2.223 8 2.226v9.8z"/>
            </svg>
        `);
    }

    // Append empty stars to rating
    for (let i = 0; i < emptyStars; i++) {
        ratings.append(`
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
            </svg>
        `);
    }

    return ratings[0].outerHTML;
}

/**
 * Displays the approriate number of dollar signs given a cost.
 * @param   {Number} rating The average cost rating for a restaurant
 * @return  {HTMLElement}   The HTML element of dollar sign ratings
 */
const displayRatingsCost = (rating) => {
    const MAX_COST = 5;
    let fullCost = Math.trunc(rating);
    let halfCost = (rating - fullCost) >= 0.5 ? 1 : 0;
    let emptyCost = MAX_COST - rating - halfCost;

    let ratings = $("<div class='item__rating'></div>");

    // Append full dollar signs to rating
    for (let i = 0; i < fullCost; i++) {
        ratings.append(`
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" 
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 235.517 235.517"
                style="enable-background:new 0 0 235.517 235.517;" xml:space="preserve">
                <g>
                <path style="fill:#85bb65;" d="M118.1,235.517c7.898,0,14.31-6.032,14.31-13.483c0-7.441,0-13.473,0-13.473
            c39.069-3.579,64.932-24.215,64.932-57.785v-0.549c0-34.119-22.012-49.8-65.758-59.977V58.334c6.298,1.539,12.82,3.72,19.194,6.549
            c10.258,4.547,22.724,1.697,28.952-8.485c6.233-10.176,2.866-24.47-8.681-29.654c-11.498-5.156-24.117-8.708-38.095-10.236V8.251
            c0-4.552-6.402-8.251-14.305-8.251c-7.903,0-14.31,3.514-14.31,7.832c0,4.335,0,7.843,0,7.843
            c-42.104,3.03-65.764,25.591-65.764,58.057v0.555c0,34.114,22.561,49.256,66.862,59.427v33.021
            c-10.628-1.713-21.033-5.243-31.623-10.65c-11.281-5.755-25.101-3.72-31.938,6.385c-6.842,10.1-4.079,24.449,7.294,30.029
            c16.709,8.208,35.593,13.57,54.614,15.518v13.755C103.79,229.36,110.197,235.517,118.1,235.517z M131.301,138.12
            c14.316,4.123,18.438,8.257,18.438,15.681v0.555c0,7.979-5.776,12.651-18.438,14.033V138.12z M86.999,70.153v-0.549
            c0-7.152,5.232-12.657,18.71-13.755v29.719C90.856,81.439,86.999,77.305,86.999,70.153z" />
                </g>
            </svg>
        `);
    }

    // Append half dollar sign to rating
    if (halfCost) {
        ratings.append(`
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" 
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 235.517 235.517"
                style="enable-background:new 0 0 235.517 235.517;" xml:space="preserve">
                <linearGradient id="half_grad">
                    <stop offset="50%" stop-color="#85bb65"/>
                    <stop offset="50%" stop-color="#D3D3D3" stop-opacity="1" />
                </linearGradient>
                <g>
                <path fill="url(#half_grad)" d="M118.1,235.517c7.898,0,14.31-6.032,14.31-13.483c0-7.441,0-13.473,0-13.473
            c39.069-3.579,64.932-24.215,64.932-57.785v-0.549c0-34.119-22.012-49.8-65.758-59.977V58.334c6.298,1.539,12.82,3.72,19.194,6.549
            c10.258,4.547,22.724,1.697,28.952-8.485c6.233-10.176,2.866-24.47-8.681-29.654c-11.498-5.156-24.117-8.708-38.095-10.236V8.251
            c0-4.552-6.402-8.251-14.305-8.251c-7.903,0-14.31,3.514-14.31,7.832c0,4.335,0,7.843,0,7.843
            c-42.104,3.03-65.764,25.591-65.764,58.057v0.555c0,34.114,22.561,49.256,66.862,59.427v33.021
            c-10.628-1.713-21.033-5.243-31.623-10.65c-11.281-5.755-25.101-3.72-31.938,6.385c-6.842,10.1-4.079,24.449,7.294,30.029
            c16.709,8.208,35.593,13.57,54.614,15.518v13.755C103.79,229.36,110.197,235.517,118.1,235.517z M131.301,138.12
            c14.316,4.123,18.438,8.257,18.438,15.681v0.555c0,7.979-5.776,12.651-18.438,14.033V138.12z M86.999,70.153v-0.549
            c0-7.152,5.232-12.657,18.71-13.755v29.719C90.856,81.439,86.999,77.305,86.999,70.153z" />
                </g>
            </svg>
        `);
    }

    // Append empty dollar sign to rating
    for (let i = 0; i < emptyCost; i++) {
        ratings.append(`
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" 
                xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 235.517 235.517"
                style="enable-background:new 0 0 235.517 235.517;" xml:space="preserve">
                <g>
                <path style="fill:#D3D3D3;" d="M118.1,235.517c7.898,0,14.31-6.032,14.31-13.483c0-7.441,0-13.473,0-13.473
            c39.069-3.579,64.932-24.215,64.932-57.785v-0.549c0-34.119-22.012-49.8-65.758-59.977V58.334c6.298,1.539,12.82,3.72,19.194,6.549
            c10.258,4.547,22.724,1.697,28.952-8.485c6.233-10.176,2.866-24.47-8.681-29.654c-11.498-5.156-24.117-8.708-38.095-10.236V8.251
            c0-4.552-6.402-8.251-14.305-8.251c-7.903,0-14.31,3.514-14.31,7.832c0,4.335,0,7.843,0,7.843
            c-42.104,3.03-65.764,25.591-65.764,58.057v0.555c0,34.114,22.561,49.256,66.862,59.427v33.021
            c-10.628-1.713-21.033-5.243-31.623-10.65c-11.281-5.755-25.101-3.72-31.938,6.385c-6.842,10.1-4.079,24.449,7.294,30.029
            c16.709,8.208,35.593,13.57,54.614,15.518v13.755C103.79,229.36,110.197,235.517,118.1,235.517z M131.301,138.12
            c14.316,4.123,18.438,8.257,18.438,15.681v0.555c0,7.979-5.776,12.651-18.438,14.033V138.12z M86.999,70.153v-0.549
            c0-7.152,5.232-12.657,18.71-13.755v29.719C90.856,81.439,86.999,77.305,86.999,70.153z" />
                </g>
            </svg>
        `);
    }

    return ratings[0].outerHTML;
}

/**
 * Displays whether safety protocols exists for a restaurant.
 * @param   {Array} safetyProtocolList The boolean array of safety protocols
 * @return  {HTMLElement}              The HTML element of the verification of safety protocol availability
 */
const displaySafetyProtocols = (safetyProtocolList) => {
    if (Object.values(safetyProtocolList).includes(true)) {
        return `
            <div class="item__safety-protocol">
                <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-check" fill="rgb(103, 196, 75)" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                </svg>
                <p class="card-text" style="color: rgb(103, 196, 75)">Safety Protocol Available</p>
            </div>
        `;
    } else {
        return `
            <div class="item__safety-protocol">
                <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-x" fill="rgb(244, 13, 26)" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <p class="card-text" style="color: rgb(244, 13, 26)">Safety Protocol Unavailable</p>
            </div>
        `;
    }
}

/**
 * Add filter to fitler modal and updates filters.
 * @param {String} filterBy filter key 
 */
const addFilter = (filterBy) => {
    // Update filters for getRestaurants methods
    filters[filterBy] = true;

    // Add filter if it has not already been added
    if ($(`#${filterBy}FilterItem`).length == 0) {
        $("#appliedFilters").append(`
            <div id="${filterBy}FilterItem" class="filter-item">
                ${FILTER_NAMES[filterBy]}
                <span>&times;</span>
            </div>
        `);

        // Attach functionality to remove filter
        $(`#${filterBy}FilterItem`).on("click", () => removeFilter(filterBy));

        console.log("Added " + filterBy);
    }
}

/**
 * Remove filter from filter modal and updates filters.
 * @param {String} filterBy filter key
 */
const removeFilter = (filterBy) => {
    // Update filters for getRestaurants methods
    filters[filterBy] = false;

    // Remove filter if it has not already been removed
    if ($(`#${filterBy}FilterItem`).length == 1) {
        $(`#${filterBy}FilterItem`).remove();

        console.log("Removed " + filterBy);
    }
}

/**
 * Clears all filters from fitler modal and updates filters.
 */
const clearFilters = () => {
    for (let property in filters) {
        filters[property] = false;
    }

    $("#appliedFilters").empty();
}

/**
 * Checks if filters have been selected or not
 * @returns true if filters have been selected, else false
 */
const isFilterSelected = () => {
    for (let property in filters) {
        if (filters[property]) {
            return true;
        }
    }

    return false;
}

/**
 * Gets restaurants given filters and sorting option.
 * @param {Object} filterOptions  An object of filter options
 * @param {String} sortByOption   Sorting option
 * @param {boolean} desc          Boolean value to sort by descending or ascending
 */
const getRestaurantsByFilters = (filterOptions, sortByOption, desc = true) => {
    db.collection("restaurants")
        .orderBy(sortByOption, desc ? "desc" : "asc")
        // .limit(NUM_REST_DISPLAY)
        .get()
        .then(function (snap) {
            // Empty cards
            $("#restaurantCards").empty();

            let cardCount = 0;
            snap.forEach(function (doc) {
                // Acts as .limit() after filters have been applied
                if (cardCount <= NUM_REST_DISPLAY) {
                    let restaurantObj = compileRestaurantData(doc);
                    let hasFilters = true;

                    // Check if restaurant meets filter requirements
                    for (const property in filterOptions) {
                        if (filterOptions[property] == true && restaurantObj[property] == false) {
                            // console.log(restaurantObj.name + "||" + filterOptions[property] + ", " + restaurantObj[property]);
                            hasFilters = false;
                            break;
                        }
                    }

                    // Display restaurant only if it met filter requirements
                    if (hasFilters) {
                        console.log("display: " + restaurantObj.name);
                        // Attach a restaurant card.
                        displayRestaurants(restaurantObj);
                        cardCount++;
                    }
                }
            });
        });
};

/**
 * Attaches event handlers within filter modal.
 */
const attachEventHandlers = () => {
    $("#maskRequiredFilter").on("click", () => addFilter("isMaskRequired"));
    $("#reducedSeatingsFilter").on("click", () => addFilter("isReducedSeatings"));
    $("#distancedTablesFilter").on("click", () => addFilter("isDistancedTables"));
    $("#sanitizingAvailableFilter").on("click", () => addFilter("isSanitizingAvailable"));

    $("#clearFiltersBtn").on("click", () => clearFilters());
    $("#applyFilterBtn").on("click", () => {
        // Apply filters
        getRestaurantsByFilters(filters, "average_rating");

        // Update filter button html text
        if (isFilterSelected()) {
            $("#openFilterModalBtn").html("Filter (Applied)");
        } else {
            $("#openFilterModalBtn").html("Filter");
        }

        // Hide filter modal
        $("#filterModal").modal('hide');
    });

    // Tooltip for verified badge
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });

    // Filter popover - Show
    $("#openFilterModal").popover('show');
    // Filter popover - Hide
    $("#openFilterModal").on('click', () => {
        $('#openFilterModal').popover('hide');
    });
}

/**
 * Automatically loads restaurants onto restaurant page from database.
 */
const getRestaurantsOnLoad = () => {
    $(document).ready(getRestaurants);
    attachEventHandlers();
}
getRestaurantsOnLoad();