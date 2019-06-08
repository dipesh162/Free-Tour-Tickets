var express       =  require("express"),
    app           =  express(),
    mongoose      =  require("mongoose"),
    multer        =  require("multer"),
    bodyParser    =  require("body-parser"),
    passport      =  require("passport"),
    localStrategy =  require('passport-local').Strategy,
    bcrypt        =  require("bcrypt"),
    Celebrity     =  require("./models/celebrity"),
    Order         =  require("./models/order"),
    Upload        =  require("./models/upload"),
    Event         =  require("./models/event"), 
    User          =  require("./models/user"),
    Submission    =  require("./models/submission"),
    path          =  require("path");

mongoose.connect("mongodb://localhost/ftt4", {useNewUrlParser: true});

// Storage engine for multer for sketches//
// var storagesketch = multer.diskStorage({
//    destination: function(req,file,cb){
//         cb(null,"./uploads/sketches")
//    },
//    filename: function(req,file,cb){             // cb is callback// 
//         cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));   // extname is extension name // 
//    }
// });

// Upload.create("")

// var storage = multer.diskStorage({
//    destination: function(req,file,cb){
//         cb(null,"./public/uploads");
//    },
//    filename: function(req,file,cb){             // cb is callback// 
//         cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));   // extname is extension name // 
//    }
// });


// Set Storage Enging for multer
var storage = multer.diskStorage({
  destination:"./public/uploads",
  filename: function(req,file,cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


var upload = multer({storage: storage}).fields([
   {name: "sketch"},
   {name: "cover"}
  ]);

//Initial Upload variable
// var upload = multer({
//   storage: storage,
//   limits:{fileSize: 5000000},
//   fileFilter: function(req, file, cb){
//     checkFileType(file,cb);
//   }
// }).single('sketch');

// Check file type
function checkFileType(file,cb){
  var filetypes = /jpeg|jpg|png|gif/;
  var extname  =  filetypes.test(path.extname(file.originalname).toLowerCase());

  // check mime 
  var mimetype =  filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  }
  else{
    cb('error: images only');
  }
}


// var uploadCover = multer({
//   storage: coverStorage
// }).single('cover');


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.set("view engine" , "ejs");
app.use(express.static(__dirname + "/public"));



app.get("/", function(req,res){
	res.render("home");
});

app.post('/login',
 passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

app.post("/", function(req,res){
  var username = req.body.username;
  var pass     = req.body.password;

  User.findOne({userName: username},function(err, user){
    if(err){
      console.log(err);
      res.render("/login", {layout:false, locals:{ error:err } });
    }

    if(user.userName !== req.body.username || user.password!== req.body.password)
    {
      console.log("login failed");
      res.redirect("/login");
      console.log(user);
    }

    else
    {
      res.redirect("/");
      console.log(user);
    }
  })
  
});

app.get("/grids", function(req,res)
{
  console.log(req.user);
  Celebrity.find({} , function(err, allcelebs){
  	if(err){
  		console.log(err);
  	}
  	else{
  		res.render("grids", {celeb: allcelebs});
  	}
  });
});

app.post("/grids", function(req,res)
{
    User.findOne({userName: req.body.email}, function(err, user)
      {
      if(err)
        {
          console.log(err);
        }
      
      if(user){
        res.redirect("/register");
      }

      else
      {
          bcrypt.hash(req.body.password, 10, function(err,hashedpass)
          {
              if(err)
                {
                 console.log(err);
                }
              else
                {
                  var fname    = req.body.firstname,
                      sname    = req.body.secondname,
                      email    = req.body.email,
                      mobileno = req.body.mobile,
                      pass     = hashedpass,
                      newUser  = {firstName: fname,lastName: sname,userName: email,password: pass}; 
                      User.create(newUser, function(err,NewCreatedUser)
                      {
                        if(err){
                          console.log(err);
                              }
                        else{
                          res.redirect("/grids" , {user: NewCreatedUser});
                              console.log(NewCreatedUser);
                            } 
                      });                   
                 }
            });
      }
      })
 })  


app.get("/events/:id", function(req,res)
{         
    Celebrity.findById(req.params.id, function(err, allcelebs)
    {
      if(err){
      	console.log(err);
        }

      else{
            console.log(req.params.id);      
            var getCeleb = allcelebs.celebName;
            console.log(allcelebs._id);
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

app.get("/artworks/:id/:tourIndex", function(req,res)
{
  //if(isLogin() == false){
    // redirect to /register/id
  //} 
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

app.post("/greetings/:id" ,function(req,res)
{
    var firstname     = req.body.firstname;
    var secondname    = req.body.secondname;  
    var email         = req.body.email;
    var number        = req.body.number;
    var sketch        = req.body.sketch;
    var cover         = req.body.cover;
    var comment       = req.body.comment;
    var tour_index    = req.body.tour_index;
    var newSubmission = {firstName: firstname, secondName: secondname, email:email, mobileNo: number, sketch: sketch, cover: cover, comment:comment};
    
    Submission.create(newSubmission, function(err, newSubmission)
    {
      if(err){
        console.log(err);
      }
      else{
        console.log("New Submission is created");
        console.log(newSubmission);
      }
    }

    );


    upload(req,res,function(err)
    {
        if(err){
          res.redirect("artworks/:id");
          console.log("Multer error occured when uploading image(sketch)");
        }
        else{
          console.log(req.files);
          // console.log(req.files.sketch); 
          // console.log(req.files.cover);

          // console.log(req.files[0]);
          // console.log(req.files[1]);
          // Upload.create({sketch:req.files.path}, function(err,up){console.log(up);});
        }
    }); 
    
    Order.create({userId:mongoose.Types.ObjectId(req.params.id), eventId:mongoose.Types.ObjectId(req.params.id), tourIndex:tour_index }, function(err,order){
      if(err){console.log(err)}
        else{
        console.log(order);
        }
    })

    Event.findById(req.params.id,function(err,events)
    {
        if(err)
        {
          console.log(err);
          res.redirect("artworks");
        }
        else
        {
          res.render("greetings", {event:events, suber:newSubmission, tourIndex: tour_index});
        }
    });
});

app.get("/submissions", function(req,res)
{
	Submission.find({}, function(err,submissions)
    {
       if(err){
       	console.log(err);
       }
       else{
       	res.render("submissions", {submission: submissions});
        console.log(submissions);
       }
  	});
});


app.get("/orders", function(req,res){

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
      console.log(orders);
      console.log(orders[1].userId);
      Event.findById(orders[1].userId, function(err,events){
        if(err){ console.log(err); }
        else{
          console.log(events);
   res.render("orders", {event: events});
          
        }
      })
    
    // })s
    }
  })
});

app.listen(3333, "127.0.0.1" , function(){
	console.log("Free tour tickets server has started");
});

// "C:\Program Files\MongoDB\Server\4.0\bin\mongo.exe" 