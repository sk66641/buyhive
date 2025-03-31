const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    // name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'user' },
    addresses: { type: [Schema.Types.Mixed] },
    orders: { type: [Schema.Types.Mixed] },
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const virtual = userSchema.virtual('id');
virtual.get(function () {
    return this._id;
})
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
})

exports.User = mongoose.model('User', userSchema);