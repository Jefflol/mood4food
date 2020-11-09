var currentrestaurant;

$(document).ready(function() {
  //Getting the current restaurant from html class name element. Could change later if we find a better way.
  db.collection("restaurants").where("name", "==", $(".restaurant__name").text())
    .get()
    .then(function(snap){
      snap.forEach(function(doc) {
        currentrestaurantid = doc.id;
      });
    })
    .catch(function(error) {
      console.log("Error - getting restuarants", error);
    });
});


var loggedon;
var usercurrent;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("true");
    console.log(user.uid);
    usercurrent = user;
    loggedon = true;
  } else {
    console.log("false");
    loggedon = false;
  }
});

document.getElementById("postreview").addEventListener("click", function() {
  if (loggedon == true) {
    submituserreview();
  } else {
    alert("You are not logged in! You cannot make a review!");
  }
});

function submituserreview() {
  db.collection("reviews").add({
    reviewuserid: usercurrent.uid,
    reviewrestaurantid: currentrestaurantid,
    reviewusername: usercurrent.displayName,
    reviewrestaurantname: $(".restaurant__name").text(),
    reviewtext: document.getElementById("reviewform").value,
    reviewtime: Date()
  })
  .then(function(docRef) {
    console.log("Document written with ID: ", docRef.id);
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  });
}