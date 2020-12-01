/**
 * Retrieves favourite restaurants from database and displays onto restaurant page.
 */
const getFavouriteRestaurants = () => {
    db.collection("restaurants")
        .limit(NUM_REST_DISPLAY)
        .get()
        .then(function (snap) {
            snap.forEach(function (doc) {
                let restaurantObj = compileRestaurantData(doc);

                firebase.auth().onAuthStateChanged(function (user) {
                  if (user) {
                    var ref = db.collection("users").doc(user.uid);
                    ref.get().then(function(doc){
                      favesArray = doc.data().faves;
                      for (x = 0; x < favesArray.length; x++){
                        if(favesArray[x] == restaurantObj.id){
                          displayRestaurants(restaurantObj);
                        }
                      }
                    });
                  }
                });                
            });
        });
};

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
 * Automatically loads restaurants onto restaurant page from database.
 */
const getFavouriteRestaurantsOnLoad = () => {
    $(document).ready(getFavouriteRestaurants);
}
getFavouriteRestaurantsOnLoad();