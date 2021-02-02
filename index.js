const express = require("express");
const app = express();
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
const methodOverride = require("method-override");

// Middle Ware - So, the code that we use inbetween the frontend and backend (routes); (Although it's written in the backend);
app.use(expressLayouts);

app.set('view engine', 'ejs');

//body-parser middleware for reading POST
app.use(express.urlencoded({extended: false}));

// Method Overide for PUT and DELETE
app.use(methodOverride('_method'));

// ROUTES

app.get('/', (req, res) => {
    res.send("HI");
});

app.get('/dinosaurs', (req, res) => {
    // Access the database
    let dinos = fs.readFileSync(`${__dirname}/dinosaurs.json`);
    dinos = JSON.parse(dinos);
    
    // If there was a query assume it's a name filter
    if (req.query.nameFilter) {
        let dinoID = req.query.nameFilter;
        let index = null;

        for (let i = 0; i < dinos.length; i++) {
            if (dinos[i].name.toLowerCase() === dinoID.toLowerCase()) {
                index = i;
                break;
            }
        }

        if (index) {
            res.redirect(`/dinosaurs/${index}`);
        } else {
            res.status(400);
            res.redirect('/dinosaurs');
        }

    }
    // Render the basic dino page with dino array.
    res.render(`dinosaurs/index.ejs`, { dinos });
});

app.get('/dinosaurs/new', (req, res) => {
    // Render the form for making new dinos.
    res.render("dinosaurs/new.ejs");
});

app.get('/dinosaurs/:id', (req, res) => {
    // Read from Database
    let dinos = fs.readFileSync(`${__dirname}/dinosaurs.json`);
    dinos = JSON.parse(dinos);

    let dinoID = req.params.id;
    dino = dinos[dinoID];
    
    // Show a dino.
    res.render(`dinosaurs/show.ejs`, { dino });
});

// POST

app.post("/dinosaurs", (req, res) => {
    // Update the Database
    let dinos = fs.readFileSync(`${__dirname}/dinosaurs.json`);
    dinos = JSON.parse(dinos);
    dinos.push(req.body);

    // Rewrite the json file.
    fs.writeFileSync(`${__dirname}/dinosaurs.json`, JSON.stringify(dinos));

    // With a redirect, we go to a new route by GET method.
    res.redirect('/dinosaurs');
}); 

// DELETE
app.delete('/dinosaurs/:id', (req, res) => {
    const dinosArray = JSON.parse(fs.readFileSync(`${__dirname}/dinosaurs.json`));
    const dinoID = parseInt(req.params.id);

    // Remove Dino
    dinosArray.splice(dinoID, 1);

    // Rewrite to files
    fs.writeFileSync(`${__dirname}/dinosaurs.json`, JSON.stringify(dinosArray));

    // With a redirect, we go to a new route by GET method.
    res.redirect('/dinosaurs');
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));