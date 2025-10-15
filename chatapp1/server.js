const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const {MongoClient}=require('mongodb');
const uri="mongodb+srv://praveenkumartv1:praveen123@praveendb.ac0h0.mongodb.net/";
const port=3000;
const app=express();
app.use(bodyParser.json());
app.use(cors());
let col;
const client=new MongoClient(uri);
async function connectTodb(){
    await client.connect();
    const db=await client.db('test');
    col=await db.collection('chatapp');
    console.log('connected to Mongodb');
}
connectTodb();
app.post('/chat',async(req,res)=>{
    const {name,msg}=req.body;
    try{
        let result=await col.findOne({name:name});
        let result1;
        if(result){
            result1= await col.updateOne({name:name},{$set:{msg:msg}});
        }else{
            result1=await col.insertOne({name,msg});
        }
        return res.status(200).json({message:"msg added"});

    }catch(error){
        return res.status(500).json({error:"Error in storing"});
    }
})
app.listen(port,()=>{
    console.log("Server running on http://localhost:3000");
})