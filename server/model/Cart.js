const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        quantity: { type: Number, require: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        color: { type: Object },
        size: { type: Object },
    },
    {
        timestamps: true,
    }
)

const virtual = cartSchema.virtual('id');
virtual.get(function () {
    return this._id;
})
cartSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
})

exports.Cart = mongoose.model('Cart', cartSchema);