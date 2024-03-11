const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

app.set("views" , path.join(__dirname , "views"));
app.set("view engine" , "ejs");
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

// Database create karne ke liye....    
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
};

app.get("/" , (req,res) => {
    res.send("HI , I am Root")
});

// Index Route....
app.get("/listings" , async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
});

// New Route....
app.get("/listings/new" , (req,res) => {
    res.render("listings/new.ejs");
});

// Show Route....
app.get("/listings/:id" , async (req,res) => {
    let {id} = req.params;                 // Id extract karne ke liye....
    const listing = await Listing.findById(id);                 // listing ko find out karene ke liye....
    res.render("listings/show.ejs" , {listing});
});

// Create Route....
app.post("/listings" , async (req,res) => {
    // let {title , description , image , price , country , location} = req.body;
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});

// Edit Route....
app.get("/listings/:id/edit" , async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
});

// Upadte Route....
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`); 
  });

  //Delete Route....
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  });















// app.get("/testListing" , async (req,res) => {
//     let sampleListing = new Listing ({
//         title : "My new Villa",
//         description : "By the beach",
//         price : 1200,
//         location : "Noida , Uttar Pradesh",
//         country : "India",
//     });
//     await sampleListing.save();
//     console.log("sample was saved...");
//     res.send("successfull");
// });

app.listen(8080 , () => {
    console.log("server listening at port 8080")
});