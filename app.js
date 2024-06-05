const express = require('express')
const app = express();
const session = require('express-session');
const crypto = require('./crypto/config');
const routesApi = require('./routes/rickAndMortyRoutes');
const usersRoutes = require('./routes/usersRoutes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: crypto.hashedSecret,
      resave: false, 
      saveUninitialized: true, 
      cookie: { secure: false },
    })
);

routesApi.routes(app);
usersRoutes.routes(app);


app.listen(3000, () => {
    console.log('express está escuchando en el puerto http://localhost:3000');
});