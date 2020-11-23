/** Holds the current restaurant image file from form input. */
var restaurantVerification;

/**
 * Add restaurant information to database.
 * @param {Event} e invokes this method 
 */
const addVerification = (e) => {
    e.preventDefault();

    let verify = $("#claimRestaurant").is(":checked");

    let imgPath;  // Path to image file
    let imgRef;   // Reference to image for firebase
  
    if (restaurantVerification === undefined) {
        console.log("Verification File Upload Failed");
        imgPath = "restaurantVerification/default.jpg";
    } else {
        imgPath = "restaurantVerification/" + restaurantVerification;

        let storageRef = firebase.storage().ref();
        imgRef = storageRef.child('restaurantVerification/' + restaurantVerification);

        // Add verification image to storage at imgRef path
        imgRef.put(restaurantVerification)
        .then(() => {
            console.log("Uploaded Verification File");
        });
    }

    //Get user ID
    var user = firebase.auth().currentUser;
    var name, email, uid;

    if (user != null) {
        name = user.displayName;
        email = user.email;
        uid = user.uid;  //user ID unique to the firebase project
    }
    //Add values into user data collect
    db.collection("users").doc(uid).set({
        "name": name,
        "email": email,
        "verified": verify,
        "image": imgPath
    })
    .then(() => {
        if (verify) {
            console.log("Verification Success! Owner status added to database");
        } else {
            console.log("Verification Fail. User status added to database");
        }
        window.location.assign("settings.html");
    })
    .catch(error =>  {
        console.log("Error adding to firestore: ", error);
    });
}

/**
 * Return to settings page.
 */
const returnToSettingsPage = () => {
    window.location.assign("settings.html");
}

/**
 * Updates restaurantVerification with the image file given by user.
 * @param {Event} event event
 */
const updateVerifcationImage = event => {
    restaurantVerification = event.target.files[0];
}

/**
 * Attach event handlers method to button on document load.
 */
const attachEventHandlers = () => {
    // Add verification when submitting form
    $("#verificationForm").on("submit", addVerification);

    // Cancel restaurant form and return to restaurant page
    $("#cancelVerification").on("click", returnToSettingsPage);

    // Update restaurant image file
    $("#verificationImageFileInput").on("change", event => updateVerificationImage(event));
}

$(document).ready(attachEventHandlers);