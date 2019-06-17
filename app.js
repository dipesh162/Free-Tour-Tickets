var express               =  require("express"),
    app                   =  express(),
    methodOverride        =  require("method-override"),
    mongoose              =  require("mongoose"),
    multer                =  require("multer"),
    bodyParser            =  require("body-parser"),
    expressSession        =  require("express-session"),
    passport              =  require("passport"),
    LocalStrategy         =  require('passport-local'),
    passportLocalMongoose =  require("passport-local-mongoose"),
    bcrypt                =  require("bcrypt"),
    Celebrity             =  require("./models/celebrity"),
    Order                 =  require("./models/order"),
    Upload                =  require("./models/upload"),
    Event                 =  require("./models/event"), 
    User                  =  require("./models/user"),
    Submission            =  require("./models/submission"),
    path                  =  require("path");

mongoose.connect("mongodb://localhost/ftt4git", {useNewUrlParser: true});

// --------------------------------------------  <APP USES> --------------------------------------------------//

app.use(bodyParser.urlencoded({extended:true}));
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
app.set("view engine" , "ejs");
app.use(methodOverride("_method"));

// --------------------------------------------  </APP USES> --------------------------------------------------//


// -----------------------------------------  <PASSPORT SETUP> ----------------------------------------------- //

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //(encoding) responsible for reading the session,taking data from that session and give back to session
passport.deserializeUser(User.deserializeUser()); //(unencoding) and again serealizing for
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  next();
})
// -----------------------------------------  </PASSPORT SETUP> ----------------------------------------------- //
 

// ======================================= Set Storage Enging for multer ======================================= //

