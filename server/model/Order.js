const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        items: { type: [mongoose.Schema.Types.Mixed], required: true },
        totalAmount: { type: Number, required: true },
        totalItems: { type: Number, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        paymentMethod: { type: String, required: true, default: "cash", enum: ['cash', 'card']  },
        status: { type: String, default: "pending", required: true },
        paymentStatus: { type: String, default: "pending" },
        selectedAddress: { type: Object, required: true },
    },
    {
        timestamps: true,
    });

const virtual = orderSchema.virtual('id');
virtual.get(function () {
    return this._id;
})
orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id }
})

exports.Order = mongoose.model('Order', orderSchema);