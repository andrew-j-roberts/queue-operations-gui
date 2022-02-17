// file download, https://stackoverflow.com/a/49917066/13414384
export function download(data, fileName, type) {
  let json = JSON.stringify(data);
  let blob = new Blob([json], { type: `application/${type}` });
  let url = URL.createObjectURL(blob);

  let a = document.createElement("a");
  a.download = `${fileName}.${type}`;
  a.href = url;
  a.textContent = `${fileName}.${type}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function getCurrentTimeYYMMDD_HHMMSS() {
  let date = new Date();
  return `${new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[0]} ${
    new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split("T")[1]
  }`;
}

export function getCurrentTimeHHMMSS() {
  let date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  let ampm = hours >= 12 ? "pm" : "am";
  let formattedHours = hours % 12;
  let formattedHours12 = formattedHours ? formattedHours : 12; // the hour '0' should be '12'
  let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  let strTime = `${formattedHours12 + ":" + formattedMinutes + ":" + formattedSeconds + " " + ampm}`;
  return strTime;
}

export function getCurrentTimestamp_UTC() {
  return `${new Date().toUTCString()}`;
}

export function getFirstValue(object) {
  return object[Object.keys(object)[0]];
}

export function getLastValue(object) {
  return object[Object.keys(object)[Object.keys(object).length - 1]];
}

export function deepHasEmptyValue(obj) {
  for (let key in obj) {
    //if the value is 'object'
    if (obj[key] instanceof Object === true) {
      if (deepHasEmptyValue(obj[key]) === true) return true;
    }
    //if value is string/number
    else {
      //if array or string have length is not 0.
      if (obj[key].length === 0) return true;
    }
  }
  return false;
}
