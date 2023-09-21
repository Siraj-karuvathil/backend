const { ITEMS_PER_PAGE, STARTING_OF_PAGE } = require("../../../config/constants");

const makeQueryBuilder = (req) => {
    let { query, filters, sort, page, size, select } = req?.query ?? {};
    function createFilterQuery(filterObj) {
        let filterQuery = {};
        for (const [key, value] of Object.entries(filterObj)) {
            filterQuery[key] = value;
        }
        return filterQuery;
    }

    function createSortQuery(sortObj) {
        let sortQuery = {};
        for (const [key, value] of Object.entries(sortObj)) {
            sortQuery[key] = value;
        }
        return sortQuery;
    }

    if (sort) {
        sort = createSortQuery(JSON.parse(sort));
    }

    let pagination = {};
    pagination["limit"] = size ? (typeof size === "string" ? parseInt(size) : size) : ITEMS_PER_PAGE;
    pagination["skip"] =
        ((page ? (typeof page === "string" ? parseInt(page) : page) : STARTING_OF_PAGE) - 1) * pagination["limit"];

    function getFindQuery(condition = {}) {
        if (query) {
            condition.$text = { $search: query };
        }

        if (filters) {
            condition = {
                ...condition,
                ...createFilterQuery(JSON.parse(filters)),
            };
        }
        return condition;
    }

    function getPagination() {
        return pagination;
    }

    function getSortQuery() {
        return sort;
    }

    function getSelectFields() {
        if (select) return select;
        return "";
    }

    return Object.freeze({
        getFindQuery,
        getPagination,
        getSortQuery,
        getSelectFields,
    });
};

module.exports = {
    makeQueryBuilder,
};
