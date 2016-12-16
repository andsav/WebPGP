window.React = React;

window.openpgp.initWorker({
  path: "bower_components/openpgp/dist/openpgp.worker.min.js"
});
window.openpgp.config.aead_protect = true;

let safeId = (n) => n.toLowerCase().split(" ").join("-");

const DEFAULT_PAGE = "generate";
