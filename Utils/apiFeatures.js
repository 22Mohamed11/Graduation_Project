class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    const queryObject = { ...this.queryString };
    const excludesFields = ["page", "sort", "selectedFields", "searchBy"];
    excludesFields.forEach((item) => {
      delete queryObject[item];
    });
    const queryStr = JSON.stringify(queryObject).replace(
      /\b(gt|gte|lt|lte)\b/g,
      (match) => `$${match}`
    );
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
  fields() {
    if (this.queryString.selectedFields) {
      const fields = this.queryString.selectedFields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }
  search(modelName) {
    if (this.queryString.searchBy) {
      let query = {};
      if (modelName === "users") {
        query.$or = [
          { title: { $regex: this.queryString.searchBy, $options: "i" } },
          { description: { $regex: this.queryString.searchBy, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.searchBy, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
  paginate(documents) {
    const page = this.queryString.page * 1 || 1;
    const limit = 10;
    const skipItems = (page - 1) * limit;

    // pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.totalPages = Math.ceil(documents / limit);
    pagination.limit = limit;
    if (page < pagination.totalPages) {
      pagination.next = page + 1;
    }
    if (page > 1) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skipItems).limit(limit);
    this.paginationResult = pagination;
    return this;
  }
}

exports.ApiFeatures;
