import dotenv from 'dotenv';
dotenv.config(); // .env dosyasını okur
import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import contactsRouter from "./routers/contacts.js";
import errorHandler from "./middlewares/errorHandler.js";


const start = async () => {
 await initMongoConnection(); // MongoDB bağlantısı kurulmadan sunucu başlamasın

const PORT = process.env.PORT || 3000;
const app = setupServer();
app.use("/contacts", contactsRouter);

// Tüm route'ların ve router'ların EN SONUNDA:
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
}
start();