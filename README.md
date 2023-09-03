# Free-Tour-Tickets - https://freetourtickets.onrender.com/
NOTE: To access admin panel on prod, just use **username-iamadmin** (if admin account is already created) 
OR create a new user with username - **iamadmin**.


# Description
This website is for artists where they can earn a free concert ticket by uploading song-covers/sketches of their favourite singers/bands who are currently touring around the world.
The app. has 2 panels:
-> **User** - where user can upload their cover songs or sketches to get the free ticket.
-> **Admin panel** - An admin can see all the submissions of events and can select which user to give a free ticket by shortlisting their uploads.
For admin, just create an account with username "iamadmin".



# Installation & Setup (for local environment)
1) You should have NodeJS and mongoDB installed in your system.

2) Go to root directory of project and run command `node seedDB.js` in your terminal, this will create required databases for the website's events.

3) In root directory of project, run command `npm install` in your terminal to install all the packages needed for the website.

4) After that run the app with command -  `node app.js` .

5) Goto address localhost:3030.

