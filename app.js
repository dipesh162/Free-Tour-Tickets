const express             =  require("express"),
    cors                  =  require('cors'),
    nodemailer            =  require('nodemailer'),
    dotenv                =  require('dotenv'),
    PORT                  =  process.env.PORT || 3030,
    Ip                    =  process.env.IP_ADDRESS,
    { MongoClient, ServerApiVersion } = require('mongodb');
    app                   =  express(),
    methodOverride        =  require("method-override"),
    mongoose              =  require("mongoose"),
    multer                =  require("multer"),
    bodyParser            =  require("body-parser"),
    expressSession        =  require("express-session"),
    passport              =  require("passport"),
    LocalStrategy         =  require('passport-local'),
    passportLocalMongoose =  require("passport-local-mongoose"),
    Celebrity             =  require("./models/celebrity"),
    Order                 =  require("./models/order"),
    Upload                =  require("./models/upload"),
    Event                 =  require("./models/event"), 
    User                  =  require("./models/user"),
    Submission            =  require("./models/submission"),
    path                  =  require("path");
global.Promise            =  require('bluebird');
mongoose.Promise = Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
dotenv.config({ path: './.env' });


// connection to Mongo DB
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }

  // Connect DB for render
  mongoose.connect(process.env.DB_URL, connectionParams)
  .then(()=>{
    console.info("connected to DB")
  })
  .catch((e)=>{
    console.log("Error", e)
  })

  const uri = process.env.DB_URL
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  client.connect(err => {
    client.close();
  });


  // Connect DB For Cyclic
  // const connectDB = async () => {
  //   try {
  //     const conn = await mongoose.connect(process.env.DB_URL, connectionParams);
  //     console.log(`MongoDB Connected: ${conn.connection.host}`);
  //   } catch (error) {
  //     console.log(error);
  //     process.exit(1);
  //   }
  // }



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
app.use( cors({ origin: ["http://localhost:3030", "https://naughty-goat-loafers.cyclic.app/"], credentials: true, }) )
app.set("trust proxy", 1);





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

const storage = multer.diskStorage({
  destination:"./public/uploads",
  filename: (req,file,cb)=>{
    cb(null,file.fieldname + '-' + Date.now() + '-' + file.originalname);
  }
});


const upload = multer({storage: storage}).fields([
   {name: "sketch"},
   {name: "cover"}
  ]);

// Check file type
 checkFileType = (file,cb)=>{
  let filetypes = /jpeg|jpg|png|gif/;
  let extname  =  filetypes.test(path.extname(file.originalname).toLowerCase());

  // check mime type
  let mimetype = filetypes.test(file.mimetype);

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

// ======================================== Set Node Mailer ======================== /

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_TRANSPORTER_USER,
    pass: process.env.MAIL_TRANSPORTER_PASSWORD
  }
});

const mailOptions = {
  from: process.env.MAIL_TRANSPORTER_USER,
  subject: 'Congratulations! Your Upload for the concert is selected',
  text: 'Congratulations!'
};

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


app.get("/explore", (req,res)=>
{
  Celebrity.find({} , (err, allcelebs)=>{
  	if(err){
  		console.log(err);
  	}
  	else{
  		res.render("explore", { data: {celeb: allcelebs , routeType: 'celebs'}});
  	}
  });
});


