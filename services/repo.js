const { postJSON, getJSON, queryStringify } = require("./ajax")

class Repository {
  constructor(options = {}) {
    const { noReadGenericApi, credentials, url } = options;
    this._baseUri = `${url ? url : ''}${noReadGenericApi ? "/api/v1/" : "/api/v1/r/"}`;
    this._credentials = credentials || {};
  }

  findWhere(modelName, query) {
    if(query && query.where && query.limit) {
      query = {
        filter: {
          where: query.where,
          limit: query.limit
        }
      }
    } else if(query && !query.filter) {
      query = { filter: query || {} }
    }
    console.log(`${this._baseUri}${modelName}${queryStringify(query)}`)
    return getJSON(
      `${this._baseUri}${modelName}${queryStringify(query)}`,
      this._credentials.user,
      this._credentials.password
    );
  }

  findOne(modelName, query) {
    return this.findWhere(modelName, query).then(results => results[0]);
  }

  create(modelName, data) {
    return this.execute(modelName, null, "create", data);
  }

  execute(modelName, action, data) {
    return postJSON(`${this._baseUri}${modelName}/${action}`, data);
  }
}

module.exports = Repository;