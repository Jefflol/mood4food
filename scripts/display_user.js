$(document).ready(function () {
    var userNameToShow, emailToShow;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //sets userName
            userNameToShow = user.displayName;
            //sets email
            emailToShow = user.email;
            //Displays all userNames in document, must be called from onAuthStateChanged to work because of asynchronous
            documentDisplayName();

        } else {
            // console.log("User logged on = false");
        }
    });

    //FUNCTION THAT SETS ALL INSTANCES OF CLASS TO THE CURRENT USERNAME AND EMAIL
    function documentDisplayName() {
        var x = document.getElementsByClassName("user_name");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].innerHTML = userNameToShow;
        }
        var y = document.getElementsByClassName("mouse-over-username");
        var num;
        for (num = 0; num < y.length; y++) {
            y[num].setAttribute("title", "Logged in as: " + userNameToShow)
        }
        var e = document.getElementsByClassName("user_email");
        for (i = 0; i < e.length; i++) {
            e[i].innerHTML = emailToShow;
        }
        // console.log("Updated username");
    }
});