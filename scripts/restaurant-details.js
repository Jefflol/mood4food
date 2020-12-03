/**
 * Gets restaurant ID from query string.
 */
const getRestaurantId = () => {
    let queryString = decodeURIComponent(window.location.search);
    let queries = queryString.split("?"); //delimiter
    let id = queries[1]; //get what's after '?'
    // console.log("Restaurant ID: " + id);
    return id;
}

/**
 * Retrieves restaurants from database and displays onto restaurant page.
 */
const getRestaurantDetails = (id) => {
    db.collection("restaurants").doc(id)
        .get()
        .then((doc) => {
            let restaurantObj = compileRestaurantData(doc);
            // console.log(restaurantObj);

            // Attach a restaurant card.
            displayRestaurantDetails(restaurantObj);
        })
};

/**
 * Displays a restaurant as a card on restaurant page.
 * @param {Object} restaurantObj The restaurant object that contains its restaurant data
 */
const displayRestaurantDetails = (restaurantObj) => {
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

    let restaurantDetails = $(`    
        <!-- Restaurant Header - Img + Brief Details -->
        <div class="restaurant__header">
            <div class="restaurant__img">
                    <img id="${id}-restImage" src="https://dummyimage.com/400x400/000/fff" alt="${name} Image">
            </div>

            <div class="restaurant__brief-details">
                <div class="brief-details__header">
                    <h1 class="restaurant__name">${name}</h1>
                    ${displayThumbsMain(avgThumbs)}
                    <div class="restaurant__favourite"></div>
                </div>

                <div class="restaurant__ratings">
                    ${displayRatings(avgRating)}
                    ${displayRatingsCost(avgCost)}
                </div>

                <div class="restaurant__desc">${description}</div>
            </div>
            </div>

            <!-- Restaurant Feature - Safety Protocols -->
            <div class="restaurant__feature-group">
                ${displaySafetyProtocolsAsList({isMaskRequired, isReducedSeatings, isDistancedTables, isSanitizingAvailable})}
            </div>

            <!-- Restaurant Feature - Other -->
            <div class="restaurant__feature-group">
            ${displayFeaturesAsList({isDineInAvailable, isTakeoutAvailable, isDeliveryAvailable})}
            </div>

            <!-- Restaurant Actions -->
            <div class="restaurant__action-group">
            ${displayPhoneAction(phone_number)}
            ${displayGoogleMapAction(address, postal_code, city, province)}
            ${displayWebsite(url)}
        </div>
    `);

    // Append a custom restaurant card to restaurant page
    $("#restaurantDetailsPage").prepend(restaurantDetails);

    // console.log(`${name} was read from database`);

    //favourites();
};

//--------------------------------------------------------------------------------
//  This function read the collection of restaurants,
//  Dynamically create a place to display each restaurant,
//  Put a "heart" (font-awesome icon) beside the name with "id" (document id of the restaurant)
//  Then, add a listener to the heart.
//  In the handler:  
//      - toggle between the solid heart, and the outline heart
//      - if the full heart is chosen, then add to faves array
//      - otherwise, remove from faves array
//-------------------------------------------------------------------------------
function displayRestaurantsWithHeart() {
    db.collection("restaurants")
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                var name = doc.data().name;
                var id = doc.id;
                if ($(".restaurant__name").text() == name) {
                    //Display restaurant name, followed by a heart fontawesome icon
                    $(".restaurant__favourite")
                        .append("<i id='" + id + "' class='fa heart fa-heart-o'> </i>"); //add heart class from fontawesome

                    firebase.auth().onAuthStateChanged(function (user) {
                        if (user) {
                            var ref = db.collection("users").doc(user.uid);
                            ref.get().then(function (doc) {
                                favesArray = doc.data().faves;
                                if (favesArray){
                                    for (x = 0; x < favesArray.length; x++) {
                                        if (favesArray[x] == id) {
                                            $("#" + id).toggleClass("fa-heart fa-heart-o");
                                        }
                                    }
                                }
                            });
                        }
                    });

                    // When the Heart is clicked
                    $("#" + id).click(function () { //add listener 

                        // Toggle between the full-heart ("fa-heart"), and the empty-heart ("fa-heart-o", outline heart)
                        $(this).toggleClass("fa-heart fa-heart-o");

                        // If the "fa-heart" class is here, then add to faves, else remove from faves
                        if ($("#" + id).hasClass('fa-heart')) {
                            console.log("ON");
                            // Save to database
                            firebase.auth().onAuthStateChanged(function (user) {
                                db.collection("users").doc(user.uid).update({
                                    faves: firebase.firestore.FieldValue.arrayUnion(id)
                                })
                            })
                        } else {
                            console.log("OFF");
                            // Remove from database
                            firebase.auth().onAuthStateChanged(function (user) {
                                db.collection("users").doc(user.uid).update({
                                    faves: firebase.firestore.FieldValue.arrayRemove(id)
                                })
                            })
                        }
                    });
                };
            })
        })
}

/**
 * Attaches event handlers, done this way so that the restaurant details is loaded first.
 */
const attachEventHandlers = () => {
    // Display favourites
    displayRestaurantsWithHeart();

    // Enable tooltips
    $("body").tooltip({
        selector: '[data-toggle=tooltip]'
    });
}

/**
 * Automatically loads restaurants onto restaurant page from database.
 * Attaches event handlers.
 */
const getRestaurantDetailOnLoad = () => {
    // $(document).ready(getRestaurantDetails);
    let id = getRestaurantId();
    $(document).ready(getRestaurantDetails(id));

    attachEventHandlers();
}
getRestaurantDetailOnLoad();