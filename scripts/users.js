$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {

        // Redirect users to login page if they're not logged in a clicked on accountSettings
        if (user) {
            console.log("User is logged in");
            $("#accountSettings").attr("href", "../settings.html");
        } else {
            console.log("User is not logged in");
            $("#accountSettings").attr("href", "../login.html");
        }
    });
});