function favourites() {
  $('.fav_true').toggle();
  db.collection("users").doc(userName).data("favs")
    .get()
    .then(function (snap) {
      var array = snap.val();
      for (var i in array) {
        var value = array[i]
        console.log(value);
        if (value == getRestaurantId) { 
          $('.fav_true').toggle();
          $('.fav_false').toggle();
        }
      }
    });
  document.getElementById("restaurant__favourite").addEventListener("click", function () {
    db.collection("users").doc(userName).data("favs")
      .get()
      .then(function (snap) {
        var value = array[i]
        console.log(value);
        if (value == getRestaurantId) { 
          favs: firebase.firestore.FieldValue.arrayRemove(getRestaurantId);
        } else {
          favs: firebase.firestore.FieldValue.arrayUnion(getRestaurantId);
        }
        $('.fav_true').toggle();
        $('.fav_false').toggle();
    });
    $('.fav_true').toggle();
    $('.fav_false').toggle();
  })
};