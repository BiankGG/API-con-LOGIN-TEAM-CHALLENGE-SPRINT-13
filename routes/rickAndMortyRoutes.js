const axios = require('axios');
const middlewares = require('../middleware/authMiddlewares');

const routes = (app) => {

    app.get('/characters', middlewares.verifyToken, async (req, res) => {
        const name = req.query.rickMortyNames

        if(name){
            res.redirect(`characters/${name}`);
        }else{

            const url = `https://rickandmortyapi.com/api/character`;
            
            try {
                const response = await axios.get(url);
                res.json(response.data.results);

            } catch (ERROR) {
                res.status(404).json({error: 'No se encuentra la información'});
            };
        };
    });


    app.get('/characters/:name', middlewares.verifyToken, async (req, res) => {
        let name = req.params.name
        name = name.toLowerCase().trim();
        
        try {
            const response = await axios.get('https://rickandmortyapi.com/api/character');
            const character = response.data.results.find(character => character.name.toLocaleLowerCase() === name);
            
            if (character == undefined){
                throw new Error();
            }

            const characterData = {
                "name": character.name, 
                "status": character.status,
                "species": character.species,
                "gender": character.gender,
                "origin": character.origin.name,
                "image": character.image
            }
            
            res.json(characterData);

        } catch (ERROR) {
            res.status(404).json({error: 'personaje no encontrado'});
        };

    });
};

module.exports = {
    routes
}
