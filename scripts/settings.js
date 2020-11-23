function addVerification() {
    //Get user ID
    var user = firebase.auth().currentUser;
    var uid, verified;

    if (user != null) {
        user.providerData.forEach(function (profile) {
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
          });
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