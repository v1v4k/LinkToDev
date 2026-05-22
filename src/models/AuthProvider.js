const mongoose = require("mongoose");

const authProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: ["github", "google"],
      required: true,
    },
    providerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

authProviderSchema.index(
  {
    provider: 1,
    providerId: 1,
  },
  {
    unique: true,
  },
);

const AuthProvider = mongoose.model("AuthProvider", authProviderSchema);

module.exports = { AuthProvider };
