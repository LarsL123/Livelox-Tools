(() => {
  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this._url = url;
    this._method = method;
    return open.call(this, method, url, ...rest);
  };

  XMLHttpRequest.prototype.send = function (body) {
    const isTarget = this._url && this._url.includes("/Home/GetSessions");

    if (isTarget) {
      console.log("XHR INTERCEPTED:", {
        url: this._url,
        method: this._method,
        body,
      });

      this.addEventListener("load", () => {
        try {
          console.log("XHR RESPONSE:", JSON.parse(this.responseText));
        } catch {
          console.log("RAW RESPONSE:", this.responseText);
        }
      });
    }

    return send.call(this, body);
  };

  console.log("XHR interceptor installed");
})();
