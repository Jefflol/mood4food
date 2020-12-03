/** Holds the current restaurant image file from form input. */
var restaurantImgFile;

/**
 * Add restaurant information to database.
 * @param {Event} e invokes this method 
 */
const addRestaurant = (e) => {
    e.preventDefault();

    let name = $("#nameInput").val();
    let description = $("#descriptionTextArea").val();
    let address = $("#addressInput").val();
    let postalCode = $("#postalCodeInput").val();
    let city = $("#cityInput").val();
    var province = $("#provinceInput").val();
    let phoneNumber = $("#phoneInput").val();
    let url = $("#websiteInput").val();

    let isDineInAvailable = $("#dineinCheckbox").is(":checked");
    let isTakeoutAvailable = $("#takeoutCheckbox").is(":checked");
    let isDeliveryAvailable = $("#deliveryCheckbox").is(":checked");

    let isMaskRequired = $("#maskRequiredCheckbox").is(":checked");
    let isReducedSeatings = $("#reducedSeatingsCheckbox").is(":checked");
    let isDistancedTables = $("#distancedTablesCheckbox").is(":checked");
    let isSanitizingAvailable = $("#sanitizationCheckbox").is(":checked");

    let imgPath; // Path to image file
    let imgRef; // Reference to image for firebase

    if (restaurantImgFile === undefined) {
        imgPath = "restaurantImages/default.jpg";
    } else {
        let formattedName = name.replace(" ", "-");
        imgPath = "restaurantImages/" + formattedName + "_" + restaurantImgFile.name;

        let storageRef = firebase.storage().ref();
        imgRef = storageRef.child('restaurantImages/' + formattedName + '_' + restaurantImgFile.name);

        // Add restaurant image to storage at imgRef path
        imgRef.put(restaurantImgFile)
            .then(() => {
                console.log("Uploaded a blob or file!");
            });
    }

    // write the values into new database document
    db.collection("restaurants")
        .add({
            "name": name,
            "description": description,
            "average_rating": 0,
            "average_cost": 0,
            "average_thumbs": 0,
            "address": address,
            "postal_code": postalCode,
            "city": city,
            "province": province,
            "phone_number": phoneNumber,
            "url": url,
            "isDineInAvailable": isDineInAvailable,
            "isTakeoutAvailable": isTakeoutAvailable,
            "isDeliveryAvailable": isDeliveryAvailable,
            "isMaskRequired": isMaskRequired,
            "isReducedSeatings": isReducedSeatings,
            "isDistancedTables": isDistancedTables,
            "isSanitizingAvailable": isSanitizingAvailable,
            "image": imgPath,
            "total_star_review": 0,
            "total_cost_review": 0,
            "total_thumbs_review": 0,
            "review_count": 0
        })
        .then(() => {
            console.log("Added " + name + " to database");
            window.location.assign("settings.html");
        })
        .catch(error => {
            console.log("Error adding to firestore: ", error);
        });
}

/**
 * Return to restaurant page.
 */
const returnToRestaurantPage = () => {
    window.location.assign("restaurant.html");
}

/**
 * Updates restaurantImgFile with the image file given by user.
 * @param {Event} event event
 */
const updateRestaurantImage = event => {
    restaurantImgFile = event.target.files[0];
}

/**
 * Attach event handlers method to button on document load.
 */
const attachEventHandlers = () => {
    // Add restaurant when submitting form
    $("#restaurantForm").on("submit", addRestaurant);

    // Cancel restaurant form and return to restaurant page
    $("#cancelRestaurantForm").on("click", returnToRestaurantPage);

    // Update restaurant image file
    $("#restaurantImageFileInput").on("change", event => updateRestaurantImage(event));
}
$(document).ready(attachEventHandlers);