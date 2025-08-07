import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import dotenv from 'dotenv';

dotenv.config(); // .env dosyasını okur


const start = async () => {
 await initMongoConnection(); // MongoDB bağlantısı kurulmadan sunucu başlamasın

const PORT = process.env.PORT || 3000;
const app = setupServer();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
}
start();