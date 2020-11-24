function addVerification() {
    //Get user ID
    var user = firebase.auth().currentUser;
    var uid, verified;

    if (user != null) {
        uid = user.uid;  //user ID unique to the firebase project
        verified = user.verified;
        console.log("User is Verified.");
    }

    let verification = "<div id =\"verification\">Verified</div>";

    if (verified) {
        console.log("User is Verified.");
        $(".user_name").append(verification);
    }
}

$(document).ready(addVerification);

function logoutUser() {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("Sign out successful!");
        window.location.assign("restaurant.html");
    }).catch(function(error) {
        // An error happened.
        console.log("Unsuccessful sign out: " + error);
        window.location.assign("settings.html");
    });
}

$("#logoutBtn").on("click", () => logoutUser());



//test firebase database
// var firstV, lastV;

// function Ready(){
//     firstV = document.getElementById('first').value;
//     lastV = document.getElementById('last').value;
// }

// document.getElementById('submit-changes').onclick = function() {
//     Ready();
//     firebase.database().ref('user/'+firstV).set({
//         FirstName: firstV,
//         LastName: lastV

//     });
// }