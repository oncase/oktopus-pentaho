var _defaultFile = { role: "OKTOPUS", db: "links" };
var _adminRole = "ADMINISTRATOR";

// HTML file name
var _file = location.pathname
  .match(/\/\w+\.html/)[0]
  .substring(1)
  .replace(/\.html/, "");

// User roles set for comparison
var _roles = oktopusRoles.map(function(e) {
  return e.toUpperCase();
});

// Sees if user is admin
window._isAdm = _roles.some(function(e) {
  return e === _adminRole;
});

// CONTACT POINT - the app uses this variable
window._canEdit = window._isAdm;

// CONTACT POINT - Default linkspath if at index, default
window._linksPath = _defaultFile.db;

// CONTACT POINT - Default linkspath if at index, default
window._env = _defaultFile.role;
