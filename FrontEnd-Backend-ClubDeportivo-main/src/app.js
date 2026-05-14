const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    ok: true,
    message: 'API de usuarios funcionando.',
    docs: {
      login: 'POST /auth/login',
      register: 'POST /auth/register',
      me: 'GET /auth/me',
      users: 'GET /users'
    }
  });
});

app.use('/', routes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
