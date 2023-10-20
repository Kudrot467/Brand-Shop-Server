const express = require('express');
const cors = require('cors');
require('dotenv').config();
const brands = require('./brands.json');
const { MongoClient, ServerApiVersion } = require('mongodb');
 const app=express();
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.clkkquk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client.db('productDB').collection('product');
     const cartCollections = client.db('cartDB').collection('cart');
 
 
 
 /* single data post for cart items */
        app.post('/cart', async (req, res) => {
            const cartItems = req.body
            const result = await cartCollections.insertOne(cartItems)
            res.send(result);
        }
        )

        /* read data */
        app.get('/cart', async (req, res) => {
            const result = await cartCollections.find().toArray()

            res.send(result);
        })


    app.get('/products',async(req,res)=>{
        const cursor=productCollection.find();
        const result=await cursor.toArray();
        res.send(result);
    });

    // app.get("/products/:id", async (req, res) => {
    //     const id = req.params.id
    //     const query = {_id : new ObjectId(id)}
        
    //     const result = await productCollection.findOne(query)
    //     console.log(result);
    //     res.send(result)
        
    // })


    // app.put('/products/:id', async (req, res) => {
    //     const id = req.params.id
    //     const filter = {
    //         _id: new ObjectId(id)
    //     }
    //     const newProduct = req.body
    //     const options = {
    //         upsert: true,
    //     }
    //     const updatedProduct = {
    //         $set: {
    //             image_url: newProduct.image_url,
    //             name: newProduct.name,
    //             brand_name: newProduct.brand_name,
    //             type: newProduct.type,
    //             details : newProduct.details,
    //             price: newProduct.price,
    //             short_description: newProduct.short_description,
    //             rating: newProduct.rating

    //         }
    //     }
    //     const result = await productCollection.updateOne(filter , updatedProduct , options)
    //     console.log(result);
    //     res.send(result);
    // })

   app.post('/products', async (req, res) => {
     const product = req.body;
     const result = await productCollection.insertOne(product);
    console.log(result);
     res.send(result);
 })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>
{
  res.send('Brand-Server ready');
})

app.get('/brands',(req,res)=>{
    res.send(brands)
})

app.get('/brands/:id',(req,res)=>
{
    const id=parseInt(req.params.id);
    const brand=brands.find(brand=>brand.id===id) || {};
    res.send(brand);
})

app.listen(port,()=>{
    console.log(`Brand server is running on ${port}`);
})