var express               =  require("express"),
    PORT                  =  process.env.PORT || 3030,
    app                   =  express(),
    methodOverride        =  require("method-override"),
    mongoose              =  require("mongoose"),
    multer                =  require("multer"),
    bodyParser            =  require("body-parser"),
    expressSession        =  require("express-session"),
    passport              =  require("passport"),
    LocalStrategy         =  require('passport-local'),
    passportLocalMongoose =  require("passport-local-mongoose"),
    // bcrypt                =  require("bcrypt"),
    Celebrity             =  require("./models/celebrity"),
    Order                 =  require("./models/order"),
    Upload                =  require("./models/upload"),
    Event                 =  require("./models/event"), 
    User                  =  require("./models/user"),
    Submission            =  require("./models/submission"),
    path                  =  require("path");

global.Promise            =  require('bluebird');
mongoose.Promise = Promise;
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
app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  next();
})
// -----------------------------------------  </PASSPORT SETUP> ----------------------------------------------- //
 

// ======================================= Set Storage Enging for multer ======================================= //

var storage = multer.diskStorage({
  destination:"./public/uploads",
  filename: (req,file,cb)=>{
    cb(null,file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});


var upload = multer({storage: storage}).fields([
   {name: "sketch"},
   {name: "cover"}
  ]);

// Check file type
 checkFileType = (file,cb)=>{
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

    isLoggedIn = (req, res, next) =>
    {
      if(req.isAuthenticated()){
        return next();
      }
       res.redirect("/login");
    }

// ================================================== ROUTES ================================================================//

app.get("/", (req,res) =>{
	res.render("home");
});

app.post('/login', (req, res, next)=> {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, (err)=> {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});


app.get("/grids", (req,res)=>
{
  Celebrity.find({} , (err, allcelebs)=>{
  	if(err){
  		console.log(err);
  	}
  	else{
  		res.render("grids", {celeb: allcelebs});
  	}
  });
});


app.post("/register", (req,res) =>
{ 
    User.register(new User({username: req.body.username}), req.body.password, (err,user)=>
    {
      if(err)
       {
        console.log(err);
        return res.render('register');
       }
        passport.authenticate("local")(req, res, ()=>
        { 
          User.findOne({username: req.body.username}, (err,updateUser)=>
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


app.get("/events/:id", (req,res)=>
{         
    Celebrity.findById(req.params.id, (err, allcelebs)=>
    {
      if(err){
      	console.log(err);
        }

      else{     
            var getCeleb = allcelebs.celebName;
            Event.findOne({celebName:getCeleb}, (err,events)=>
            {
              res.render("newevent", {event:events, celeb:allcelebs});
            });
          }
    });
});

app.get("/login", (req,res)=>
{
	res.render("login");
});

app.get("/register", (req,res)=>
{
	res.render("register");
});

app.get("/artworks/:id/:tourIndex",  isLoggedIn, (req,res)=>
{
  
  Event.findById(req.params.id,(err, events)=>{
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

app.post("/greetings/:id/:tourIndex",  isLoggedIn, (req,res)=>
{  
   var tour_index    = req.params.tourIndex;

    upload(req,res,(err)=>
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
              Upload.create(newUpload, (err,upload)=>{
                if(err){
                  console.log(err);
                }
                else
                {
                  Order.create({userId:req.user._id, eventId:req.params.id, tourIndex:tour_index }, (err,order)=>{
                    if(err){console.log(err); }
                      else{
                      order.uploads = upload;
                      order.save();
                      }
                  })
                  Event.findById(req.params.id,(err,event)=>
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

app.get("/submissions", async (req,res)=>
{
  var events = await Event.find({});
  var submissions = await Promise.all(events.map(async (event, index)=> 
  {
    if(event.uploads.length!==0)
    {
      let submission = {celebName: event.celebName, tourName: event.tourName, bgImage: event.bgImage}
      let uploadsArray  = event.uploads;
      
      let uploads = await Promise.all(uploadsArray.map(async (uploadId)=>
      {
        let sketches = [];
        let covers = [];
        
        let sketch = {};
        let cover  = {};
        let upload = await Upload.findOne({_id:uploadId});       
        let owner  = await User.findOne({_id:upload.ownerId});
        if(upload.sketch && !upload.cover){
           sketch['img'] = upload.sketch;
           sketch['owner'] = owner;
           sketches.push(sketch);
           console.log(sketches);

        }
        if(upload.cover && !upload.sketch){
          cover['video'] = upload.cover;
          cover['owner'] = owner;
           covers.push(cover);
          console.log(covers);           
        }
        else{
          sketch['img'] = upload.sketch;
          sketch['owner'] = owner;          
          cover['video'] = upload.cover;
          cover['owner'] = owner;
          sketches.push(sketch);
          covers.push(cover);
          console.log(sketches);
          console.log(covers);
        }

        return sketches,covers;
        console.log(sketches);
        console.log(covers);
        
      }))
      
      submission['Sketches'] = sketches;
      submission['Covers'] = covers;
      // console.log(submission);
     
      return submission;
    } 
  }));
  console.log(JSON.stringify(submissions));

  // res.render("submissions", {submissions:submissions});
  // res.send(submissions);
  res.send("rukja");
})


app.get("/users/:id/uploads", isLoggedIn, (req, res)=>{
  Upload.find({ownerId:req.user._id}, (err, foundUploads)=>
  {
    if(err){ 
        console.log(err);
      }
    else{
          var sketches = [],
              covers   = [];
          foundUploads.forEach((upload)=>
          {
              if(upload.sketch && !upload.cover)
                {
                  sketches.push(upload.sketch);
                }
              if(upload.cover && !upload.sketch) 
                {       
                  covers.push(upload.cover);
                }
              if(upload.sketch && upload.cover)
              {
                sketches.push(upload.sketch);
                covers.push(upload.cover);          
              }
          });
          res.render("user-uploads", {sketches: sketches, covers: covers});
      }
  })
})

app.get("/users/:id/orders", isLoggedIn, async (req, res)=>
{
  var orders = await Order.find({userId: req.user._id});
  var finalOrders = await Promise.all(orders.map(async (foundOrder) =>
   {
    let tourIndex = foundOrder.tourIndex
    var event = await Event.findById(foundOrder.eventId);
    var upload = await Upload.findById(foundOrder.uploads);
    return { 
      celebName:   event.celebName,
      bgImage:     event.bgImage,
      tourIndex:   tourIndex,
      tourName:    event.tourName,
      tourDate:    event.tourDates[tourIndex],
      tourCity:    event.tourCity[tourIndex],
      tourCountry: event.tourCountry[tourIndex],
      tourVenue:   event.tourVenue[tourIndex],
      uploads:     upload
    }
  }));
  // res.send("rukja");
  console.log(finalOrders);
  res.render("orders", {orders: finalOrders});
})

app.get("/users/:id/edit", (req, res)=>{
  User.findById(req.user._id, (err, foundUser)=>{
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


app.put("/users/:id", (req, res)=>
{
  console.log(req.body.user.username);
    User.findByIdAndUpdate(req.user._id, req.body.user, (err,user)=>{
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

app.get("/users/:id", isLoggedIn, (req,res)=>{
  res.render("home");
});

app.delete("/users/:id", (req,res)=>{
   User.findByIdAndRemove(req.params.id, (err,deletedUser)=>
   {
    if(err){
      res.redirect("/users/" + req.params.id);
    }
    else{
      res.redirect("/logout");
    }
   })
})

app.get("/uploads", isLoggedIn, (req, res)=>{
  Upload.find({}, (err, Uploads)=>
  {
    if(err){ 
        console.log(err);
      }
    else{
          var sketches = [],
              covers   = [];
          Uploads.forEach((upload)=>
          {
              if(upload.sketch && !upload.cover)
                {
                  sketches.push(upload.sketch);
                }
              if(upload.cover && !upload.sketch) 
                {       
                  covers.push(upload.cover);
                }
              if(upload.sketch && upload.cover)
              {
                sketches.push(upload.sketch);
                covers.push(upload.cover);          
              }
          });
          res.render("uploads", {sketches: sketches, covers: covers});
      }
  })
})

app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});


app.listen(PORT, "127.0.0.1" , ()=>{
	console.log("Free tour tickets server has started");
});