app.post("/register", (req,res) =>
{ 
    User.register(new User({username: req.body.username}), req.body.password, (err,user)=>
    {
      if(err)
       {
        console.log('Mongoose error while creating user', err);
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
            const getCeleb = allcelebs.celebName;
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
   const tour_index    = req.params.tourIndex;

    upload(req,res,(err)=>
    {
        if(err){
          res.redirect("artworks/:id");
          console.log("Multer error occured when uploading image(sketch)");
        }
        else{
              if(req.files.sketch && !req.files.cover){
                let sketch = req.files.sketch[0];
                newUpload = {sketch:"uploads/" +sketch.filename , ownerId:req.user._id};  
              }
              else if(req.files.cover && !req.files.sketch){
                let cover = req.files.cover[0];      
                newUpload = {cover:"uploads/" +cover.filename, ownerId:req.user._id};  
              }
              else if(req.files.cover && req.files.sketch) {
                let sketch = req.files.sketch[0];
                let cover = req.files.cover[0];                  
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

app.get("/submissions", async (req,res)=>{
  Celebrity.find({} , (err, allcelebs)=>{
  	if(err){
  		console.log(err);
  	}
  	else{
  		res.render("explore", { data: {celeb: allcelebs , routeType: 'submissions'}});
  	}
  });
});

app.get("/submissions/:id", isLoggedIn, (req,res)=>{        
    Celebrity.findById(req.params.id, (err, celeb)=>
    {
      if(err){
      	console.log(err);
        }

      else{     
            let getCeleb = celeb.celebName;
            Event.findOne({celebName:getCeleb}, async (err,event)=>
            {
              if(err){
                console.log(err);
              } else {
                const EventOrders = await Order.find({eventId: event._id})

                let OrderDetails = await Promise.all(EventOrders.map(async (record)=> {

                  let upload = await Upload.findOne({_id: record.uploads})
                  let user = await User.findOne({_id: record.userId})
                
                  let submissions = [{upload,user}]
                  
                    return {
                      tourIndex: record.tourIndex,
                      submissions: submissions
                    }
                }))

                const filteredOrders = OrderDetails.reduce((acc, {tourIndex, submissions}) => {
                  acc[tourIndex] ??= {tourIndex: tourIndex, submissions: []};
                  if(Array.isArray(submissions)) // if it's array type then concat 
                    acc[tourIndex].submissions = acc[tourIndex].submissions.concat(submissions);
                  else
                    acc[tourIndex].submissions.push(submissions);
                  
                  return acc;
                }, {});

                let submissions = Object.values(filteredOrders) 
                
                res.render("submissions", {celeb: celeb, event: event, submissions: submissions})
              }

            });
          }
    });
});

app.post("/shortlist-upload", (req,res)=>{
  let user = JSON.parse(req.body.user)
  let uploadId = req.body.uploadId
  let tourIndex = req.body.tourIndex
  let event = JSON.parse(req.body.event)

  let celebName = event.celebName
  let tourName = event.tourName
  let eventBgImg = event.bgImage
  let tourCity = event.tourCity[tourIndex]
  let tourVenue = event.tourVenue[tourIndex]
  let tourCountry = event.tourCountry[tourIndex]
  let tourDate = event.tourDates[tourIndex]

  Upload.findByIdAndUpdate(uploadId, { shortListed:true }, (err,upload)=>{
    if(err){
      console.log(err)
      res.status(500).send('Internal Server Error')
    } else {
      res.status(200).send('OK')
      sendEmail({
        to: user.email,
        attachments: [
          {
              filename: 'event.png',
              path: __dirname + "/public" + `/${eventBgImg}`,
              cid: 'uniq-event.png'
          },
        ],
        html: `<h3>Your submission is selected for an upcoming ${celebName}'s ${tourName} which will take place on ${tourDate} at ${tourVenue} in ${tourCity}, ${tourCountry}. Kindly visit the concert venue atleast 1 hour prior to the actual timing's to collect your ticket from the ticket deparment. </h3>`,
      })
      console.log(upload);
    }
  })

  const sendEmail = (extraMailParams) =>{
    transporter.sendMail({...mailOptions, ...extraMailParams}, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent to: '  + info.response);
        res.status(200).send('OK')
      }
    });
  }

})

app.get("/users/:id/uploads", isLoggedIn, (req, res)=>{
  Upload.find({ownerId:req.user._id}, (err, foundUploads)=>
  {
    if(err){ 
        console.log(err);
      }
    else{
          let sketches = [],
              covers   = [];
          foundUploads.forEach((upload)=>
          {
            if (upload.sketch && !upload.cover) {
              sketches.push(upload);
            } else if (upload.cover && !upload.sketch) {
                covers.push(upload);
            } else if (upload.sketch && upload.cover) {
                sketches.push(upload);
                covers.push(upload);
            }
          });
          res.render("user-uploads", {sketches: sketches, covers: covers});
      }
  })
})

app.get("/users/:id/orders", isLoggedIn, async (req, res)=>
{
  const orders = await Order.find({userId: req.user._id});
  const finalOrders = await Promise.all(orders.map(async (foundOrder) =>
   {
    let tourIndex = foundOrder.tourIndex
    let event = await Event.findById(foundOrder.eventId);
    let upload = await Upload.findById(foundOrder.uploads);
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
          let sketches = [],
              covers   = [];
          Uploads.forEach((upload)=>
          {
              if(upload.sketch && !upload.cover)
                {
                  sketches.push(upload);
                }
              if(upload.cover && !upload.sketch) 
                {       
                  covers.push(upload);
                }
              if(upload.sketch && upload.cover)
              {
                sketches.push(upload);
                covers.push(upload);          
              }
          });
          res.render("uploads", {sketches: sketches, covers: covers});
      }
  })
})

app.get('/logout', (req, res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//Connect to the database before listening (for cyclic)
// connectDB().then(() => {
// app.listen(PORT, process.env.IP_ADDRESS , ()=>{
// 	console.log("Free tour tickets server has started");
// })
// })


// For Render
app.listen(PORT, process.env.IP_ADDRESS , ()=>{
	console.log("Free tour tickets server has started");
})