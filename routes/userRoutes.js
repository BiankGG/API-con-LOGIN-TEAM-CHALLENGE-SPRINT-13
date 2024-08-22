const middlewares = require("../middleware/authMiddlewares");
const users = require("../data/users");

const routes = (app) => {
  app.get("/", (req, res) => {
    if (req.session.token) {
      res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Inicio</title>
                    <link rel="stylesheet" href="/styles/styles.css">
                </head>
                <body class="login-body">
                    <div class="login-container">
                        <a href="/search" class="search-link">Search</a>
                        <form action="/logout" method="post" class="logout-form">
                            <button type="submit" class="logout-button">Cerrar sesión</button>
                        </form>
                    </div>
                </body>
                </html>
            `);
    } else {
      res.send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login</title>
                    <link rel="stylesheet" href="/styles/styles.css">
                </head>
                <body class="login-body">
                    <div class="login-container">
                        <form action="/login" method="post" class="login-form">
                            <h1>Iniciar sesión</h1>
                            <label for="username">Usuario:</label>
                            <input type="text" id="username" name="username" required><br>
                            <label for="password">Contraseña:</label>
                            <input type="password" id="password" name="password" required><br>
                            <button type="submit">Iniciar sesión</button>
                        </form>
                    </div>
                </body>
                </html>
            `);
    }
  });

  app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users.find(
      (user) => user.username === username && user.password === password
    );

    if (user) {
      const token = middlewares.generateToken(user);
      req.session.token = token;
      res.redirect("/search");
    } else {
      res.status(401).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Login</title>
                    <link rel="stylesheet" href="/styles/styles.css">
                </head>
                <body class="login-body">
                    <div class="login-container">
                        <h1>Credenciales incorrectas</h1>
                        <a href="/" class="back-button">Volver al login</a>
                    </div>
                </body>
                </html>
            `);
    }
  });

  app.get("/search", middlewares.verifyToken, (req, res) => {
    res.send(`
        <!DOCTYPE html>
<html>
<head>
    <title>Buscar Personaje</title>
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
            <form action="/logout" method="post">
                <button type="submit" class="logout-button">Cerrar sesión</button>
            </form>
        </div>
    </div>
</body>
</html>
        `);
  });

  app.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/");
  });
};

module.exports = { routes };
