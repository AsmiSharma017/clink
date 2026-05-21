const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { sequelize } = require('./models');
const authRoutes = require('./routes/authRoutes');
const exportRoutes = require('./routes/exportRoutes');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@as-integrations/express4');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.use('/api/auth', authRoutes);
app.use('/api/export', exportRoutes);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

io.on('connection', (socket) => {
  socket.on('disconnect', () => {});
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await apolloServer.start();

  app.use('/graphql', expressMiddleware(apolloServer, {
    context: async () => ({ io }),
  }));

  await sequelize.authenticate();
  await sequelize.sync({ alter: true });

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

module.exports = app;