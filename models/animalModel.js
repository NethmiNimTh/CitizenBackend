import mongoose from "mongoose";

const animalSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: 'Animal',
    },
    animalType: {
      type: String,
      required: [true, 'Animal type is required'],
      // --- UPDATED: This enum now matches your frontend/controller ---
      enum: [
        'Mammal', 
        'Bird', 
        'Reptile', 
        'Amphibian', 
        'Fish',
        'AnnelidBivalve', // Annelids / Bivalves
        'ButterflyMoth',  // Butterfly / Moth
        'Dragonfly',      // Dragonfly / Damselfly
        'Spider',
        'OtherInsect',    // Other Insects
        'Crustacean'      // Crustacean (e.g., Crab)
      ],
    },
    photo: {
      type: String,
      required: [true, 'Photo is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    timeOfDay: {
      type: String,
      required: [true, 'Time of day is required'],
      enum: ['Morning', 'Noon', 'Evening', 'Night'],
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

const Animal = mongoose.model("Animal", animalSchema);

export default Animal;