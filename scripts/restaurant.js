/**
 * Compiles restaurant data from firestore into a suitable object.
 * @param {Object} doc 
 * @returns parsable restaurant object
 */
const compileRestaurantData = (doc) => {
  let id = doc.id;
  let name = doc.data().name;
  let description = doc.data().description;
  let avgRating = doc.data().average_rating;
  let address = doc.data().address;
  let postal_code = doc.data().postal_code;
  let city = doc.data().city;
  let province = doc.data().province;
  let phone_number = doc.data().phone_number;
  let url = doc.data().website_url;

  let isDineInAvailable = doc.data().isDineInAvailable;
  let isTakeoutAvailable = doc.data().isTakeoutAvailable;
  let isDeliveryAvailable = doc.data().isDeliveryAvailable;

  let isMaskRequired = doc.data().isMaskRequired;
  let isReducedSeatings = doc.data().isReducedSeatings;
  let isDistancedTables = doc.data().isDistancedTables;
  let isSanitizingAvailable = doc.data().isSanitizingAvailable;

  return {
    id,
    name,
    description,
    avgRating,
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
    isSanitizingAvailable
  };
}

/**
 * Retrieves restaurants from database and displays either in descending or ascending order onto restaurant page.
 * @param {bool} desc The condition whether to display descending or not
 */
const getRestaurantsByDescendingRating = (desc = true) => {
  db.collection("restaurants")
    .orderBy("average_rating", desc ? "desc" : "asc")
    .limit(2)
    .get()
    .then (function(snap){
      snap.forEach(function(doc){
        let restaurantObj = compileRestaurantData(doc);

        // Attach a restaurant card.
        displayRestaurants(restaurantObj); 
      });
    });
};

/**
 * Attach attachGetRestaurantsByDescendingRating method to sort by select.
 */
const attachGetRestaurantsByDescendingRating = () => {
  let sortOption = $("#sortOptions").val();

  if(sortOption == 1) {
    $("#restaurantCards").empty();
    getRestaurantsByDescendingRating(true);
  } else if (sortOption == 2) {
    $("#restaurantCards").empty();
    getRestaurantsByDescendingRating(false);
  }
}
$("#sortOptions").on("change", attachGetRestaurantsByDescendingRating);

/**
 * Retrieves restaurants from database and displays onto restaurant page.
 */
