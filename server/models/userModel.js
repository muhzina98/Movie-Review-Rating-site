const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        name: {
                type: String,
                required: [true, 'Name is required']
        },
        email: {
                type: String,
                required: [true, 'Email is required'],
                trim: true,
                lowercase: true,
                minLength: [5, 'Email must be atleast 5 charecters long'],
                maxLength: [100, 'Email cannot exeed 100 characters']
        },
        password: {
                type: String,
                required: [true, 'Password is required']
        },
        role: {
                type: String,
                enum: ['user', 'admin'],
                default: 'user'
        },
        avathar: {
                type: String,
                default: '',
        },
        stripeCustomerId: String,
        subscriptionId: String,
        subscriptionStatus: String,
        isPrime: { type: Boolean, default: false },
        primeActivatedAt: { type: Date },

},
        { timestamps: true });

module.exports = mongoose.model('User', userSchema)