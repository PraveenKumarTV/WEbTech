const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const {MongoClient}=require('mongodb');
const app=express();
const port=3000;
app.use(bodyParser.json());
app.use(cors());
const uri="mongodb+srv://praveenkumartv1:praveen123@praveendb.ac0h0.mongodb.net/";
const client=new MongoClient(uri);
let collection;
async function connectDB(){
    try{
        await client.connect();
        const db=client.db('test');
        collection=db.collection('moviesCol');
        console.log("Connected to MongoDB");
    }catch(err){
        console.error("Error connecting to MongoDB",err);
    }
}
connectDB();
app.post('/movies',async(req,res)=>{
    try{
        const {movie,genre}=req.body;
        if(!movie||!genre){
            return res.status(400).send("Movie and Genre are required");
        }
        const result=await collection.insertOne({movie,genre});
        res.status(201).json(result);
    }catch(err){
        res.status(500).send("Error inserting movie"+err);
    }
});
app.put('/movies',async(req,res)=>{
    const {movie,genre}=req.body;
    if(!movie||!genre){
        return res.status(400).send("Movie and Genre are required");
    }
    try{
        const result=await collection.updateOne({movie:movie},{$set:{genre:genre}});
        if(result.matchedCount===0){
            return res.status(404).send("Movie not found");
        }
        res.json(result);
    }catch(err){
        res.status(500).send("Error updating movie"+err);
    }
});
app.delete('/movies',async(req,res)=>{
    const movie=req.query.movie;
    if(!movie){
        return res.status(400).send("Movie name is required");
    }
    try{
    const result=await collection.deleteOne({movie:movie});
    if(result.deletedCount===0){
        return res.status(404).send("Movie not found");
    }
    res.json(result);
}catch(err){
    res.status(500).send("Error deleting movie"+err);
}
});
app.get('/movies',async(req,res)=>{
    try{
        const movies=await collection.find({}).toArray();
        res.json(movies);
    }catch(err){
        res.status(500).send("Error fetching movies"+err);
    }
});
app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`);
})
