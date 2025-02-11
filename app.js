const express = require('express');
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const uri = "mongodb://localhost:27018";
const dbName = "mesurments";
const PORT = 8080;


let db;


async function dbInit() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("Successfully connected to MongoDB");

        db = client.db(dbName);
    } catch (err) {
        console.error("Error on dbInit:", err);
        process.exit(1);
    }
}


app.get('/api/measurements', async (req, res) => {
    try {
        const { field, startDate, endDate } = req.query;

        if (!field || !startDate || !endDate) {
            return res.status(400).json({ error: 'Поле, дата начала и дата окончания обязательны' });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);


        const data = await db.collection('my')
            .find({
                timestamp: { $gte: start, $lte: end },
                [field]: { $exists: true }
            })
            .project({ timestamp: 1, [field]: 1 })
            .toArray();

        if (data.length === 0) {
            return res.status(404).json({ error: 'Нет данных для данного поля' });
        }

        const nums = await db.collection('my')
            .find({
                timestamp: { $gte: start, $lte: end },
                [field]: { $exists: true }
            })
            .project({[field]: 1 , _id: 0})
            .toArray();

        console.log(nums)


        res.json({ data, nums } );
    } catch (err) {
        console.error('Ошибка при получении данных:', err);
        res.status(500).json({ error: 'Ошибка при получении данных' });
    }
});


app.get('/api/measurements/metrics', async (req, res) => {
    try {
        const { field } = req.query;

        if (!field) {
            return res.status(400).json({ error: 'Поле обязательно' });
        }

        const data = await db.collection('my').find({ [field]: { $exists: true } }).toArray();

        if (data.length === 0) {
            return res.status(404).json({ error: 'Нет данных для данного поля' });
        }

        const values = data.map(item => item[field]);

        const avg = values.reduce((acc, val) => acc + val, 0) / values.length;
        const min = Math.min(...values);
        const max = Math.max(...values);

        res.json({
            avg,
            min,
            max,
        });
    } catch (err) {
        console.error('Ошибка при вычислении метрик:', err);
        res.status(500).json({ error: 'Ошибка при вычислении метрик' });
    }
});


dbInit().catch((err) => {
    console.error("Error on dbInit:", err);
});


app.listen(PORT, () => {
    console.log(`Server started  http://localhost:${PORT}`);
});