var express = require("express"),
  app = express(),
  methodOverride = require("method-override"),
  mongoose = require("mongoose"),
  multer = require("multer"),
  bodyParser = require("body-parser"),
  expressSession = require("express-session"),
  passport = require("passport"),
  LocalStrategy = require('passport-local'),
  passportLocalMongoose = require("passport-local-mongoose"),
  bcrypt = require("bcrypt"),
  Celebrity = require("./models/celebrity"),
  Order = require("./models/order"),
  Upload = require("./models/upload"),
  Event = require("./models/event"),
  User = require("./models/user"),
  Submission = require("./models/submission"),
  path = require("path");

mongoose.connect("mongodb://localhost/ftt4git", {
  useNewUrlParser: true
});

// --------------------------------------------  <APP USES> --------------------------------------------------//

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(require('express-session')({
  secret: 'very secret words',
  resave: false,
  saveUninitialized: false
}));
app.use(expressSession({
  secret: "Tommy is the best",
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

// --------------------------------------------  </APP USES> --------------------------------------------------//


// -----------------------------------------  <PASSPORT SETUP> ----------------------------------------------- //

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //(encoding) responsible for reading the session,taking data from that session and give back to session
passport.deserializeUser(User.deserializeUser()); //(unencoding) and again serealizing for
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
})
// -----------------------------------------  </PASSPORT SETUP> ----------------------------------------------- //


// ======================================= Set Storage Enging for multer ======================================= //

var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


var upload = multer({
  storage: storage
}).fields([{
    name: "sketch"
  },
  {
    name: "cover"
  }
]);

// Check file type
function checkFileType(file, cb) {
  var filetypes = /jpeg|jpg|png|gif/;
  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  // check mime 
  var mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('error: images only');
  }
}

// ========================================== </MULTER SETUP DONE> ========================================//


// Authentication Middleware //

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// ================================================== ROUTES ================================================================//

app.get("/", function (req, res) {
  res.render("home");
});


// app.post('/login', function(req,res){
//   passport.authenticate('local', 
//     { successRedirect: '/users/' + req.body.username, 
//       failureRedirect: '/login'
//     }), function(req,res){
//   }});
app.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    // Redirect if it fails
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      // Redirect if it succeeds
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});


app.get("/users/:id", function (req, res) {
  res.render("home");
})

app.get("/grids", function (req, res) {
  Celebrity.find({}, function (err, allcelebs) {
    if (err) {
      console.log(err);
    } else {
      res.render("grids", {
        celeb: allcelebs
      });
    }
  });
});


app.post("/register", function (req, res) {
  User.register(new User({
    username: req.body.username
  }), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }
    passport.authenticate("local")(req, res, function () {
      User.findOne({
        username: req.body.username
      }, function (err, updateUser) {
        if (err) {
          console.log(err);
        } else {
          updateUser.firstName = req.body.firstname;
          updateUser.lastName = req.body.lastname;
          updateUser.save();
        }
      });
      return res.redirect('/users/' + user.username);
    });
  });
});


app.get("/events/:id", function (req, res) {
  Celebrity.findById(req.params.id, function (err, allcelebs) {
    if (err) {
      console.log(err);
    } else {
      console.log(req.params.id);
      var getCeleb = allcelebs.celebName;
      console.log(allcelebs._id);
      Event.findOne({
        celebName: getCeleb
      }, function (err, events) {
        res.render("newevent", {
          event: events,
          celeb: allcelebs
        });
      });
    }
  });
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});
// app.get("/register/:id", function(req,res){
//   res.render("register", id);
// });

app.get("/artworks/:id/:tourIndex", isLoggedIn, function (req, res) {
  //if(isLogin() == false){
  // redirect to /register/id
  //} 
  Event.findById(req.params.id, function (err, events) {
    if (err) {
      console.log(err);
    } else {
      res.render("artworks", {
        event: events,
        tourIndex: req.params.tourIndex
      });
    }
  });
});

app.post("/greetings/:id", isLoggedIn, function (req, res) {
  var loggedInUser = req.user,
    userId = loggedInUser._id,

    firstname = req.body.firstname;
  secondname = req.body.secondname;
  email = req.body.email;
  number = req.body.number;
  sketch = req.body.sketch;
  cover = req.body.cover;
  comment = req.body.comment;
  tour_index = req.body.tour_index;
  newSubmission = {
    firstName: firstname,
    secondName: secondname,
    email: email,
    mobileNo: number,
    sketch: sketch,
    cover: cover,
    comment: comment
  };

  console.log({
    sketch
  })
  console.log({
    cover
  })
  console.log({
    sketchPath: `/upload/${sketch}`
  })
  console.log({
    coverPath: `/upload/${cover}`
  })


  Submission.create(newSubmission, function (err, newSubmission) {
      if (err) {
        console.log(err);
      } else {
        console.log("New Submission is created");
        console.log(newSubmission);
      }
    }

  );


  upload(req, res, function (err) {
    if (err) {
      res.redirect("artworks/:id");
      console.log("Multer error occured when uploading image(sketch)");
    } else {
      console.log(req.files);
      console.log(req.body.sketch);
      console.log(req.body.cover);
      // console.log(req.files.sketch); 
      // console.log(req.files.cover);

      // console.log(req.files[0]);
      // console.log(req.files[1]);
      // Upload.create({sketch:req.files.path}, function(err,up){console.log(up);});
    }
  });

  Order.create({
    userId: userId,
    eventId: req.params.id,
    tourIndex: req.body.tour_index
  }, function (err, order) {
    if (err) {
      console.log(err);
    } else {
      console.log(order);
    }
  })

  Event.findById(req.params.id, function (err, events) {
    if (err) {
      console.log(err);
      res.redirect("artworks");
    } else {
      res.render("greetings", {
        event: events,
        suber: newSubmission,
        tourIndex: tour_index
      });
    }
  });
});

