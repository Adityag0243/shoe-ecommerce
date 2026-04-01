import mongoose from 'mongoose';

const ProductDescriptionSchema = new mongoose.Schema(
    {
        shoe_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            unique: true,
        },
        description: { type: String, required: true },
        embedding_description: { type: [Number], required: true, index: true },
    },
    { timestamps: true },
);

export const ProductDescription = mongoose.model(
    'ProductDescription',
    ProductDescriptionSchema,
);
