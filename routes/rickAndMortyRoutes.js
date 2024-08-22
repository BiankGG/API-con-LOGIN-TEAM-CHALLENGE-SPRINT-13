const axios = require("axios");
const middlewares = require("../middleware/authMiddlewares");

const routes = (app) => {
  app.get("/characters", middlewares.verifyToken, async (req, res) => {
    const name = req.query.rickMortyNames;

    if (name) {
      res.redirect(`/characters/${name}`);
    } else {
      const url = "https://rickandmortyapi.com/api/character";

      try {
        const response = await axios.get(url);
        res.send(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>Buscador de Personajes</title>
              <link rel="stylesheet" href="/styles/styles.css">
          </head>
          <body>
              <div class="container">
                  <form action="/characters" method="get" class="search-form">
                      <label for="rickMortyNames">Introduce el nombre del personaje:</label>
                      <input type="text" id="rickMortyNames" name="rickMortyNames" placeholder="Rick Sanchez" required>
                      <button type="submit">Obtener información</button>
                  </form>
              </div>
          </body>
          </html>
        `);
      } catch (error) {
        res.status(404).send(`
          <!DOCTYPE html>
          <html>
          <head>
              <title>Error</title>
              <link rel="stylesheet" href="/styles/styles.css">
          </head>
          <body>
              <div class="container">
                  <form action="/characters" method="get" class="search-form">
                      <label for="rickMortyNames">Introduce el nombre del personaje:</label>
                      <input type="text" id="rickMortyNames" name="rickMortyNames" placeholder="Rick Sanchez" required>
                      <button type="submit">Obtener información</button>
                  </form>
                  <div class="error-card">
                      <h1>No se encuentra la información</h1>
                      <p>Hubo un error al buscar la información.</p>
                  </div>
              </div>
          </body>
          </html>
        `);
      }
    }
  });

  app.get("/characters/:name", middlewares.verifyToken, async (req, res) => {
    let name = req.params.name;
    name = name.toLowerCase().trim();

    try {
      const response = await axios.get(
        "https://rickandmortyapi.com/api/character"
      );
      const character = response.data.results.find(
        (character) => character.name.toLowerCase() === name
      );

      if (!character) {
        throw new Error();
      }

      const characterData = {
        name: character.name,
        status: character.status,
        species: character.species,
        gender: character.gender,
        origin: character.origin.name,
        image: character.image,
      };

      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>${characterData.name}</title>
            <link rel="stylesheet" href="/styles/styles.css">
        </head>
        <body>
            <div class="search-body">
                <div class="search-container">
                    <form action="/characters" method="get" class="search-form">
                        <label for="rickMortyNames">Introduce el nombre del personaje:</label>
                        <input type="text" id="rickMortyNames" name="rickMortyNames" placeholder="Rick Sanchez" required>
                        <button type="submit">Obtener información</button>
                    </form>
                    <div class="card-container">
                        <div class="card">
                            <img src="${characterData.image}" alt="${characterData.name}">
                            <h1>${characterData.name}</h1>
                            <p><strong>Status:</strong> ${characterData.status}</p>
                            <p><strong>Species:</strong> ${characterData.species}</p>
                            <p><strong>Gender:</strong> ${characterData.gender}</p>
                            <p><strong>Origin:</strong> ${characterData.origin}</p>
                            <a href="/characters" class="back-button">Volver a Buscar</a>
                        </div>
                    </div>
                    <form action="/logout" method="post" class="logout-form">
                        <button type="submit" class="logout-button">Cerrar sesión</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
      `);
    } catch (error) {
      res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Personaje no encontrado</title>
            <link rel="stylesheet" href="/styles/styles.css">
        </head>
        <body>
            <div class="search-body">
                <div class="search-container">
                    <form action="/characters" method="get" class="search-form">
                        <label for="rickMortyNames">Introduce el nombre del personaje:</label>
                        <input type="text" id="rickMortyNames" name="rickMortyNames" placeholder="Rick Sanchez" required>
                        <button type="submit">Obtener información</button>
                    </form>
                    <div class="error-card">
                        <h1>Personaje no encontrado</h1>
                        <p>El personaje que buscas no existe.</p>
                        <a href="/characters" class="back-button">Volver a Buscar</a>
                    </div>
                    <form action="/logout" method="post" class="logout-form">
                        <button type="submit" class="logout-button">Cerrar sesión</button>
                    </form>
                </div>
            </div>
        </body>
        </html>
      `);
    }
  });
};

module.exports = { routes };
