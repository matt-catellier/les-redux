const Repository = require("./repo");
class WorkFlowController {
  constructor() {
    this.repo = new Repository();
  }

  findWhere(modelName, query) {
    return this.repo.findWhere(modelName, this._formatQuery(query));
  }

  findOne(modelName, query) {
    return this.repo.findOne(modelName, this._formatQuery(query));
  }

  create(modelName, data) {
    return this.repo.create(
      modelName,
    );
  }

  execute(modelName, action, data) {
    return this.repo.execute(
      modelName,
      action,
      data,
    );
  }

  _formatQuery(query) {
    if (query && query.where) return { where: query.where, limit: 500};
    return { where: query, limit: 500 };
  }
}
module.exports = WorkFlowController
