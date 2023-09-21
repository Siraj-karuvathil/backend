const mongoose = require("mongoose");
const { Cart } = require("../../models");

const createCart = async (data) => {
  const cart = await new Cart(data).save();
  return cart;
};

const getAllCart = async () => {
  let [carts, total] = await Promise.all([Cart.find(), Cart.countDocuments()]);
  return { carts, total };
};

const getCartByUserId = async (cartId, select = null) => {
  const id = mongoose.Types.ObjectId(cartId);
  const cart = await Cart.findOne({ userId: id })
    .populate("itemId")
    .select(select);
  return cart;
};

const deleteCartById = async (cartId, price, itemId) => {
  const id = mongoose.Types.ObjectId(cartId);
  return await Cart.updateOne(
    { _id: id },
    { $pull: { itemId }, $set: { price } }
  );
};

const updateCart = async (cartId, price, itemId) => {
  const id = mongoose.Types.ObjectId(cartId);
  return await Cart.updateOne({ _id: id }, { $push: { itemId }, $set: { price } });
};

module.exports = {
  createCart,
  getAllCart,
  getCartByUserId,
  deleteCartById,
  updateCart,
};
