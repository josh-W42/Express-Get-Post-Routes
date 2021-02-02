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
    let dinos = fs.readFileSync(`${__dirname}/dinosaurs.json`);
    dinos = JSON.parse(dinos);
    res.render(`dinosaurs/index.ejs`, { dinos });
});

app.get('/dinosaurs/new', (req, res) => {
    res.render("dinosaurs/new.ejs");
});

app.get('/dinosaurs/:id', (req, res) => {
    let dinoID = parseInt(req.params.id);
    let dinos = fs.readFileSync(`${__dirname}/dinosaurs.json`);
    dinos = JSON.parse(dinos);
    let dino = dinos[dinoID];
    res.render(`dinosaurs/show.ejs`, { dino });
});

app.post("/dinosaurs", (req, res) => {
    console.log(req.body);
    res.render('dinosaurs/index.ejs');
}); 

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));