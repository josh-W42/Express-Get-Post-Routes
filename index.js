const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');

// Middle Ware - So, the code that we use inbetween the frontend and backend (routes); (Although it's written in the backend);
app.use(expressLayouts);

app.set('view engine', 'ejs');

//body-parser middleware
app.use(express.urlencoded({extended: false}));

// ROUTES

app.get('/', (req, res) => {
    res.send("HI");
});

app.get('/dinosaurs', (req, res) => {
    // Access the database
    let dinos = fs.readFileSync(`${__dirname}/dinosaurs.json`);
    dinos = JSON.parse(dinos);

    // Render the basic dino page with dino array.
    res.render(`dinosaurs/index.ejs`, { dinos });
});

app.get('/dinosaurs/new', (req, res) => {
    // Render the form for making new dinos.
    res.render("dinosaurs/new.ejs");
});

app.get('/dinosaurs/:id', (req, res) => {
    let dinoID = parseInt(req.params.id);

    // Read from Database
    let dinos = fs.readFileSync(`${__dirname}/dinosaurs.json`);
    dinos = JSON.parse(dinos);

    // Retrive a dino
    let dino = dinos[dinoID];

    // Show a dino.
    res.render(`dinosaurs/show.ejs`, { dino });
});

app.post("/dinosaurs", (req, res) => {
    // Update the Database
    let dinos = fs.readFileSync(`${__dirname}/dinosaurs.json`);
    dinos = JSON.parse(dinos);
    dinos.push(req.body);

    // Rewrite the json file.
    dinos = JSON.stringify(dinos);
    fs.writeFileSync(`${__dirname}/dinosaurs.json`, dinos);

    // With a redirect, we go to a new route by GET method.
    res.redirect('/dinosaurs');
}); 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));