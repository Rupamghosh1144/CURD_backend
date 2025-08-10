const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render("index");
});

app.get('/read',async (req, res) => {
  let allUsers= await userModel.find();
  res.render("read",{users: allUsers});
});

app.post('/create', async (req, res) => {
  try {
    let { name, email, image } = req.body;
    let createdUser = await userModel.create({ name, email, image });
    res.status(201).redirect('/read');
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create user" });
  }
});



app.get('/delete/:id', async (req,res)=>{
  await userModel.findOneAndDelete({_id: req.params.id});
  res.redirect('/read');
})




app.get('/edit/:id', async (req,res)=>{
  let user = await userModel.findOne({_id: req.params.id});
  res.render("edit",{user});
  // res.redirect('/read');
})


app.post('/update/:id', async (req,res)=>{
  let {name,email, image} = req.body;
  let user = await userModel.findOneAndUpdate({_id: req.params.id},{name,email,image},{new: true});
  res.redirect('/read');
})



app.listen(3000, () => {
  console.log("Server running on port 3000");
});




