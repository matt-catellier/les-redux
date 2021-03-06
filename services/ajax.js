const _ = require("lodash");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

function safeParseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

class RequestError extends Error {
  constructor(name, message) {
    super();
    this.name = name;
    this.message = message;
  }
}

const statusToErrorNameMap = {
  400: "BadRequest",
  401: "Unauthorized",
  403: "Forbidden",
  404: "NotFound",
  500: "ServerError"
};
function getErrorNameFromRequestStatus(xhr) {
  return statusToErrorNameMap[xhr.status] || xhr.statusText.replace(/\s/g, "");
}

function handleRequestFailure(req, reject) {
  if(req.statusText && req.statusText.code === "ECONNREFUSED") {
    return reject(new RequestError(req.statusText.code, [{msg: "DOH. API IS NOT RUNNING!!!"}]));
  }
  const response = safeParseJSON(req.responseText);
  const errorName = getErrorNameFromRequestStatus(req);

  if (req.status === 400 && response) {
    return reject(new RequestError(errorName, response.message));
  }

  const message = (response && response.message) || "N/A";
  return reject(new RequestError(errorName, [{msg: message}]));
}

function handleRequestSuccess(oReq, resolve, reject) {
  if (typeof oReq.response === "string") {
    return resolve(JSON.parse(oReq.response));
  }
  if (typeof oReq.response === "object") {
    return resolve(oReq.response);
  }
  return reject(new Error("Wrong return type."));
}

function handleStateChange(oReq, resolve, reject) {
  if (oReq.readyState !== 4) {
    return;
  }
  if (oReq.status >= 200 && oReq.status < 300) {
    return handleRequestSuccess(oReq, resolve, reject);
  }
  handleRequestFailure(oReq, reject);
}

function postJSON(url, data) {
  return new Promise((resolve, reject) => {
    const oReq = new XMLHttpRequest();
    oReq.withCredentials = true;
    oReq.onreadystatechange = () => handleStateChange(oReq, resolve, reject);
    oReq.open("POST", url, true);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Content-Type", "application/json");

    if (data) oReq.send(JSON.stringify(data));
    else oReq.send();
  });
}

const getJSON = (url, user, password) => {
  return new Promise((resolve, reject) => {
    const oReq = new XMLHttpRequest();
    oReq.withCredentials = true;
    oReq.onreadystatechange = () => handleStateChange(oReq, resolve, reject);
    oReq.open("GET", url, true, user, password);
    oReq.setRequestHeader("Accept", "application/json");
    oReq.setRequestHeader("Content-Type", "application/json");
    oReq.setRequestHeader("Cache-Control", "no-cache");
    oReq.send();
  });
}

const queryToFilter = (query) => {
  return query ? `?filter=${JSON.stringify(query)}` : "";
}

const queryStringify = (query) => {
  if (!query) return "";
  return Object.getOwnPropertyNames(query).reduce((qs, key) => {
    const sep = qs.length === 0 ? "?" : "&";
    const value = _.isObject(query[key])
      ? JSON.stringify(query[key])
      : query[key];
    return `${qs}${sep}${key}=${value}`;
  }, "");
}

module.exports = {
  postJSON,
  getJSON,
  queryToFilter,
  queryStringify
}
