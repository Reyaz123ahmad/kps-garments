const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        
    },
    size:{
        type:String,
        required:true
    },
    users:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ],
},{ timestamps: true }
)
module.exports=mongoose.model('Product',productSchema)
