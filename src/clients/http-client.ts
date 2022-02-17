import type { Request } from "../types";

export async function getData(request: Request) {
  const { baseUrl, endpoint, queryString, basicAuthUsername, basicAuthPassword, headers } = request;

  // create fully formed url
  let url = baseUrl;
  if (endpoint) {
    url = `${url}/${endpoint}`;
  }
  if (queryString) {
    url = `${url}${queryString}`;
  }

  // add auth to headers
  headers.set("Authorization", "Basic " + btoa(basicAuthUsername + ":" + basicAuthPassword));

  // make request and store response
  const response = await fetch(url, {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers,
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  });

  // return deserialized response
  return response.json(); // parses JSON response into native JavaScript objects
}

export async function postData(request: Request) {
  const { baseUrl, endpoint, queryString, basicAuthUsername, basicAuthPassword, headers, body } = request;

  // create fully formed url
  let url = baseUrl;
  if (endpoint) {
    url = `${url}/${endpoint}`;
  }
  if (queryString) {
    url = `${url}${queryString}`;
  }

  // add auth to headers
  headers.set("Authorization", "Basic " + btoa(basicAuthUsername + ":" + basicAuthPassword));

  // make request and store response
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers,
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body, // body data type must match "Content-Type" header
  });

  // return deserialized response
  return response.json(); // parses JSON response into native JavaScript objects
}
