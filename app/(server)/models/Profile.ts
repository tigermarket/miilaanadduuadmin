import mongoose from "mongoose";
const { Schema } = mongoose;
const profileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 🔗 Back-reference

    profilePicture: { type: String, default: "" },

    description: {
      type: String,
      maxlength: [500, "Description must be less than 500 characters"],
      trim: true,
    },
    socialMediaLinks: {
      type: [String],
      validate: {
        validator: (v) =>
          v.every((link) =>
            /^(https?:\/\/)?([\w\d-]+\.)+[\w-]+(\/[\w-]*)*\/?$/.test(link)
          ),
        message: (props) => `${props.value} contains an invalid URL`,
      },
    },
    location: {
      type: String,
      maxlength: [100, "Location must be less than 100 characters"],
      trim: true,
    },
    website: { type: String },

    occupation: {
      type: String,
      maxlength: [100, "Occupation must be less than 100 characters"],
      trim: true,
    },
    interests: {
      type: [String],
      maxlength: [50, "Each interest must be less than 50 characters"],
      trim: true,
    },
    skills: {
      type: [String],
      maxlength: [50, "Each skill must be less than 50 characters"],
      trim: true,
    },

    favoriteProducts: {
      type: [String],
      maxlength: [100, "Each product name must be less than 100 characters"],
      trim: true,
    },
    purchaseHistory: {
      type: [String],
      maxlength: [100, "Each purchase entry must be less than 100 characters"],
      trim: true,
    },
    wishlist: {
      type: [String],
      maxlength: [100, "Each wishlist item must be less than 100 characters"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
