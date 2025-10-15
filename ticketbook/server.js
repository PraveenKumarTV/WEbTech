const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());


const url = 'mongodb+srv://praveenkumartv1:praveen123@praveendb.ac0h0.mongodb.net/';
const client = new MongoClient(url);
const dbName = 'test';

async function main() {
  await client.connect();
  console.log('Connected to MongoDB');
  const db = client.db(dbName);
  const bookings = db.collection('bookings');

  app.post('/book', async (req, res) => {
    try {
        const {name,seats}= req.body;
        if(!name || !seats || !Array.isArray(seats) || seats.length === 0){
            return res.status(400).json({error: 'Invalid booking data'})
        }
      await bookings.insertOne({
        name: name,
        seats: seats,
        time: new Date()
      });
      res.json({ message: 'Booking saved successfully!' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/booked', async (req, res) => {
    try {
      const allBookings = await bookings.find({}).toArray();
      res.json(allBookings);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  const PORT = 3000;
  app.listen(PORT, () => console.log(`🎬 Server running at http://localhost:${PORT}`));
}

main().catch(console.error);
