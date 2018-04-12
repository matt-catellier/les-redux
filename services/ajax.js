import _ from "lodash";

function safeParseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

class RequestError extends Error {
  constructor(name, message) {
    super(message);
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
  const response = safeParseJSON(req.responseText);
  const errorName = getErrorNameFromRequestStatus(req);

  if (req.status === 400 && response) {
    return reject(new RequestError(errorName, response.message));
  }

  const message = (response && response.message) || "N/A";
  reject(new RequestError(errorName, [{msg: message}]));
}

function handleRequestSuccess(oReq, resolve, reject) {
  if (typeof oReq.response === "string") {
    return resolve(JSON.parse(oReq.response));
  }
  if (typeof oReq.response === "object") {
    return resolve(oReq.response);
  }
  reject(new Error("Wrong return type."));
}

function handleStateChange(oReq, resolve, reject) {
  if (oReq.readyState !== XMLHttpRequest.DONE) {
    return;
  }
  if (oReq.status >= 200 && oReq.status < 300) {
    return handleRequestSuccess(oReq, resolve);
  }
  handleRequestFailure(oReq, reject);
}

export function postJSON(url, data) {
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

export function getJSON(url, user, password) {
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

export function getPdf(url, user, password) {
  return new Promise((resolve, reject) => {
    const oReq = new XMLHttpRequest();
    oReq.withCredentials = true;
    oReq.open("GET", url, true, user, password);
    oReq.setRequestHeader("Accept", "application/pdf");
    oReq.setRequestHeader("Content-Type", "application/pdf");
    oReq.setRequestHeader("Cache-Control", "no-cache");
    oReq.onload = function () {
      if (this.status === 200) {
        let disposition = oReq.getResponseHeader('content-disposition')
        let filename = disposition.split("=")[1].replace(/"/g, '') + ".pdf"
        const blob = new Blob([oReq.response], {type: "image/pdf"})
        let a = document.createElement("a");
        a.style = "display: none";
        document.body.appendChild(a);
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        handleRequestFailure(oReq, reject)
      }
    }
    oReq.send();
  })
}

export function queryToFilter(query) {
  return query ? `?filter=${JSON.stringify(query)}` : "";
}

export function queryStringify(query) {
  if (!query) return "";
  return Object.getOwnPropertyNames(query).reduce((qs, key) => {
    const sep = qs.length === 0 ? "?" : "&";
    const value = _.isObject(query[key])
      ? JSON.stringify(query[key])
      : query[key];
    return `${qs}${sep}${key}=${value}`;
  }, "");
}
