const expressAsyncHandler = require("express-async-handler");
const { ApiFeatures } = require("../Utils/apiFeatures");
exports.getAllMethod = (model, name) =>
  expressAsyncHandler(async (req, res) => {
    let filterData = {};
    if (req.filterData) {
      filterData = req.filterData;
    }
    // Build Query
    const documents = await model.countDocuments();
    const features = new ApiFeatures(model.find(filterData), req.query)
      .paginate(documents)
      .sort()
      .fields()
      .search(name)
      .filter();
    // Execute Query
    const { mongooseQuery, paginationResult } = features;
    const allDocuments = await mongooseQuery;
    res.json({ size: allDocuments.length, paginationResult, allDocuments });
  });
