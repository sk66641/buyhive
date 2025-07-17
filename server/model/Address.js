const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        region: { type: String, required: true },
        pinCode: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

const virtual = addressSchema.virtual('id');
virtual.get(function () {
    return this._id;
})
addressSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
})

exports.Address = mongoose.model('Address', addressSchema);