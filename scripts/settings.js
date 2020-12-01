$(document).ready(function() {
  //Get user ID, verification value
  var uid, verified;

  //Represents add a restuarant page. Set to hidden if user is not verified
  let add = document.getElementById("addRestaurantModal");
  add.style.display = "none";

  /**
   * Method for adding verification box on user profile picture, 
   * hiding and displaying either verifcation and add restaurant sections.
   * 
   * Checks if there is a user logged in currently.
   */
  firebase.auth().onAuthStateChanged(function (user) {
    //Checks if user is valid and logged on
    if (user) {
      console.log("User logged on = true");
      uid = user.uid;

      //Store value for verification in users collection in Firebase
      var ref = db.collection("users").doc(uid);
      ref.get().then(function(doc){
        verified = doc.data().verified;
        console.log("Verification: " + verified);

        //Represents the verification box
        let verification = 
          "<div id =\"verification\">Verified Owner"
            +"<svg width=\"2em\" height=\"2em\" viewBox=\"0 0 16 16\" class=\"bi bi-check\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\">"
              +"<path fill-rule=\"evenodd\" d=\"M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z\"/>"
            +"</svg>"
          +"</div>";

        //Represents "Add a Restaurant", and "Verify User" sections
        let add = document.getElementById("addRestaurantModal");
        let verifyUser = document.getElementById("verify");

        //Checks value of verification for user
        //If the user is verified, verification section will be replaced
        //with add a restaurant section
        if (verified) {
          console.log("User is Verified.");
          $(".user_name").after(
            $(verification).addClass("verification")
          );
          verifyUser.style.display = "none";
          add.style.display = "block";
        }
      });
    //Else keep verification section shown, add a restaurant section hidden
    //and print error to console
    } else {
      console.log("User logged on = false");
    }
  });
});

/**
 * Method for logging out the user.
 */
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