import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    name: {type: String, required: true},
    quantity: {type: Number, required: true},
    unitPrice: {type: Number, required: true},
    taxPercentage: {type: Number, required: true},
    total: {type: Number, required: true},

})

const invoiceSchema = new mongoose.Schema({
   user: {type:mongoose.Schema.Types.ObjectId, ref:'User', required:true},
    invoiceNumber: {type: String, required: true},
    invoiceDate: {type: Date, default: Date.now},
    dueDate: {type: Date},
    billFrom:{
        businessName:{type: String, required: true},
        email:{type: String, required: true},
        address:{type: String, required: true},
        phone:{type: String, required: true},

    },
    billTo:{
        clientName:{type: String, required: true},
        email:{type: String},
        address:{type: String},
        phone:{type: String },
    },
    items:[itemSchema],
    notes:{type: String},
    paymentTerms:{type: String},
    status:{type:String, enum:["paid", "unpaid","overdue"] , default:"unpaid"},
    subtotal:Number,
    taxTotal:Number,
    total:Number,
},{ timestamps: true });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;