var storage = multer.diskStorage({
  destination:"./public/uploads",
  filename: function(req,file,cb){
    cb(null,file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});


var upload = multer({storage: storage}).fields([
   {name: "sketch"},
   {name: "cover"}
  ]);

// Check file type
function checkFileType(file,cb){
  var filetypes = /jpeg|jpg|png|gif/;
  var extname  =  filetypes.test(path.extname(file.originalname).toLowerCase());

  // check mime type
  var mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  }
  else{
    cb('error: images only');
  }
}

// ========================================== </MULTER SETUP DONE> ========================================//


// Authentication Middleware //

    function isLoggedIn(req, res, next)
    {
      if(req.isAuthenticated()){
        return next();
      }
       res.redirect("/login");
    }

// ================================================== ROUTES ================================================================//

app.get("/", function(req,res){
	res.render("home");
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});


app.get("/grids", function(req,res)
{
  Celebrity.find({} , function(err, allcelebs){
  	if(err){
  		console.log(err);
  	}
  	else{
  		res.render("grids", {celeb: allcelebs});
  	}
  });
});


app.post("/register", function(req,res)
{ 
    User.register(new User({username: req.body.username}), req.body.password, function(err,user)
    {
      if(err)
       {
        console.log(err);
        return res.render('register');
       }
        passport.authenticate("local")(req, res, function()
        { 
          User.findOne({username: req.body.username}, function(err,updateUser)
          {
              if(err)
                {
                  console.log(err); 
                }
              else
                {
                  updateUser.firstName = req.body.firstname;
                  updateUser.lastName  = req.body.lastname;
                  updateUser.email     = req.body.email;
                  updateUser.save();
                }
          });
          return res.redirect('/users/' + user.username);
        });      
    });
});  


app.get("/events/:id", function(req,res)
{         
    Celebrity.findById(req.params.id, function(err, allcelebs)
    {
      if(err){
      	console.log(err);
        }

      else{     
            var getCeleb = allcelebs.celebName;
            Event.findOne({celebName:getCeleb}, function(err,events)
            {
              res.render("newevent", {event:events, celeb:allcelebs});
            });
          }
    });
});

app.get("/login", function(req,res)
{
	res.render("login");
});

app.get("/register", function(req,res)
{
	res.render("register");
});
// app.get("/register/:id", function(req,res){
//   res.render("register", id);
// });

app.get("/artworks/:id/:tourIndex",  isLoggedIn, function(req,res)
{
  
  Event.findById(req.params.id,function(err, events){
    if(err)
    {
      console.log(err);
    }
    else
    {
      res.render("artworks", {event : events, tourIndex: req.params.tourIndex });
    }
  });
});

app.post("/greetings/:id/:tourIndex",  isLoggedIn, function(req,res)
{  
   var tour_index    = req.params.tourIndex;


    upload(req,res,function(err)
    {
        if(err){
          res.redirect("artworks/:id");
          console.log("Multer error occured when uploading image(sketch)");
        }
        else{
              if(req.files.sketch && !req.files.cover){
                var sketch = req.files.sketch[0];
                newUpload = {sketch:"uploads/" +sketch.filename , ownerId:req.user._id};  
              }
              if(req.files.cover && !req.files.sketch){
                var cover = req.files.cover[0];      
                newUpload = {cover:"uploads/" +cover.filename, ownerId:req.user._id};  
              }
              if(req.files.cover && req.files.sketch) {
                var sketch = req.files.sketch[0];
                var cover = req.files.cover[0];                  
                newUpload = {sketch:"uploads/" +sketch.filename ,cover:"uploads/" +cover.filename, ownerId:req.user._id};  
              }
              Upload.create(newUpload, function(err,upload){
                if(err){
                  console.log(err);
                }
                else
                {
                  Order.create({userId:req.user._id, eventId:req.params.id, tourIndex:tour_index }, function(err,order){
                    if(err){console.log(err); }
                      else{
                      order.uploads = upload;
                      order.save();
                      }
                  })
                  Event.findById(req.params.id,function(err,event)
                  {
                      if(err)
                      {
                        console.log(err);
                        res.redirect("artworks");
                      }
                      else
                      {
                        event.uploads.push(upload);
                        event.save();
                        res.render("greetings", {user:req.user ,event:event, tourIndex: tour_index});
                      }
                  }); 
                }
              })
        }
    }); 
});



app.get("/uploads", function(req,res)
{
  Upload.find({} , function(err,uploads){
    res.render("uploads" , {uploads:uploads});
  })
})

app.get("/submissions", function(req,res)
{
	Event.find({}, function(err,events)
    {
       if(err){
       	console.log(err);
       }
       else
       {
         res.send("rukja");
         var allevents = events;
         allevents.forEach(function(event)
         {
          //  if(event.uploads!==null)
           var uploadsArray = event.uploads;
           if(uploadsArray)
           {
             var finalUploadsArray = uploadsArray;
            //  console.log(finalUploadsArray);
             for(var i=0 ; i<finalUploadsArray; i++)
             {
                if(uploadsArray)
                Upload.findById(finalUploadsArray[i], function(err,upload)
                {
                  console.log(upload);
                })
             }
           }

         })
       }
      })
})



app.get("/orders", isLoggedIn, function(req,res){

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

  
  Order.find({}, function(err,orders){
    if(err){
      console.log(err);
    }
    else{
      Event.findById(orders[0].userId, function(err,events){
        if(err){ console.log(err); }
        else{
         res.render("orders", {event: events});
        }
      })
    }
  })
});

app.get("/users/:id/orders", function(req, res)
{
  Order.find({userId: req.user._id}, function(err,foundOrders)
  {
    if(err){
      console.log(err);
    }
    else{
      var finalOrders = [];
      foundOrders.forEach(function(order)
      {
        var tourIndex = order.tourIndex;
        Event.findById(order.eventId, function(err,foundEvent)
        {
          if(err){
            console.log(err);
          }
          else{  
            var eachOrder = { bgImage: foundEvent.bgImage, eventName: foundEvent.celebName, tourIndex:tourIndex };
          finalOrders.push(eachOrder);
          }
        })
      
      })
      res.send("abhi ruk");
      console.log(finalOrders);
      //  res.render("orders", {orders: foundOrders})
      }
  })
})      
          // console.log(index);
          // eventId = order.eventId;
          // Event.findById(eventId, function(err,event){
          //   var index = order.tourIndex;
            //  console.log(event);  
            // finalOrders.push(event); 
            // finalOrders.push(index);     
            // console.log(finalOrders);            
        //   })
        // })
        // res.render("orders", {orders:finalOrders});
        // userOrders.forEach(function(order){
        //   var ee = order.EventId
        //   console.log(ee);
          // Event.findOne({_id:order.eventId}, function(err,event){
          //   var event = event;
          // });
          // event.tourIndex = order.tourIndex;
          // event.save();
          // finalOrders.push(event);
        // })
~   
    // });
        // console.log(finalOrders);
        // res.render("orders", {orders: finalOrders});
        // var firsteventId = foundOrders[0].eventId;
        
        // Event.findById(firsteventId, function(err,firstevent)
        // {
        //   if(err){ console.log(err); }
        //   else{
        //   res.render("orders", {order1: foundOrders[0], order2:foundOrders[1], event:event});
        //   }
        // }
      // }
  
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

app.get("/users/:id/uploads", isLoggedIn, function(req, res){
  Upload.find({ownerId:req.user._id}, function(err, foundUploads)
  {
    if(err){ 
        console.log(err);
      }
    else{
          var sketches = [],
              covers   = [];
          foundUploads.forEach(function(upload)
          {
              if(upload.sketch && !upload.cover)
              {
                sketches.push(upload.sketch);
              }
              if(upload.cover && !upload.sketch) 
                {       
                  covers.push(upload.cover);
                }
              else
              {
                sketches.push(upload.sketch);
                covers.push(upload.cover);          
              }
          });  
          res.render("user-uploads", {sketches: sketches, covers: covers});
      }
  })
})

app.get("/users/:id/edit", function(req, res){
  User.findById(req.user._id, function(err, foundUser){
    if(err)
      { 
        console.log(err);
      }
    else
      {
       res.render("edit-info", {user: foundUser});
      }
  })
});


app.put("/users/:id", function(req, res)
{
  console.log(req.body.user.username);
    User.findByIdAndUpdate(req.user._id, req.body.user, function(err,user){
      if(err){
        console.log(err);
      }
      else{
      user.save();
      req.user = user.username;
      // res.render("home");
      return res.redirect("/users/" + req.body.user.username);
      }
    })
});

app.get("/users/:id", isLoggedIn, function(req,res){
  res.render("home");
});

app.delete("/users/:id", function(req,res){
   User.findByIdAndRemove(req.params.id, function(err,deletedUser)
   {
    if(err){
      res.redirect("/users/" + req.params.id);
    }
    else{
      res.redirect("/logout");
    }
   })
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});


app.listen(3333, "127.0.0.1" , function(){
	console.log("Free tour tickets server has started");
});