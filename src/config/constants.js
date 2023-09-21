module.exports = {
    YES: true, // boolean true
    NO: false, // boolean false
    SALT_ROUNDS: 10, // password salt rounds
    JWT_TOKEN_EXPIRES_IN: "2d", // JWT token expiry
    DATE_SAVING_FORMAT: "YYYY-MM-DD", // date is saving in this format
    ITEMS_PER_PAGE: 50, // number of items per page
    STARTING_OF_PAGE: 1, //startting index of a page
    STATUS_ACTIVE: "active", // active
    STATUS_INACTIVE: "inactive", // in-active
    STATUS_SUSPENDED: "suspended", // suspended
    ROUTE_RESET_PASSWORD: "/auth/reset-password?token={token}",
    ITEM_TYPE_COURSE: "Course",
    // roles
    ROLE_SUPER_ADMIN: "superAdmin",
    ROLE_STUDENT: "Student",
    // notifications
    NOTIFICATION_REGISTRATION_SUCCESS: "registrationSuccess",

    // username length
    USERNAME_MIN_LENGTH: 6,
    USERNAME_MAX_LENGTH: 30,

    // string statues
    STATUS_INITIATED: "initiated",
    STATUS_COMPLETED: "completed",
    STATUS_CANCELLED: "cancelled",
    STATUS_FAILED: "failed",

    // payment types
    PAYMENT_TYPE_IN: "IN",
    PAYMENT_TYPE_OUT: "OUT",
    // order id prefix
    ORDER_ID_PREFIX: "COOKINGACADEMY",
    ODRER_ID_PAD_LENGTH: 4,

    // Status codes
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
    TOO_MANY_REQUESTS: 429,
    UNAUTHORIZED_DEVICE: 401,
};
