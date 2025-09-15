import mongoose from "mongoose";
const contactSchema = new mongoose.Schema(
  {
    prenom: {
      type: String,
      required: [true, "Le prénom est obligatoire"],
      trim: true,
    },
    nom: {
      type: String,
      required: [true, "Le nom est obligatoire"],
      trim: true,
    },
    telephone: {
      type: String,
      required: [true, "Le numéro de téléphone est obligatoire"],
      unique: true,
      match: [
        /^[0-9+\-\s()]{6,20}$/,
        "Format du numéro de téléphone invalide",
      ],
    },
  },
  { timestamps: true }
);
const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
