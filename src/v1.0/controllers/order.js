const messages = require("../../config/messages");
const {
  getCourseById,
  editCourseById,
  getCoursesById,
} = require("../services/internal/course");
const {
  createOrder,
  getOrders,
  processOrders,
} = require("../services/internal/order");
const { makeQueryBuilder } = require("../services/internal/queryBuilder");
const {
  createSubscription,
  getSubscriptionCountByCourseId,
} = require("../services/internal/subscription");
const {
  ITEM_TYPE_COURSE,
  STATUS_COMPLETED,
} = require("../../config/constants");
const { deleteCartByUserId } = require("./cart");

const addOrder = async (productIds, userId) => {
  const courses = await getCoursesById(productIds);
  const subscriptionDatas = courses.map((course) => {
    const subscriptionData = {
      userId,
      itemId: course._id,
      itemType: ITEM_TYPE_COURSE,
    };
    return subscriptionData;
  });
  const orderItems = courses.map((course) => {
    const orderItem = {
      itemId: course._id,
      itemType: ITEM_TYPE_COURSE,
      price: course.price,
      itemName: course.name,
      amount: course.price,
    };
    return orderItem;
  });
  const orderData = {
    userId,
    amount: orderItems.reduce((acc, val) => acc + val.price, 0),
    status: STATUS_COMPLETED,
    items: orderItems,
  };
  const order = await createOrder(orderData);
  await Promise.all(
    subscriptionDatas.map((subscriptionData) =>
      createSubscription(subscriptionData)
    )
  );
  await Promise.all(
    orderItems.map(async (item) => {
      const subscriptionCount = await getSubscriptionCountByCourseId(
        item.itemId
      );
      await editCourseById(item.itemId, { subscriptionCount });
    })
  );
  await deleteCartByUserId(userId);
  return {
    orderId: order._id,
    message: messages?.orderAddedSuccess,
  };
};

const viewOrders = async (req) => {
  const queryBuilder = makeQueryBuilder(req);
  const condition = { userId: req?.user?._id };
  let data = await getOrders(queryBuilder, condition);
  data.orders = await processOrders(data.orders);
  return {
    message: messages?.success,
    data,
  };
};

module.exports = {
  addOrder,
  viewOrders,
};
