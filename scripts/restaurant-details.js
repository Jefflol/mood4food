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

  let image = doc.data().image;

  // Replace restaurant placeholder image once actual image has been downloaded
  let pathReference = firebase.storage().ref(image);
  pathReference.getDownloadURL().then(function(url) {
    $(`#${id}-restImage`).attr("src", url);
  })
  
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
 * Gets restaurant ID from query string.
 */
const getRestaurantId = () =>{
  let queryString = decodeURIComponent(window.location.search);
  let queries = queryString.split("?");   //delimiter
  let id = queries[1];                 //get what's after '?'
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
 * Automatically loads restaurants onto restaurant page from database.
 */
const getRestaurantDetailOnLoad = () => {
  // $(document).ready(getRestaurantDetails);
  let id = getRestaurantId();
  $(document).ready(getRestaurantDetails(id));
}
getRestaurantDetailOnLoad();

/**
 * Displays a restaurant as a card on restaurant page.
 * @param {Object} restaurantObj The restaurant object that contains its restaurant data
 */
const displayRestaurantDetails = (restaurantObj) => {
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

  let restaurantDetails = $(`
    <!-- Back Button -->
    <a id="restaurantDetailsBackBtn" type="button" class="back-btn btn btn-light" href="restaurant.html">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-arrow-left mx-1" fill="currentColor"
        xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd"
          d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z" />
      </svg>
      <div class="mx-1">
        Go Back
      </div>
    </a>
    
    <!-- Restaurant Header - Img + Brief Details -->
    <div class="restaurant__header">
      <div class="restaurant__img">
        <img id="${id}-restImage" src="https://dummyimage.com/400x400/000/fff" alt="${name} Image">
      </div>

      <div class="restaurant__brief-details">
        <div class="brief-details__header">
          <h1 class="restaurant__name">${name}</h1>
          <div class="restaurant__favourite">
            <svg width="1.5em" height="1.5em" viewBox="0 0 16 16" class="bi bi-heart" fill="currentColor"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd"
                d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
            </svg>
          </div>
        </div>

        <div class="restaurant__ratings d-flex w-100 justify-content-start">
          ${displayRatings(avgRating)}
        </div>

        <div class="restaurant__desc">${description}</div>
      </div>
    </div>

    <!-- Restaurant Feature - Safety Protocols -->
    ${displaySafetyProtocolsAsList({isMaskRequired, isReducedSeatings, isDistancedTables, isSanitizingAvailable})}

    <!-- Restaurant Feature - Other -->
    ${displayFeaturesAsList({isDineInAvailable, isTakeoutAvailable, isDeliveryAvailable})}

    <!-- Restaurant Actions -->
    <div class="restaurant__action-group">
      <div class="restaurant__action isDisabled">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-telephone" fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z" />
        </svg>
        <p class="card-text action__text">Call</p>
      </div>
      <div class="restaurant__action isDisabled">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-map" fill="currentColor"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd"
            d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98l4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z" />
        </svg>
        <p class="card-text action__text">Directions</p>
      </div>
      ${displayWebsite(url)}
    </div>
  `);

  // Append a custom restaurant card to restaurant page
  $("#restaurantDetailsPage").prepend(restaurantDetails);

  console.log(`${name} was read from database`);
};

/**
 * Displays the lists of safety protocols of a restaurant if it exists
 * @param   {Array} safetyProtocolList The boolean array of safety protocols
 * @return  {HTMLElement}              The HTML element of the lists of safety protocols (or return empty string)
 */
const displaySafetyProtocolsAsList = (safetyProtocolList) => {
  let {isMaskRequired, isReducedSeatings, isDistancedTables, isSanitizingAvailable} = safetyProtocolList;
  let safetyProtocols = $("<div class='restaurant__feature-group'></div>");

  if(!Object.values(safetyProtocolList).includes(true)) {
    return "";
  }

  if(isMaskRequired) {
    safetyProtocols.append(`
      <div class="restaurant__feature--safety">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Mask Required</p>
      </div>
    `);
  }

  if(isReducedSeatings) {
    safetyProtocols.append(`
      <div class="restaurant__feature--safety">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Reduced Seatings</p>
      </div>
    `);
  }

  if(isDistancedTables) {
    safetyProtocols.append(`
      <div class="restaurant__feature--safety">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Distanced Tables</p>
      </div>
    `);
  }

  if(isSanitizingAvailable) {
    safetyProtocols.append(`
      <div class="restaurant__feature--safety">
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
  let features = $("<div class='restaurant__feature-group'></div>");

  if(!Object.values(featureList).includes(true)) {
    return "";
  }

  if(isDineInAvailable) {
    features.append(`
      <div class="restaurant__feature--other">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Dine-in Available</p>
      </div>
    `);
  }

  if(isTakeoutAvailable) {
    features.append(`
      <div class="restaurant__feature--other">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Takeout Available</p>
      </div>
    `);
  }

  if(isDeliveryAvailable) {
    features.append(`
      <div class="restaurant__feature--other">
        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
        </svg>
        <p class="card-text">Delivery Available</p>
      </div>
    `);
  }

  return features[0].outerHTML;
}

/**
 * Adds restaurant URL as an action if URL is available, else make it disabled
 * @param {String} url 
 */
const displayWebsite = (url) => {
  if(!url) {
    return `
    <a class="restaurant__action restaurant__website isDisabled">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-globe2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539a8.372 8.372 0 0 1-1.198-.49 7.01 7.01 0 0 1 2.276-1.52 6.7 6.7 0 0 0-.597.932 8.854 8.854 0 0 0-.48 1.079zM3.509 7.5H1.017A6.964 6.964 0 0 1 2.38 3.825c.47.258.995.482 1.565.667A13.4 13.4 0 0 0 3.508 7.5zm1.4-2.741c.808.187 1.681.301 2.591.332V7.5H4.51c.035-.987.176-1.914.399-2.741zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5H7.5v2.409c-.91.03-1.783.145-2.591.332a12.343 12.343 0 0 1-.4-2.741zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696A12.63 12.63 0 0 1 7.5 11.91v3.014c-.67-.204-1.335-.82-1.887-1.855a7.776 7.776 0 0 1-.395-.872zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964a9.083 9.083 0 0 0-1.565.667A6.963 6.963 0 0 1 1.018 8.5h2.49a13.36 13.36 0 0 0 .437 3.008zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909c.81.03 1.577.13 2.282.287-.12.312-.252.604-.395.872-.552 1.035-1.218 1.65-1.887 1.855V11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5h-2.49a13.361 13.361 0 0 0-.437-3.008 9.123 9.123 0 0 0 1.565-.667A6.963 6.963 0 0 1 14.982 7.5zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343c-.705.157-1.473.257-2.282.287V1.077c.67.204 1.335.82 1.887 1.855.143.268.276.56.395.872z"/>
      </svg>
      <p class="card-text action__text">Website</p>
    </a>
  `;
  } else {
    return `
    <a class="restaurant__action restaurant__website" href="${url}">
      <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-globe2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855-.143.268-.276.56-.395.872.705.157 1.472.257 2.282.287V1.077zM4.249 3.539a8.372 8.372 0 0 1-1.198-.49 7.01 7.01 0 0 1 2.276-1.52 6.7 6.7 0 0 0-.597.932 8.854 8.854 0 0 0-.48 1.079zM3.509 7.5H1.017A6.964 6.964 0 0 1 2.38 3.825c.47.258.995.482 1.565.667A13.4 13.4 0 0 0 3.508 7.5zm1.4-2.741c.808.187 1.681.301 2.591.332V7.5H4.51c.035-.987.176-1.914.399-2.741zM8.5 5.09V7.5h2.99a12.342 12.342 0 0 0-.399-2.741c-.808.187-1.681.301-2.591.332zM4.51 8.5H7.5v2.409c-.91.03-1.783.145-2.591.332a12.343 12.343 0 0 1-.4-2.741zm3.99 0v2.409c.91.03 1.783.145 2.591.332.223-.827.364-1.754.4-2.741H8.5zm-3.282 3.696A12.63 12.63 0 0 1 7.5 11.91v3.014c-.67-.204-1.335-.82-1.887-1.855a7.776 7.776 0 0 1-.395-.872zm.11 2.276a6.696 6.696 0 0 1-.598-.933 8.853 8.853 0 0 1-.481-1.079 8.38 8.38 0 0 0-1.198.49 7.01 7.01 0 0 0 2.276 1.522zm-1.383-2.964a9.083 9.083 0 0 0-1.565.667A6.963 6.963 0 0 1 1.018 8.5h2.49a13.36 13.36 0 0 0 .437 3.008zm6.728 2.964a7.009 7.009 0 0 0 2.275-1.521 8.376 8.376 0 0 0-1.197-.49 8.853 8.853 0 0 1-.481 1.078 6.688 6.688 0 0 1-.597.933zM8.5 11.909c.81.03 1.577.13 2.282.287-.12.312-.252.604-.395.872-.552 1.035-1.218 1.65-1.887 1.855V11.91zm3.555-.401c.57.185 1.095.409 1.565.667A6.963 6.963 0 0 0 14.982 8.5h-2.49a13.36 13.36 0 0 1-.437 3.008zM14.982 7.5h-2.49a13.361 13.361 0 0 0-.437-3.008 9.123 9.123 0 0 0 1.565-.667A6.963 6.963 0 0 1 14.982 7.5zM11.27 2.461c.177.334.339.694.482 1.078a8.368 8.368 0 0 0 1.196-.49 7.01 7.01 0 0 0-2.275-1.52c.218.283.418.597.597.932zm-.488 1.343c-.705.157-1.473.257-2.282.287V1.077c.67.204 1.335.82 1.887 1.855.143.268.276.56.395.872z"/>
      </svg>
      <p class="card-text action__text">Website</p>
    </a>
  `;
  }
}