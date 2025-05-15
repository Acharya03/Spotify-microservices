import express from 'express';
import dotenv from 'dotenv';
import { sql } from './config/db.js';
import adminRoutes from './route.js';


dotenv.config();

const app = express();

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS albums (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                descriptions VARCHAR(255) NOT NULL,
                thumbnail VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await sql`
            CREATE TABLE IF NOT EXISTS songs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                thumbnail VARCHAR(255),
                audio VARCHAR(255) NOT NULL,
                album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

const port = process.env.PORT || 7000;

app.use("/api/v1", adminRoutes);

initDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
