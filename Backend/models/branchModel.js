import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
    // Branch Information
    branchName: { type: String, required: true },
    branchId: { type: String, unique: true },
    
    
    // Address
    address: { type: Object, default: {line1: '', line2: ''} },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    
    // Branch Details
    branchType: { type: String, enum: ['Main Branch', 'Sub Branch', 'ATM Center'], required: true },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'BankManager', default: null },
    managerName: { type: String, default: "Not Assigned" },
    
    // Operating Details
    openingHours: { type: String, default: "9:00 AM - 5:00 PM" },
    workingDays: { type: String, default: "Monday - Friday" },
    establishedDate: { type: Date, required: true },
    
    // Branch Status
    status: { type: String, enum: ['Active', 'Inactive', 'Under Maintenance'], default: 'Active' }
    
}, {
    timestamps: true
});

// Auto-generate branch ID before saving
branchSchema.pre('save', async function(next) {
    if (this.isNew) {
        this.branchId = 'BR' + Date.now() + Math.floor(Math.random() * 1000);
    }
    next();
});

const branchModel = mongoose.model('Branch', branchSchema);

export default branchModel;