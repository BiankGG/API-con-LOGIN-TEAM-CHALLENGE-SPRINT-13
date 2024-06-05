const middlewares = require('../middleware/authMiddlewares');
const users = require('../data/users');

const routes = (app) => {
    app.get('/', (req, res) => {
        if(req.session.token) {
            res.send(`
            <a href="/search">Search</a>
            <form action="/logout" method="post">
                <button type="submit">Cerrar sesión</button>
            </form>
            `);
        } else {
            res.send(`
                <form action="/login" method="post">
                    <label for="username">Usuario:</label>
                    <input type="text" id="username" name="username" required><br>
                    <label for="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required><br>
                    <button type="submit">Iniciar sesión</button>
                </form>
            `);
        };
    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body; 
        const user = users.find(
          (user) => user.username === username && user.password === password
        );
      
        if (user) {
          const token = middlewares.generateToken(user);
          req.session.token = token;
          res.redirect('/search');
        } else {
          res.status(401).json({ message: 'Credenciales incorrectas' });
        }
    });

    app.get('/search', middlewares.verifyToken, (req, res) => {
        res.send(`
        <form action="/characters" method="get">
            <label for="rickMortyNames">Introduce el nombre del personaje</label>
            <input type="text" id="rickMortyNames" placeholder="Rick Sanchez" />
            <button type="submit">Obtener información</button>
        </form>
        <form action="/logout" method="post">
            <button type="submit">Logout</button>
        </form>
        `
        );
      
       
    });

    app.post('/logout', (req, res) => {
        req.session.destroy();
        res.redirect('/');
    });
};

module.exports = {routes}
