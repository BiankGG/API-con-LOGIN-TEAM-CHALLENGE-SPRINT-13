const express = require('express');
const session = require('express-session');
const app = express();
const crypto = require('./crypto/config');
const userRoutes = require('./routes/userRoutes');
const rickAndMortyRoutes = require('./routes/rickAndMortyRoutes');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    session({
      secret: crypto.secret,  
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },  
    })
);

userRoutes.routes(app);
rickAndMortyRoutes.routes(app);

app.listen(3000, () => {
    console.log('Express está escuchando en el puerto http://localhost:3000');
});