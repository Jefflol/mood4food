//The restaurant's id
var currentrestaurantid;
//Review number so that we can have multiple reviews shown
var reviewnum = 1;

$(document).ready(function () {
    //Getting the restaurant id from the address
    currentrestaurantid = window.location.href.slice(-20)
    db.collection("restaurants").doc(currentrestaurantid)
        .get()
        .then(function (snap) {
            // console.log("Restaurant id= " + currentrestaurantid)
            db.collection("reviews").where("reviewrestaurantid", "==", currentrestaurantid)
                .get()
                .then(function (snap) {
                    snap.forEach(function (doc) {
                        var stars = doc.data().reviewstars;
                        var name = doc.data().reviewusername;
                        var time = doc.data().reviewtime;
                        var text = doc.data().reviewtext;
                        var cost = doc.data().reviewcost;
                        var thumbs = doc.data().reviewthumbs;

                        var reviewObj = {
                            stars,
                            name,
                            time,
                            text,
                            cost,
                            thumbs,
                            reviewnum
                        }
                        reviewnum = reviewnum + 1;
                        // console.log(reviewObj);
                        displayReview(reviewObj);
                    });
                })
                .catch(function (error) {
                    // console.log("Error - getting reviews", error);
                });
        })
        .catch(function (error) {
            // console.log("Error - getting restuarants", error);
        });


    var loggedon;
    var usercurrent;

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // console.log("User logged on = true");
            // console.log(user.uid);
            userName = user.displayName;
            usercurrent = user;
            loggedon = true;
        } else {
            console.log("User logged on = false");
            loggedon = false;
        }
    });

    /**
     * Adding listener for the star ratings
     */
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

    /**
     * Adding listener for the cost ratings
     */
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

    /**
     * Adding listener for posting review
     */
    document.getElementById("postreview").addEventListener("click", function () {
        if (loggedon == true) {
            submituserreview();
        } else {
            alert("You are not logged in! You cannot make a review!");
        }
    });

    /**
     * Function that submits user review
     */
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
                reviewcost: userCostRating,
                reviewthumbs: userThumbs
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

        // Update review data in restaurant documents
        updateReviews(userStarRating, userCostRating, userThumbs);
    }

});

/**
 * Event listeners for thumbs up/down
 */
var userThumbs = 0.5;
$('.like').on('click', function () {
    event.preventDefault();
    $('.dislike').removeClass('active');
    $('.like').addClass('active');
    userThumbs = 1;
});

$('.dislike').on('click', function () {
    event.preventDefault();
    $('.like').removeClass('active');
    $('.dislike').addClass('active');
    userThumbs = 0;
});

/**
 * Function that displays the review given a review object from database
 * @param reviewObj the object that holds the review information
 */
const displayReview = (reviewObj) => {
    let {
        stars,
        name,
        time,
        text,
        cost,
        thumbs,
        reviewnum
    } = reviewObj;
    var reviewCard = $(`
        <!--Other reviews-->
        <div class="reviews__other" data-toggle="modal" data-target="#reviewModal${reviewnum}">
            <div class="other-header__name">${name}</div>
                <div class="reviews__other-header">
                    ${displayThumbs(thumbs)}
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
                            ${displayThumbs(thumbs)}
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

    $("#allReviews").prepend(reviewCard);
}

/**
 * Displays thumbs up or down
 * @param   {Number} thumbs 1 for thumbs up, 0 for thumbs down
 * @return  {HTMLElement}   The HTML element of thumbs
 */
const displayThumbs = (thumbs) => {

    let ratings = $("<div class='other-header__ratings'></div>");

    if (thumbs == 1) {
        ratings.append(`<small>Covid-Friendly?</small><i class="fa fa-thumbs-up selectedThumbs"></i><i class="fa fa-thumbs-down"></i>`);
    } else if (thumbs == 0) {
        ratings.append(`<small>Covid-Friendly?</small><i class="fa fa-thumbs-up"></i><i class="fa fa-thumbs-down selectedThumbs"></i>`);
    } else {
        ratings.append(`<small>Covid-Friendly?</small><i class="fa fa-thumbs-up"></i><i class="fa fa-thumbs-down"></i>`);
    }

    return ratings[0].outerHTML;
}

/**
 * Updates review data of a restaurant document, in particular, star and price rating.
 * @param {Number} userStarRating 
 * @param {Number} userCostRating 
 */
const updateReviews = (userStarRating, userCostRating, userThumbsRating) => {
    let docRef = db.collection("restaurants").doc(currentrestaurantid);

    return db.runTransaction(transaction => {
        return transaction.get(docRef).then(doc => {
            if (!doc.exists) {
                throw "Document does not exist!";
            }

            // Holds review count
            let newReviewCount = doc.data().review_count + 1;

            // Holds total star reviews
            let newTotalStarReview = doc.data().total_star_review + userStarRating;

            // Holds total cost reviews
            let newTotalCostReview = doc.data().total_cost_review + userCostRating;

            // Holds total cost reviews
            let newTotalThumbsReview = doc.data().total_thumbs_review + userThumbsRating;

            // Calculate to update restaurant average star, cost, and thumbs rating
            let newAverageStarRating = newTotalStarReview / newReviewCount;
            let newAverageCostRating = newTotalCostReview / newReviewCount;
            let newAverageThumbsRating = newTotalThumbsReview / newReviewCount;

            // Update firestore
            transaction.update(docRef, {
                "review_count": newReviewCount,
                "total_star_review": newTotalStarReview,
                "total_cost_review": newTotalCostReview,
                "total_thumbs_review": newTotalThumbsReview.toFixed(1),
                "average_rating": newAverageStarRating,
                "average_cost": newAverageCostRating,
                "average_thumbs": newAverageThumbsRating
            });
        });
    }).then(() => {
        console.log("Successfully updated reviews");
    }).catch(error => {
        console.log("Unsuccessful review update: " + error);
    });
}