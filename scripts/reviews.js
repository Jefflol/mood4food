var currentrestaurantid;
var reviewnum = 1;

$(document).ready(function () {
  //Getting the current restaurant from html class name element. Could change later if we find a better way.
  // db.collection("restaurants").where("name", "==", $(".restaurant__name").text())
  currentrestaurantid = window.location.href.slice(-20)
  db.collection("restaurants").doc(currentrestaurantid)
    .get()
    .then(function (snap) {
      console.log("Restaurant id= " + currentrestaurantid)
      db.collection("reviews").where("reviewrestaurantid", "==", currentrestaurantid)
        .get()
        .then(function (snap) {
          snap.forEach(function (doc) {
            var stars = doc.data().reviewstars;
            var name = doc.data().reviewusername;
            var time = doc.data().reviewtime;
            var text = doc.data().reviewtext;
            var cost = doc.data().reviewcost;

            var reviewObj = {
              stars,
              name,
              time,
              text,
              cost,
              reviewnum
            }
            reviewnum = reviewnum + 1;
            console.log(reviewObj);
            displayReview(reviewObj);
          });
        })
        .catch(function (error) {
          console.log("Error - getting reviews", error);
        });
    })
    .catch(function (error) {
      console.log("Error - getting restuarants", error);
    });


  var loggedon;
  var usercurrent;

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User logged on = true");
      console.log(user.uid);
      userName = user.displayName;
      usercurrent = user;
      loggedon = true;
    } else {
      console.log("User logged on = false");
      loggedon = false;
    }
  });

  var userStarRating;
  document.getElementById("ratingstars").addEventListener("click", function () {
    var radios = document.getElementsByName("rating");
    if (radios[0].checked) {
      userStarRating = 5;
      console.log("Current selected user rating: " + userStarRating)
    } else if (radios[1].checked) {
      userStarRating = 4;
      console.log("Current selected user rating: " + userStarRating)
    } else if (radios[2].checked) {
      userStarRating = 3;
      console.log("Current selected user rating: " + userStarRating)
    } else if (radios[3].checked) {
      userStarRating = 2;
      console.log("Current selected user rating: " + userStarRating)
    } else if (radios[4].checked) {
      userStarRating = 1;
      console.log("Current selected user rating: " + userStarRating)
    }
  });

  var userCostRating;
  document.getElementById("ratingcosts").addEventListener("click", function () {
    var radios = document.getElementsByName("ratingcost");
    if (radios[0].checked) {
      userCostRating = 5;
      console.log("Current selected user cost rating: " + userCostRating)
    } else if (radios[1].checked) {
      userCostRating = 4;
      console.log("Current selected user cost rating: " + userCostRating)
    } else if (radios[2].checked) {
      userCostRating = 3;
      console.log("Current selected user cost rating: " + userCostRating)
    } else if (radios[3].checked) {
      userCostRating = 2;
      console.log("Current selected user cost rating: " + userCostRating)
    } else if (radios[4].checked) {
      userCostRating = 1;
      console.log("Current selected user cost rating: " + userCostRating)
    }
  });

  document.getElementById("postreview").addEventListener("click", function () {
    if (loggedon == true) {
      submituserreview();
    } else {
      alert("You are not logged in! You cannot make a review!");
    }
  });

  function submituserreview() {
    var d = new Date();
    db.collection("reviews").add({
        reviewuserid: usercurrent.uid,
        reviewrestaurantid: currentrestaurantid,
        reviewusername: usercurrent.displayName,
        reviewrestaurantname: $(".restaurant__name").text(),
        reviewtext: document.getElementById("reviewform").value,
        reviewtime: d.toISOString(),
        reviewstars: userStarRating,
        reviewcost: userCostRating
      })
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
        alert("Review succesfully submitted!");
        location.reload();
        window.scrollTo(0, 0);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  }

});



const displayReview = (reviewObj) => {
  let {
    stars, name, time, text, cost, reviewnum
  } = reviewObj;
  var reviewCard = $(`
      <!--Other reviews-->
      <div class="reviews__other" data-toggle="modal" data-target="#reviewModal${reviewnum}">
      <div class="other-header__name">${name}</div>
        <div class="reviews__other-header">
          ${displayRatings(stars)}
          ${displayRatingsCost(cost)}
          <div class="other-header__date"><small>${jQuery.timeago(time)}</small></div>
        </div>
        <div class="reviews__other-body">
          <p>${text}</p>
        </div>
      </div>

      <!-- Modal to view full review -->
      <div class="reviews__other-modal modal fade" id="reviewModal${reviewnum}" tabindex="-1" role="dialog"
        aria-labelledby="reviewModalLabel${reviewnum}" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="reviewModalLabel${reviewnum}">
                ${displayRatings(stars)}
                ${displayRatingsCost(cost)}
              </h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="reviews__other" data-toggle="modal" data-target="#reviewModal${reviewnum}">
                <div class="reviews__other-header">
                  <div class="other-header__name">${name}</div>
                  <div class="other-header__date"><small>${jQuery.timeago(time)}</small></div>
                </div>
                <div class="reviews__other-body">
                  <p>${text}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
      <br/>
  `);

  $("#allReviews").append(reviewCard);
}

/**
 * Displays the approriate number of stars given a rating.
 * --Taken from Jeff Chen's code-- 
 * @param   {Number} rating The average rating for a restaurant
 * @return  {HTMLElement}   The HTML element of star ratings
 */
const displayRatings = (rating) => {
  const MAX_STARS = 5;
  let fullStars = Math.trunc(rating);
  let halfStar = (rating - fullStars) >= 0.5 ? 1 : 0;
  let emptyStars = MAX_STARS - rating - halfStar;

  let ratings = $("<div class='other-header__ratings'></div>");

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
 * Displays the approriate number of stars given a rating.
 * --Taken from Jeff Chen's code-- 
 * @param   {Number} rating The average rating for a restaurant
 * @return  {HTMLElement}   The HTML element of star ratings
 */
const displayRatingsCost = (rating) => {
  const MAX_COST = 5;
  let fullCost = Math.trunc(rating);
  let halfCost = (rating - fullCost) >= 0.5 ? 1 : 0;
  let emptyCost = MAX_COST - rating - halfCost;

  let ratings = $("<div class='other-header__ratings'></div>");

  // Append full dollar signs to rating
  for(let i = 0; i < fullCost; i++) {
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
  for(let i = 0; i < emptyCost; i++) {
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