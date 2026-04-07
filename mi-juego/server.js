// Para correr este backend necesitas instalar:
// npm install express cors sqlite3

import express from 'express';
import cors from 'cors';
import sqlite3Pkg from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración inicial de herramientas en ES Modules
const sqlite3 = sqlite3Pkg.verbose();
const app = express();
const PORT = process.env.PORT || 3000;

// Recrear __dirname (ya que no existe por defecto en ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// --- CONFIGURACIÓN DE LA BASE DE DATOS (SQLite) ---
const dbPath = path.resolve(__dirname, 'game.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error("Error conectando a la BD:", err);
    else console.log("Conectado a la base de datos SQLite");
});

// Inicializar tablas ampliadas
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS player (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT DEFAULT 'Jugador Novato',
        avatarColor TEXT DEFAULT 'bg-blue-500',
        money REAL DEFAULT 0,
        clickPower REAL DEFAULT 1.0,
        level INTEGER DEFAULT 1,
        xp INTEGER DEFAULT 0
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS businesses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER,
        business_key TEXT,
        level INTEGER DEFAULT 0,
        income REAL DEFAULT 0.0,
        FOREIGN KEY(player_id) REFERENCES player(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER,
        skill_key TEXT,
        unlocked INTEGER DEFAULT 0,
        FOREIGN KEY(player_id) REFERENCES player(id)
    )`);

    // Crear jugador por defecto si no existe
    db.get("SELECT COUNT(*) as count FROM player", (err, row) => {
        if (row.count === 0) {
            db.run("INSERT INTO player (money, clickPower) VALUES (0, 1.0)");
            console.log("Jugador inicial creado desde 0.");
        }
    });
});

// --- CATÁLOGO BASE DEL JUEGO ---
const CATALOG = {
    businesses: {
        'limonada': { baseCost: 10, baseIncome: 1 },
        'cafeteria': { baseCost: 50, baseIncome: 3.5 },
        'tienda_online': { baseCost: 200, baseIncome: 15 },
        'bienes_raices': { baseCost: 1000, baseIncome: 60 },
        'startup_tech': { baseCost: 5000, baseIncome: 250 },
        'banco_central': { baseCost: 25000, baseIncome: 1200 }
    },
    skills: {
        'click_fuerte_1': { cost: 100, effect: 'click', value: 2 },
        'negociador': { cost: 500, effect: 'discount', value: 0.1 },
        'click_fuerte_2': { cost: 1500, effect: 'click', value: 5 },
        'visionario': { cost: 5000, effect: 'global_income', value: 1.5 }
    }
};

// --- RUTAS DE LA API ---
app.get('/api/state', (req, res) => {
    const playerId = 1;
    db.get("SELECT * FROM player WHERE id = ?", [playerId], (err, player) => {
        if (!player) return res.status(404).json({ error: "Jugador no encontrado" });
        db.all("SELECT * FROM businesses WHERE player_id = ?", [playerId], (err, businesses) => {
            db.all("SELECT * FROM skills WHERE player_id = ?", [playerId], (err, skills) => {
                const totalPassiveIncome = businesses.reduce((sum, b) => sum + b.income, 0);
                res.json({ player, businesses, skills, totalPassiveIncome });
            });
        });
    });
});

app.post('/api/work', (req, res) => {
    const playerId = 1;
    db.get("SELECT clickPower, money FROM player WHERE id = ?", [playerId], (err, player) => {
        const newMoney = player.money + player.clickPower;
        db.run("UPDATE player SET money = ? WHERE id = ?", [newMoney, playerId], () => {
            res.json({ success: true, money: newMoney, added: player.clickPower });
        });
    });
});

app.post('/api/sync-income', (req, res) => {
    const playerId = 1;
    db.get("SELECT money FROM player WHERE id = ?", [playerId], (err, player) => {
        db.all("SELECT income FROM businesses WHERE player_id = ?", [playerId], (err, businesses) => {
            const incomePerSecond = businesses.reduce((sum, b) => sum + b.income, 0);
            const secondsPassed = req.body.seconds || 1; 
            const newMoney = player.money + (incomePerSecond * secondsPassed);
            db.run("UPDATE player SET money = ? WHERE id = ?", [newMoney, playerId], () => {
                res.json({ success: true, money: newMoney });
            });
        });
    });
});

app.post('/api/buy/business/:key', (req, res) => {
    const playerId = 1;
    const key = req.params.key;
    const catalogItem = CATALOG.businesses[key];
    if(!catalogItem) return res.status(400).json({error: "Negocio no existe"});

    db.get("SELECT money FROM player WHERE id = ?", [playerId], (err, player) => {
        db.get("SELECT * FROM businesses WHERE player_id = ? AND business_key = ?", [playerId, key], (err, business) => {
            const currentLevel = business ? business.level : 0;
            const cost = catalogItem.baseCost * Math.pow(1.15, currentLevel);

            if (player.money < cost) return res.status(400).json({ error: "Dinero insuficiente" });

            const newMoney = player.money - cost;
            const newIncome = catalogItem.baseIncome * (currentLevel + 1);

            db.run("UPDATE player SET money = ? WHERE id = ?", [newMoney, playerId], () => {
                if (business) {
                    db.run("UPDATE businesses SET level = level + 1, income = ? WHERE id = ?", [newIncome, business.id], () => {
                        res.json({ success: true, money: newMoney, message: "Mejorado" });
                    });
                } else {
                    db.run("INSERT INTO businesses (player_id, business_key, level, income) VALUES (?, ?, 1, ?)", [playerId, key, newIncome], () => {
                        res.json({ success: true, money: newMoney, message: "Comprado" });
                    });
                }
            });
        });
    });
});

app.post('/api/player/update', (req, res) => {
    const { name, avatarColor } = req.body;
    db.run("UPDATE player SET name = ?, avatarColor = ? WHERE id = 1", [name, avatarColor], () => {
        res.json({ success: true });
    });
});

app.post('/api/buy/skill/:key', (req, res) => {
    const playerId = 1;
    const key = req.params.key;
    const skillData = CATALOG.skills[key];

    db.get("SELECT money, clickPower FROM player WHERE id = ?", [playerId], (err, player) => {
        if (player.money < skillData.cost) return res.status(400).json({error: "Sin dinero"});
        
        const newMoney = player.money - skillData.cost;
        db.run("UPDATE player SET money = ? WHERE id = ?", [newMoney, playerId], () => {
            db.run("INSERT INTO skills (player_id, skill_key, unlocked) VALUES (?, ?, 1)", [playerId, key], () => {
                if(skillData.effect === 'click') {
                    db.run("UPDATE player SET clickPower = clickPower + ? WHERE id = ?", [skillData.value, playerId]);
                }
                res.json({ success: true, message: "Habilidad desbloqueada" });
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});