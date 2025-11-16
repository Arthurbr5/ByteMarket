const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configurações
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'bytemarket-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// Serialização do usuário
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Estratégia Google OAuth
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Aqui você salvaria o usuário no banco de dados
    const user = {
        id: profile.id,
        provider: 'google',
        email: profile.emails[0].value,
        name: profile.displayName,
        photo: profile.photos[0].value,
        accessToken: accessToken
    };
    return done(null, user);
}));

// Estratégia GitHub OAuth
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Aqui você salvaria o usuário no banco de dados
    const user = {
        id: profile.id,
        provider: 'github',
        email: profile.emails ? profile.emails[0].value : null,
        name: profile.displayName || profile.username,
        photo: profile.photos[0].value,
        username: profile.username,
        accessToken: accessToken
    };
    return done(null, user);
}));

// Rotas de Autenticação

// Google
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // Sucesso - redireciona para o painel
        res.redirect('/painel.html');
    }
);

// GitHub
app.get('/auth/github',
    passport.authenticate('github', { scope: ['user:email'] })
);

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // Sucesso - redireciona para o painel
        res.redirect('/painel.html');
    }
);

// Logout
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao fazer logout' });
        }
        res.redirect('/');
    });
});

// Rota para verificar se está autenticado
app.get('/auth/user', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            authenticated: true,
            user: req.user
        });
    } else {
        res.json({
            authenticated: false
        });
    }
});

// Middleware de proteção de rotas
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Não autenticado' });
};

// Exemplo de rota protegida
app.get('/api/user/profile', isAuthenticated, (req, res) => {
    res.json({
        user: req.user
    });
});

// Servir arquivos estáticos (todos os HTMLs na raiz)
app.use(express.static('.'));

// Rota raiz
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📝 Configure as variáveis no arquivo .env`);
});
