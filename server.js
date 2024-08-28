const express = require("express");
const calc = require("calc");
const path = require("path"); // This is only needed if serving static files from 'dist'
const app = express();

app.listen(3000, () => {
    console.log("Server running on port 3000");
});

// parse application/json
app.use(express.json());

// Handle GET request to the root URL
app.get("/", (req, res) => {
    res.send("Welcome to the Pokémon Damage Calculator API!"); 
    // Alternatively, if you have a frontend, you can serve an index.html file:
    // res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Existing route to handle calculation
app.get("/calculate", (req, res, next) => {
    const gen = calc.Generations.get((typeof req.body.gen === 'undefined') ? 9 : req.body.gen);
    let error = "";
    if (typeof req.body.attackingPokemon === 'undefined')
        error += "attackingPokemon must exist and have a valid pokemon name\n";
    if (typeof req.body.defendingPokemon === 'undefined')
        error += "defendingPokemon must exist and have a valid pokemon name\n";
    if (error) throw new Error(error);

    const result = calc.calculate(
        gen,
        new calc.Pokemon(gen, req.body.attackingPokemon, req.body.attackingPokemonOptions),
        new calc.Pokemon(gen, req.body.defendingPokemon, req.body.defendingPokemonOptions),
        new calc.Move(gen, req.body.moveName),
        new calc.Field((typeof req.body.field === 'undefined') ? undefined : req.body.field)
    );
    res.json(result);
});

// Serve static files from 'dist' directory
app.use(express.static('dist'));

