const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv/config');

const app=express();

app.use(cors({origin:'*'}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());


const postSchema=new mongoose.Schema({
    post:{
        type:String,
        validate:{
            validator:function(v){
                return (v.trim().length)&&(v && v.length<=420);
            },
            message:'Kuch tho gadbad hai daya'
        },
        required:true
    },
    createdAt:{ 
        type: Date, 
        expires:'24h',
        default: Date.now 
    }
})

const post=mongoose.model('post',postSchema);

app.get('/',async (req,res)=>{
    await mongoose.connect(`${process.env.DB_CONNECT}`,{useNewUrlParser: true, useUnifiedTopology: true});
    const posts=await post.find({});
    res.json(posts);
})

app.post('/',async (req,res)=>{
    await mongoose.connect(`${process.env.DB_CONNECT}`,{useNewUrlParser: true, useUnifiedTopology: true});
    await post.create({post:req.body.rant});
    res.end();
})

app.post('/skipValidation',async(req,res)=>{
    if(req.headers.authorization===`${process.env.PASSWORD}`)
    {
        await mongoose.connect(`${process.env.DB_CONNECT}`,{useNewUrlParser: true, useUnifiedTopology: true});
        const t=new post({post:req.body.rant});
        await t.save({validateBeforeSave:false});
    }
    res.status(200).send();
})
app.listen(process.env.PORT||5000);