const getRestaurants = () => {
  db.collection("restaurants")
    .limit(2)
    .get()
    .then (function(snap){
      snap.forEach(function(doc){
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
    isSanitizingAvailable
  } = restaurantObj;

  console.log(restaurantObj);

  let restaurantCard = $(`
    <div id="${id}" class="item card" data-toggle="collapse" href="#item__details--more-${id}" role="button" aria-expanded="false" aria-controls="collapseExample">
      <div class="item__image">
        <img class="card-img-top" src="https://dummyimage.com/400x400/000/fff" alt="Starbo Image">
      </div>
      <div class="item__details card-body">
        <h5 class="item__title card-title">${name}</h5>
        ${displayRatings(avgRating)}
        <p class="item__desc card-text">${description}</p>
        <p class="item__filter-text card-text">42.6 km</p>
        ${displaySafetyProtocols({isMaskRequired, isReducedSeatings, isDistancedTables, isSanitizingAvailable})}
      </div>
                
      <!-- More Details - Collapse -->
      <div class="item__details--more card-body collapse" id="item__details--more-${id}">
        <!-- Item Features - Safety -->
        ${displaySafetyProtocolsAsList({isMaskRequired, isReducedSeatings, isDistancedTables, isSanitizingAvailable})}
        
        <!-- Item Features - Others-->
        ${displayFeaturesAsList({isDineInAvailable, isTakeoutAvailable, isDeliveryAvailable})}

        <!-- Item Actions -->
        <div class="item__action-group">
          <div class="item__action">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-telephone" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
            </svg>
            <p class="card-text action__text">Call</p>
          </div>
          <div class="item__action">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-map" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98l4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z"/>
            </svg>
            <p class="card-text action__text">Directions</p>
          </div>
          <a class="item__action item__website" href="${url}">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-globe2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539a8.372 8.372 0 0 1-1.198-.49 7.01 7.01 0 0 1 2.276-1.52 6.7 6.7 0 0 0-.597.932 8.854 8.854 0 0 0-.48 1.079zM3.509 7.5H1.017A6.964 6.964 0 0 1 2.38 3.825c.47.258.995.482 1.565.667A13.4 13.4 0 0 0 3.508 7.5zm1.4-2.741c.808.187 1.681.301 2.591.332V7.5H4.51c.035-.987.176-1.914.399-2.741zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5H7.5v2.409c-.91.03-1.783.145-2.591.332a12.343 12.343 0 0 1-.4-2.741zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696A12.63 12.63 0 0 1 7.5 11.91v3.014c-.67-.204-1.335-.82-1.887-1.855a7.776 7.776 0 0 1-.395-.872zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964a9.083 9.083 0 0 0-1.565.667A6.963 6.963 0 0 1 1.018 8.5h2.49a13.36 13.36 0 0 0 .437 3.008zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909c.81.03 1.577.13 2.282.287-.12.312-.252.604-.395.872-.552 1.035-1.218 1.65-1.887 1.855V11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5h-2.49a13.361 13.361 0 0 0-.437-3.008 9.123 9.123 0 0 0 1.565-.667A6.963 6.963 0 0 1 14.982 7.5zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343c-.705.157-1.473.257-2.282.287V1.077c.67.204 1.335.82 1.887 1.855.143.268.276.56.395.872z"/>
            </svg>
            <p class="card-text action__text">Website</p>
          </a>
          <a class="item__action" href="restaurant-details.html">
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

  let ratings = $("<div class='item__ratings'></div>");

  // Append full stars to rating
  for(let i = 0; i < fullStars; i++) {
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
  for(let i = 0; i < emptyStars; i++) {
    ratings.append(`
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-star" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.523-3.356c.329-.314.158-.888-.283-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767l-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288l1.847-3.658 1.846 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.564.564 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
      </svg>
    `);
  }

  return ratings[0].outerHTML;
}

/**
 * Displays whether safety protocols exists for a restaurant.
 * @param   {Array} safetyProtocolList The boolean array of safety protocols
 * @return  {HTMLElement}              The HTML element of the verification of safety protocol availability (or return empty string)
 */
const displaySafetyProtocols = (safetyProtocolList) => {
  if(!Object.values(safetyProtocolList).includes(true)) {
    return "";
  }

  return `
    <div class="item__safety-protocol">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
      </svg>
      <p class="card-text">Safety Protocol Available</p>
    </div>
  `;
}

/**
 * Displays the lists of safety protocols of a restaurant if it exists
 * @param   {Array} safetyProtocolList The boolean array of safety protocols
 * @return  {HTMLElement}              The HTML element of the lists of safety protocols (or return empty string)
 */
const displaySafetyProtocolsAsList = (safetyProtocolList) => {
  let {isMaskRequired, isReducedSeatings, isDistancedTables, isSanitizingAvailable} = safetyProtocolList;
  let safetyProtocols = $("<div class='item__feature-group'></div>");

  if(!Object.values(safetyProtocolList).includes(true)) {
    return "";
  }

  if(isMaskRequired) {
    safetyProtocols.append(`
      <div class="item__feature--safety">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Mask Required</p>
      </div>
    `);
  }

  if(isReducedSeatings) {
    safetyProtocols.append(`
      <div class="item__feature--safety">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Reduced Seatings</p>
      </div>
    `);
  }

  if(isDistancedTables) {
    safetyProtocols.append(`
      <div class="item__feature--safety">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Distanced Tables</p>
      </div>
    `);
  }

  if(isSanitizingAvailable) {
    safetyProtocols.append(`
      <div class="item__feature--safety">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Sanitzing Stations Available</p>
      </div>
    `);
  }

  return safetyProtocols[0].outerHTML;
}

/**
 * Displays the lists of features of a restaurant if it exists.
 * @param   {Array} featureList The boolean array of features
 * @return  {HTMLElement}       The HTML element of the lists of features (or return empty string)
 */
const displayFeaturesAsList = (featureList) => {
  let {isDineInAvailable, isTakeoutAvailable, isDeliveryAvailable} = featureList;
  let features = $("<div class='item__feature-group'></div>");

  if(!Object.values(featureList).includes(true)) {
    return "";
  }

  if(isDineInAvailable) {
    features.append(`
      <div class="item__feature--other">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Dine-in Available</p>
      </div>
    `);
  }

  if(isTakeoutAvailable) {
    features.append(`
      <div class="item__feature--other">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Takeout Available</p>
      </div>
    `);
  }

  if(isDeliveryAvailable) {
    features.append(`
      <div class="item__feature--other">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Delivery Available</p>
      </div>
    `);
  }

  return features[0].outerHTML;
}



// For Testing Purposes
const attachToButtons = () => {
  $("#readFromFirebase").on("click", getRestaurants);
};
attachToButtons();