const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gjlbc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services');
       
        // GET all services API
        app.get('/services', async (req, res) => {
            console.log('Hitted GET API');
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET single services API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // Post API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('Hit the post api', service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);

            res.json(result)
        })
        // const services = {
        //     "name": "ENGIN DIAGONIST",
        //     "price": "300",
        //     "description": "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without",
        //     "img": "https://i.ibb.co/f4PxHZS/going-out-employee-blue-colored-uniform-works-automobile-salon-146671-22355.jpg"
        //   }
        //   const result = await serviceCollection.insertOne(services);
        //   console.log(result);
    } finally {
        // await client.close();
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('This is Genious car mechanic server.')
})

app.listen(port, (req, res) => {
    console.log("Server running on port ", port);
})

// user: geniousMechanic
// pass: yoYzHXSVWsTn67Mn