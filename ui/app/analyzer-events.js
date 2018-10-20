/*
 * GLOBAL Callback Registration Example. Simply require 'analyzer/cv_api' to register callbacks
 */
require(["analyzer/cv_api"], function(apix) {
  // Only registers if into the dashboard
  if (window.top.location.href.includes("ui/app")) {
    // Handles Analyzer Init
    apix.event.registerInitListener(function(e, cv) {
      if (window.top.hideLoading) window.top.hideLoading();
    });
  }
});
