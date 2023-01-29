const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

///Conecting to Database
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");


//Creating Schema
const itemSchema = {
  name: String
};

///Creating Model
const Item = mongoose.model("Item", itemSchema);

///Creating Default Items
const item1 = new Item({
  name: "Welcome to TODO List"
});
const item2 = new Item({
  name: "To add new task click + icon"
});
const item3 = new Item({
  name: "To delete any task check the checkbox"
});

const defaultItems = [item1,item2,item3];

// Item.insertMany(defaultItems,(err) =>{
//   if(err){
//     console.log(err);
//   }else{
//     console.log("Succesfully added the default items");
//   }
// });


///Home Page
app.get("/", function(req, res){


  Item.find({},(err, foundItems) => {

    if(foundItems.length === 0){
      Item.insertMany(defaultItems,(err) =>{
        if(err){
          console.log(err);
        }else{
          console.log("Succesfully added the default items");
        }
      });
      res.redirect("/");
    }else{
      res.render("list", {
        listTitle: day,
        newListItems: foundItems
      });
    }


    
  });

  const day = date.getDate(); 

});

app.post("/",function(req, res){

  let itemName = req.body.newItem;

  const nextItem = new Item({
    name: itemName
  });

  nextItem.save();

  res.redirect("/");

  // if(req.body.list === "Work"){
  //   workItems.push(item);
  //   res.redirect("/work");
  // }else{
  //   items.push(item);
  //   res.redirect("/");
  // }
  // res.redirect("/");
});


///Custom Route Page
// app.get("/:customListName", (req,res) =>{
//   console.log(req.params.customListName);
// })


///Delete Page
app.post("/delete",(req,res) =>{
  const checkedId = req.body.checkbox;
  Item.findByIdAndRemove(checkedId, (err) =>{
    if(!err){
      console.log("Succesfully Deleted Item");
      res.redirect("/");
    }
  })
});


/// Work Page

app.get("/work",function(req,res){
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.post("/work", function(req,res){
  let item = req.body.newItem;
  workItems.push(item);

  res.redirect("/work");
});


///About Page

app.get("/about", function(req,res){
  res.render("about");
});



app.listen(3000, function(req, res){
  console.log("Server is running on port 3000");
});