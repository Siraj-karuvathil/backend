const { Order } = require("../../models");
const { getCourseById } = require("./course");

const createOrder = async (data) => {
    const order = await new Order(data).save();

    //send order success email
    return order;
};

const getOrders = async (queryBuilder, condition) => {
    const [orders, total] = await Promise.all([
        Order.find(queryBuilder.getFindQuery(condition))
            .sort(queryBuilder.getSortQuery())
            .limit(queryBuilder.getPagination()?.limit)
            .skip(queryBuilder.getPagination()?.skip),
        Order.countDocuments(queryBuilder.getFindQuery(condition)),
    ]);
    return { orders, total };
};

const getOrderByMatch = async (match, select) => {
    return await Order.fineOne(match).select(select);
};

const getOrderById = async (id, select) => {
    return await Order.findById(id).select(select);
};

const updateOrderByMatch = async (match, data) => {
    return await Order.updateOne(match, { $set: data });
};

const updateOrderById = async (id, data) => {
    return await updateOrderByMatch({ _id: id }, data);
};

const processOrders = async (orders) => {
    return await Promise.all(
        orders.map(async (order) => {
            let data = await Promise.all(
                order.items.map(async (item) => {
                    const id = item.itemId;
                    const course = await getCourseById(id);
                    return {
                        ...item.toObject(),
                        image: course?.image ?? null,
                    };
                })
            );
            return {
                ...order.toObject(),
                items: data,
            };
        })
    );
};

module.exports = {
    createOrder,
    getOrders,
    processOrders,
    getOrderByMatch,
    getOrderById,
    updateOrderByMatch,
    updateOrderById,
};
