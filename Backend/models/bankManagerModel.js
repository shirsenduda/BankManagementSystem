import mongoose from "mongoose";

const bankManagerSchema = new mongoose.Schema({
    // Personal Information
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: '' },
    
    phone: { type: String, default: "0000000000" },
    dateOfBirth: { type: Date, default: null },
    gender: { type: String, enum: ['Male', 'Female'], required: true },
    
    // Address
    address: { type: Object, default: {line1: '', line2: ''} },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    
    // Identification
    idType: { type: String, enum: ['Passport', 'Driver License', 'National ID'], required: true },
    idNumber: { type: String, required: true, unique: true },
    
    // Employment
    employeeId: { type: String, unique: true },
    department: { type: String, required: true },
    position: { type: String, required: true },
    experience: { type: String, default: '' },
    about: { type: String, default: '' },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', default: null },
    branchName: { type: String, default: "Not Assigned" },
    
    // Account Status
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
    
}, {
    timestamps: true
});

// Auto-generate employee ID before saving
bankManagerSchema.pre('save', async function(next) {
    if (this.isNew) {
        this.employeeId = 'MGR' + Date.now() + Math.floor(Math.random() * 1000);
    }
    next();
});

const bankManagerModel = mongoose.model('BankManager', bankManagerSchema);

export default bankManagerModel;