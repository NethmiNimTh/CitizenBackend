import mongoose from "mongoose";

const humanActivitySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "Human Activity",
    },
    activityType: {
      type: String,
      required: [true, "Activity type is required"],
      enum: [
        // Environmental Impacts
        "Fire",
        "Deforestation",
        "Mining",
        "Waste & Pollution",
        "Waste disposal",
        "Plastic and polythene",
        "Constructions",
        "Domestic Animal",
        "Hunting",
        "Illegal behaviour",
        "Other",
      ],
    },
    photo: {
      type: String,
      required: [true, "Photo is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    timeOfDay: {
      type: String,
      required: [true, "Time of day is required"],
      enum: ["Morning", "Noon", "Evening", "Night"],
    },
    description: {
      type: String,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const HumanActivity = mongoose.model("HumanActivity", humanActivitySchema);

export default HumanActivity;
