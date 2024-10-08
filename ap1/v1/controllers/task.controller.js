const Task = require("../models/task.model");
const paginationHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");
const { listUsers } = require("./user.controller");
// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const find = {
    $or:[
      {createdBy:req.user.id},
      {listUsers:req.user.id}
    ],
    deleted: false,
  };
  //sort
  if (req.query.status) {
    find.status = req.query.status;
  }

  //end sort
  //search
  let objectSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  //end search
  // Pagination
  const countTasks = await Task.countDocuments();
  let objectPagination = paginationHelper(
    {
      limitItem: countTasks,
      currentPage: 1,
    },
    req.query,
    countTasks
  );
  // End Pagination
  sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  }
  const tasks = await Task.find(find)
    .sort(sort)
    .skip(objectPagination.skip)
    .limit(objectPagination.limitItem);
  res.json(tasks);
};
// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({
      deleted: false,
      _id: id,
    });
    res.json(task);
  } catch (error) {
    res.json("Không tìm thấy");
  }
};
// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id });
    task.status = req.body.status;
    await task.save();
    console.log(req.body);
    res.json({
      code: 200,
      message: "Cập nhật trạng thái thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!",
    });
  }
};
// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    console.log(req.body);
    const { ids, key, value } = req.body;

    switch (key) {
      case "status":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            status: value,
          }
        );
        res.json({
          code: 200,
          message: "Cập nhật trạng thái thành công",
        });
        break;
      case "delete":
        await Task.updateMany(
          {
            _id: { $in: ids },
          },
          {
            deleted:true,
            deleteAt:new Date()
          }
        );
        res.json({
          code: 200,
          message: "Xoá thành công",
        });
        break;
      default:
        res.json({
          code: 400,
          message: "Không tồn tại!",
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!",
    });
  }
};
// [POST] /api/v1/tasks/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdBy=req.user.id;

    const task = new Task(req.body);
    const data = await task.save();
    res.json({
      code: 200,
      message: "Tạo thành công",
      data: data,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!",
    });
  }
};
// [PATCH] /api/v1/tasks/edit/:id
module.exports.edit = async (req, res) => {
  try {
    await Task.updateOne({ _id: req.params.id }, req.body);
    res.json({
      code: 200,
      message: "Tạo thành công",
      data: await Task.findOne({ _id: req.params.id }),
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!",
    });
  }
};
// [DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
  try {
    await Task.updateOne(
      { _id: req.params.id },
      { deleted: true, deleteAt: new Date() }
    );
    res.json({
      code: 200,
      message: "Xóa thành công",
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại!",
    });
  }
};
