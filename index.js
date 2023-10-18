const express = require('express');
const cors = require('cors');
const brands = require('./brands.json');
 const app=express();
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

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