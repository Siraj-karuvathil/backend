module.exports = (mongoose, collectionName) => {
  const schema = mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      itemId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
      price: {
        type: Number,
      },
    },
    {
      timestamps: true,
    }
  );

  return mongoose.model("Cart", schema, collectionName);
};
