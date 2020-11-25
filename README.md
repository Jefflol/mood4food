## Mood4Food

* [General info](#general-info)
* [Contributors](#contributors)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
This browser based web application allows users to access COVID-19 Safety Protocols for restaurants.

## Contributors
* Jeffrey C
* Jeffrey J
* Sunmin C
* Toni T

## Technologies
Technologies used for this project:
* HTML
* CSS
* JavaScript / JQuery
* Bootstrap 
* Firebase
	
## Content
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
├── login.html               # login HTML file, this is what users see when you login or create an account
├── main.html                # main HTML file, this is what users see when they log in
├── restaurant.html          # restaurant HTML file, this is what users see when you browse for restaurants
├── restaurant-form.html     # restaurant form HTML file, this is what users see when you want to register a restaurant
├── restaurant-details.html  # restaurant details HTML file, this is what users see when you want to view more details about restaurants
├── settings.html            # settings HTML file, this is what users see when you click on settings for more options
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /background.jpg          # Banner background image
    /dollar_filled.svg       # Icon for cost rating
    /MugIcon.png             # Mug Icon for '4' in Mood'4'Food
    /star_filled.svg         # Icon for star rating
├── scripts                  # Folder for scripts
    /display_user.js         #
    /firebase_api_mood       # Firebase database javascript
    /jquery.timeago.js       #
    /login.js                # Login javascript
    /restaurant-details.js   # Restaurant details javascript
    /restaurant-form.js      # Restaurant form javascript
    /restaurant.js           # Restaurant page javascript
    /reviews.js              # Reviews javascript
    /settings.js             # Settings javascript
    
├── styles                   # Folder for styles
    /palette-1.css           # 1st Palette theme
    /palette-2.css           # 2nd Palette theme
    /restaurant-details.css  # Restaurant Details Page stylesheet
    /restaurant-form.css     # Restaurant Form Page stylesheet
    /restaurant.css          # Restaurant Page stylesheet
    /settings.css            # Settings Page stylesheet
    /style.css               # Main stylesheet
Firebase hosting files: 
├── .firebaserc...