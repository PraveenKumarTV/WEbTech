const express=require('express');
const {MongoClient}=require('mongodb');
const path=require('path');
const app=express();
const cors=require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
const uri='mongodb+srv://praveenkumartv1:praveen123@praveendb.ac0h0.mongodb.net/?';
const client=new MongoClient(uri);
let db;
async function connectDB(){
    try{
        await client.connect();
        db=client.db('test');
        console.log("Connected to Mongodb");
    }catch(err){
        console.error("Mongodb not connected");
    }
}
connectDB();
app.post('/submit-question',async(req,res)=>{
    const {question}=req.body;
    if(!question){
        return res.status(400).json({success:false,error:'Invalid input'});
    }
    try{
        console.log(question);
        const collection=db.collection("InterviewQuestions");
        await collection.insertOne({
            question:question.trim(),
            submittedAt:new Date()
        });
        res.json({success:true});
    }catch(err){
        console.error('Error inserting question');
        res.status(500).json({success:false,error:"Internal Server error"});
    }
});
const port=3000;
app.listen(port,()=>{
    console.log("Server running on localhost:3000");
})