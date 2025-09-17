import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: [true, 'Le numéro de téléphone est obligatoire.'],
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;