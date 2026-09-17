import 'dotenv/config';
import app from './app.js';
import { testDbConnection } from './config/database.js';
const PORT = Number(process.env.PORT) || 3000;
await testDbConnection();
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
