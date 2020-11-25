$(document).ready(function() {
  //Get user ID
  var usercurrent, uid, verified;
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log("User logged on = true");
      uid = user.uid;
      verified = user.data("verified");
      usercurrent = user;
      
      async function getMarker() {
        const snapshot = await firebase.firestore().collection('users').get();
        return snapshot.docs.map(doc => doc.data());
      }

      getMarker();

    } else {
      console.log("User logged on = false");
    }
  });

  let verification = "<div id =\"verification\">Verified</div>";

  if (verified) {
      console.log("User is Verified.");
      $(".user_name").append(verification);
  }
});



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