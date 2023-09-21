const mongoose = require("mongoose");
const collectionNames = require("../../config/collectionNames");

module.exports = {
    Migration: require("./migration")(mongoose, collectionNames?.MIGRATION),
    User: require("./user")(mongoose, collectionNames?.USER),
    RoleMaster: require("./roleMaster")(mongoose, collectionNames?.ROLE_MASTER),
    UserRole: require("./userRole")(mongoose, collectionNames?.USER_ROLE),
    UserDevice: require("./userDevice")(mongoose, collectionNames?.USER_DEVICE),
    Course: require("./course")(mongoose, collectionNames?.COURSE),
    ClassDetails: require("./calssDetails")(mongoose, collectionNames?.CLASS_DETAILS),
    Subscription: require("./subscription")(mongoose, collectionNames?.SUBSCRIPTION),
    Cart: require("./cart")(mongoose, collectionNames?.CART),
    Order: require("./order")(mongoose, collectionNames?.ORDER),
    Payment: require("./payment")(mongoose, collectionNames?.PAYMENT),
};
