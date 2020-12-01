## Mood4Food

* [General info](#general-info)
* [Contributors](#contributors)
* [Technologies](#technologies)
* [Contents](#content)

## General Info
This browser based web application allows users to access COVID-19 Safety Protocols for restaurants.

## Contributors
* Jeffrey C
* Sunmin C
* Jeffrey J
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
├── .gitignore                 # Git ignore file
├── 404.html                   # 404 HTML file, this is what users see when they access an invalid url path
├── favourites.html            # favourites HTML file, this is where users go to see their favourite restaurants
├── index.html                 # index HTML file, this is where users go to see the landing page
├── login.html                 # login HTML file, this is what users see when you login or create an account
├── restaurant-details.html    # restaurant details HTML file, this is what users see when you want to view more details about restaurants
├── restaurant-form.html       # restaurant form HTML file, this is what users see when you want to register a restaurant
├── restaurant.html            # restaurant HTML file, this is what users see when you browse for restaurants
├── settings.html              # settings HTML file, this is what users see when you click on settings for more options
├── verification.html          # verification HTML file, this is where users go to verify themselves as an owner
└── README.md

It has the following subfolders and files:
├── .git                       # Folder for git repo

├── images                     # Folder for images
    /avatar.jpd                # Dummy profile display picture
    /background-dark.jpg       # Banner background image
    /dollar_filled.svg         # Icon for cost rating
    /MugIcon.png               # Mug Icon for '4' in Mood'4'Food
    /star_filled.svg           # Icon for star rating
    /undraw_cookinglyxy.svg    # Illustration for landing and 404 page

├── scripts                    # Folder for scripts
    /display_user.js           # Displaying user names JavaScript
    /favourites.js             # Favourites page JavaScript
    /firebase_api_mood.js      # Firebase api JavaScript
    /jquery.timeago.js         # Allows for review time stamps JavaScript (attribution provided)
    /login.js                  # Login JavaScript
    /restaurant-components.js  # General restaurant components JavaScript
    /restaurant-details.js     # Restaurant details JavaScript
    /restaurant-form.js        # Restaurant form JavaScript
    /restaurant.js             # Restaurant page JavaScript
    /reviews.js                # Reviews JavaScript
    /settings.js               # Settings JavaScript
    /users.js                  # Users JavaScript
    /verification.js           # Verification JavaScript
    
├── styles                     # Folder for styles
    /index.css                 # Landing page Stylesheet
    /palette.css               # Mood4Food colour theme Stylesheet
    /restaurant-components.css # General restaurant components Stylesheet
    /restaurant-details.css    # Restaurant details page Stylesheet
    /restaurant-form.css       # Restaurant form page Stylesheet
    /restaurant.css            # Restaurant page Stylesheet
    /settings.css              # Settings page Stylesheet
    /verification.css          # Verification page Stylesheet

Firebase hosting files: 
├── .firebaserc...