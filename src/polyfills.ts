// polyfill XMLHttpRequest
(global as any).XMLHttpRequest = require("xhr2");