app.get("/submissions", isLoggedIn, function (req, res) {
  Submission.find({}, function (err, submissions) {
    if (err) {
      console.log(err);
    } else {
      res.render("submissions", {
        submission: submissions
      });
      console.log(submissions);
    }
  });
});


app.get("/orders", isLoggedIn, function (req, res) {

  //   var orders = Order.find({userId: loggedInUser._id});
  // orders[
  //   {userId: 1234, eventId: abc, tourIndex: 3},
  //   {userId: 1234, eventId: bcd, tourIndex: 0}
  // ]


  // events[
  //   { _id: abc, name: dipesh, bg_Image: DIP.jpg, tourCity ... },
  //   { _id: bcd, name: shubh, bg_Image: SHU.jpg, tourCity ... }
  // ];
  // var finalOrders = [];
  // orders.forEach(function(order){

  // event = Event.findOne({_id: order.eventId});
  //   { _id: abc, name: dipesh, bg_Image: DIP.jpg, tourCity ... },

  // event["tourIndex"] = order.tourIndex;
  //   { _id: abc, name: dipesh, bg_Image: DIP.jpg, tourCity ..., tourIndex: 3 },

  // finalOrders.push(event);
  // })

  // res.render("/orders", {orders: finalOrders})


  Order.find({}, function (err, orders) {
    if (err) {
      console.log(err);
    } else {
      console.log(orders);
      console.log(orders[1].userId);
      Event.findById(orders[1].userId, function (err, events) {
        if (err) {
          console.log(err);
        } else {
          console.log(events);
          res.render("orders", {
            event: events
          });
        }
      })
    }
  })
});

// app.get("/users/:id" , isLoggedIn, function(req,res){
//   res.redirect("/");
// });

app.get("/users/:id/orders", function (req, res) {
  // Order.find({userid:req.user._id})
  var founduser = req.user;
  Order.find({
    userId: founduser._id
  }, function (err, foundOrders) {
    if (err) {
      console.log(err);
    } else {
      var finalOrders = [];

      var userOrders = foundOrders;
      // console.log(userOrders);

      userOrders.forEach(function (order) {
          var event = Event.findOne({
            _id: order.eventId
          });
          event["tourIndex"] = order.tourIndex;
          finalOrders.push(event);
        }) ~
        // console.log(finalOrders);
        res.render("orders", {
          orders: finalOrders
        });
      // var firsteventId = foundOrders[0].eventId;

      // Event.findById(firsteventId, function(err,firstevent)
      // {
      //   if(err){ console.log(err); }
      //   else{
      //   res.render("orders", {order1: foundOrders[0], order2:foundOrders[1], event:event});
      //   }
      // }
    }
  })
  //   var orders = Order.find({userId: loggedInUser._id});
  // orders[
  //   {userId: 1234, eventId: abc, tourIndex: 3},
  //   {userId: 1234, eventId: bcd, tourIndex: 0}
  // ]


  // events[
  //   { _id: abc, name: dipesh, bg_Image: DIP.jpg, tourCity ... },
  //   { _id: bcd, name: shubh, bg_Image: SHU.jpg, tourCity ... }
  // ];
  // var finalOrders = [];
  // orders.forEach(function(order){

  // event = Event.findOne({_id: order.eventId});
  //   { _id: abc, name: dipesh, bg_Image: DIP.jpg, tourCity ... },

  // event["tourIndex"] = order.tourIndex;
  //   { _id: abc, name: dipesh, bg_Image: DIP.jpg, tourCity ..., tourIndex: 3 },

  // finalOrders.push(event);
  // })

});

app.get("/users/:id/edit", function (req, res) {
  console.log(req.user);
  User.findById(req.user._id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit-info", {
        user: foundUser
      });
    }
  })
});


app.put("/users/:id", function (req, res) {
  console.log(req.body.user.username);
  User.findByIdAndUpdate(req.user._id, req.body.user, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      user.save();
      res.redirect("/users/" + req.body.user.username);
    }
  })

  // User.findOne(req.params.id, req.body.user, function(err, updatedUser)
  // {
  //   if(err)
  //   {
  //     console.log(err);
  //     console.log("error occured while updating user's information");
  //     res.redirect("/users/" + req.body.user.username + "/edit");
  //   }
  //   else
  //   {
  //   res.redirect("/users/" + req.body.user.username);
  //   res.render("home");
  //   }
  // });
});

app.delete("/users/:id", function (req, res) {
  User.findByIdAndRemove(req.params.id, function (err, deletedUser) {
    if (err) {
      res.redirect("/users/" + req.params.id)
    } else {
      res.redirect("/logout");
    }
  })
})

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});


app.listen(3333, "127.0.0.1", function () {
  console.log("Free tour tickets server has started");
});

// "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe" 