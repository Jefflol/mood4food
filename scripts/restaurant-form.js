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

  // write the values into new database document
  db.collection("restaurants")
    .add({
      "name": name,
      "description": description,
      "average_rating": 0,
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
      "isSanitizingAvailable": isSanitizingAvailable
    })
    .then(() => {
      console.log("Added " + name + " to database");
      window.location.assign("restaurant.html");
    })
    .catch(error =>  {
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
 * Attach event handlers method to button on document load.
 */
const attachEventHandlers = () => {
  // Add restaurant when submitting form
  $("#restaurantForm").on("submit", addRestaurant);

  // Cancel restaurant form and return to restaurant page
  $("#cancelRestaurantForm").on("click", returnToRestaurantPage)
}
$(document).ready(attachEventHandlers);