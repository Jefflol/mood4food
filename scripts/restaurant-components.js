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
 * Compiles restaurant data from firestore into a suitable object.
 * @param {Object} doc 
 * @returns parsable restaurant object
 */
const compileRestaurantData = (doc) => {
  RESTAURANT_ID = doc.id;

  let id = doc.id;
  let name = doc.data().name;
  let description = doc.data().description;
  let avgRating = doc.data().average_rating;
  let avgCost = doc.data().average_cost;
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

  let avgThumbs = doc.data().average_thumbs;
  avgThumbs = avgThumbs * 100;

  let image = doc.data().image;

  // Replace restaurant placeholder image once actual image has been downloaded
  let pathReference = firebase.storage().ref(image);
  pathReference.getDownloadURL().then(function (url) {
      $(`#${id}-restImage`).attr("src", url);
  })

  return {
      id,
      name,
      description,
      avgRating,
      avgCost,
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
  };
}

/**
 * Displays whether safety protocols exists for a restaurant.
 * @param   {Array} safetyProtocolList The boolean array of safety protocols
 * @return  {HTMLElement}              The HTML element of the verification of safety protocol availability
 */
const displaySafetyProtocols = (safetyProtocolList) => {
  if (Object.values(safetyProtocolList).includes(true)) {
      return `
          <div class="restaurant__safety-protocol">
              <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-check" fill="rgb(103, 196, 75)" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
              </svg>
              <p class="card-text" style="color: rgb(103, 196, 75)">Safety Protocol Available</p>
          </div>
      `;
  } else {
      return `
          <div class="restaurant__safety-protocol">
              <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-x" fill="rgb(244, 13, 26)" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
              </svg>
              <p class="card-text" style="color: rgb(244, 13, 26)">Safety Protocol Unavailable</p>
          </div>
      `;
  }
}

/**
 * Displays the lists of safety protocols of a restaurant if it exists
 * @param   {Array} safetyProtocolList The boolean array of safety protocols
 * @return  {HTMLElement}              The HTML element of the lists of safety protocols (or return empty string)
 */
const displaySafetyProtocolsAsList = (safetyProtocolList) => {
    let {
      isMaskRequired,
      isReducedSeatings,
      isDistancedTables,
      isSanitizingAvailable
    } = safetyProtocolList;
    // let safetyProtocols = $("<div class='restaurant__feature-group'></div>");
    let safetyProtocols = $("<div></div>");
  
    if (!Object.values(safetyProtocolList).includes(true)) {
      return "";
    }
  
    if (isMaskRequired) {
      safetyProtocols.append(`
        <div class="restaurant__feature--safety" style="color: #3AAFA9">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
          </svg>
          <p class="card-text">Mask Required</p>
        </div>
      `);
    }
  
    if (isReducedSeatings) {
      safetyProtocols.append(`
        <div class="restaurant__feature--safety" style="color: #3AAFA9">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
          </svg>
          <p class="card-text">Reduced Seatings</p>
        </div>
      `);
    }
  
    if (isDistancedTables) {
      safetyProtocols.append(`
        <div class="restaurant__feature--safety" style="color: #3AAFA9">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
          </svg>
          <p class="card-text">Distanced Tables</p>
        </div>
      `);
    }
  
    if (isSanitizingAvailable) {
      safetyProtocols.append(`
        <div class="restaurant__feature--safety" style="color: #3AAFA9">
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
          </svg>
          <p class="card-text">Sanitzing Stations Available</p>
        </div>
      `);
    }
    
    // return safetyProtocols[0].outerHTML;
    return safetyProtocols[0].innerHTML;  
}

/**
 * Displays the lists of features of a restaurant if it exists.
 * @param   {Array} featureList The boolean array of features
 * @return  {HTMLElement}       The HTML element of the lists of features (or return empty string)
 */
const displayFeaturesAsList = (featureList) => {
    let {
      isDineInAvailable,
      isTakeoutAvailable,
      isDeliveryAvailable
    } = featureList;
    // let features = $("<div class='restaurant__feature-group'></div>");
    let features = $("<div></div>");
  
    if (!Object.values(featureList).includes(true)) {
      return "";
    }
  
    if (isDineInAvailable) {
      features.append(`
              <div class="restaurant__feature--other">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                  </svg>
                  <p class="card-text">Dine-in Available</p>
              </div>
          `);
    }
  
    if (isTakeoutAvailable) {
      features.append(`
              <div class="restaurant__feature--other">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                  </svg>
                  <p class="card-text">Takeout Available</p>
              </div>
          `);
    }
  
    if (isDeliveryAvailable) {
      features.append(`
              <div class="restaurant__feature--other">
                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>
                  </svg>
                  <p class="card-text">Delivery Available</p>
              </div>
          `);
    }
  
    return features[0].innerHTML;
}

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
 * Adds restaurant phone number as an action if phone is available, else make it disabled
 * @param {String} phoneNumber restaurant's phone number
 */
const displayPhoneAction = (phoneNumber) => {
  if (!phoneNumber) {
      return `
          <div class="restaurant__action isDisabled">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-telephone" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
              </svg>
              <p class="card-text action__text">Call</p>
          </div>
      `;
  } else {
      return `
          <a class="restaurant__action" href="tel:${phoneNumber}">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-telephone" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"/>
              </svg>
              <p class="card-text action__text">Call</p>
          </a>
      `;
  }
}

/**
 * Adds restaurant address as an action if address is available, else make it disabled
 * @param {String} address      The address of the restaurant
 * @param {String} postal_code  The postal code of the restaurant
 * @param {String} city         The city restaurant is located in
 * @param {String} province     The province restaurant is located in
 */
const displayGoogleMapAction = (address, postal_code, city, province) => {
  let formattedAddress = "";

  if (address) {
      formattedAddress += (address + "+");
  }

  if (city) {
      formattedAddress += (city + "+");
  }

  if (province) {
      formattedAddress += (", " + province);
  }

  if (postal_code) {
      formattedAddress += (postal_code + ", Canada");
  }

  if (!formattedAddress) {
      return `
          <div class="restaurant__action isDisabled">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-map" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98l4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z"/>
              </svg>
              <p class="card-text action__text">Directions</p>
          </div>
      `;
  } else {
      return `
          <a class="restaurant__action" href="https://www.google.com/maps?q=${formattedAddress}">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-map" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.502.502 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103zM10 1.91l-4-.8v12.98l4 .8V1.91zm1 12.98l4-.8V1.11l-4 .8v12.98zm-6-.8V1.11l-4 .8v12.98l4-.8z"/>
              </svg>
              <p class="card-text action__text">Directions</p>
          </a>
      `;
  }
}

/**
 * Adds restaurant URL as an action if URL is available, else make it disabled
 * @param {String} url 
 */
const displayWebsite = (url) => {
  if (!url) {
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

/**
 * Display thumbs up or down depending of if the restaurant is Covid-Friendly or not
 * @param {Number} avgThumbs the average covid-friendly rating
 */
const displayThumbsMain = (avgThumbs) => {
  if (avgThumbs >= 50){
      return (`
          <div class="restaurant__covid-rating" data-toggle="tooltip" data-placement="top" title="Majority of users think this restaurant is COVID-friendly!">
              <i class="fa fa-thumbs-up selectedThumbs"></i>
              ${avgThumbs}%
          </div>
      `);
  } else {
      return (`
          <div class="restaurant__covid-rating" data-toggle="tooltip" data-placement="top" title="Majority of users think this restaurant is not COVID-friendly!">
              <i class="fa fa-thumbs-down selectedThumbs"></i>
              ${avgThumbs}%
          </div>
      `);
  }
}