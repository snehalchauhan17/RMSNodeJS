(function () {
    // Override jQuery detection completely
    Object.defineProperty(window, "jQuery", {
      get: function () {
        return undefined;
      },
    });
  
    Object.defineProperty(window, "$", {
      get: function () {
        return undefined;
      },
    });
  
    // Delete jQuery references
    try {
      delete window.jQuery;
      delete window.$;
    } catch (e) {
      console.error(e);
    }
  })();
  