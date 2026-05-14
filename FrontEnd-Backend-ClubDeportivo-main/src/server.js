const fs = require('fs');
const path = require('path');
const app = require('./app');
const env = require('./config/env');
const sequelize = require('./config/database');
require('./models');
const { seedUsers } = require('./seeders/user.seeder');

async function bootstrap() {
  try {
    if (env.db.dialect === 'sqlite') {
      fs.mkdirSync(path.dirname(env.db.storage), { recursive: true });
    }

    await sequelize.authenticate();
    await sequelize.sync();
    await seedUsers();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Base de datos activa con dialecto: ${env.db.dialect}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el servidor:', error);
    process.exit(1);
  }
}

bootstrap();
