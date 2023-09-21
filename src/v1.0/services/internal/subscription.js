const { Subscription } = require("../../models");
const { getCourseById } = require("./course");

const createSubscription = async (data) => {
    const subscription = await new Subscription(data).save();
    return subscription;
};

const getSubscriptionCountByCourseId = async (courseId) => {
    return await Subscription.countDocuments({ itemId: courseId });
};

const getSubscriptions = async (queryBuilder, condition) => {
    const [subscriptions, total] = await Promise.all([
        Subscription.find(queryBuilder.getFindQuery(condition))
            .sort(queryBuilder.getSortQuery())
            .limit(queryBuilder.getPagination()?.limit)
            .skip(queryBuilder.getPagination()?.skip),
        Subscription.countDocuments(queryBuilder.getFindQuery(condition)),
    ]);
    return { subscriptions, total };
};

const processSubscriptions = async (subscriptions) => {
    const courses = await Promise.all(
        subscriptions?.map(async (item) => {
            return await getCourseById(item);
        })
    );
    return courses;
};

const getSubscriptionByMatch = async (match, select) => {
    return await Subscription.findOne(match).select(select);
};

module.exports = {
    createSubscription,
    getSubscriptionCountByCourseId,
    getSubscriptions,
    processSubscriptions,
    getSubscriptionByMatch,
};
