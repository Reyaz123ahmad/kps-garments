const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Owner","Customer", "Agent"],
        required:true
        
    },
    password:{
        type:String,
        required:true
    },
    token: {
		type: String,
	},
    order:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Order"
        }
    ],
    gender:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    area: {
        type: String
    }

},{ timestamps: true }
)
module.exports=mongoose.model('User',userSchema)
