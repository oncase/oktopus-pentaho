"use strict";

angular
  .module("portalApp.version", [])
  /*  DIRECTIVE --------------------------------------------------------------*/
  .directive("versionLabel", [
    "versionService",
    function(versionService) {
      return {
        restrict: "E",
        link: function(scope, element, attrs, controllers) {},
        templateUrl: "version/version.html",
        controller: "VersionCtrl",
        controllerAs: "vCtrl",
        link: function(scope, element, attrs, tabsCtrl) {
          versionService.fetch();
        }
      };
    }
  ])
  /* CONTROLLER --------------------------------------------------------------*/
  .controller("VersionCtrl", [
    "versionService",
    function(versionService) {
      this.getVersion = function() {
        return versionService.getVersion();
      };
    }
  ])
  /* SERVICE -------------------------------------------------------------------*/
  .service("versionService", [
    "config",
    "$http",
    function(config, $http) {
      var _self = this;
      var _version = "-";

      function fetchResponseHandler(response) {
        _version = response.data.trim();
      }

      function fetchErrorResponseHandler(err) {
      }

      function _fetch() {
        var endpointUrl = config.BASE_URL + "plugin/oktopus/api/getversion";
        $http
          .get(endpointUrl)
          .then(fetchResponseHandler, fetchErrorResponseHandler);
      }

      function _getVersion() {
        return _version;
      }

      return {
        fetch: _fetch,
        getVersion: _getVersion
      };
    }
  ]);
