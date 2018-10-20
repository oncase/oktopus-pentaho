"use strict";

angular
  .module("portalApp.link-groups", ["ui.router"])
  /* CONFIGS -------------------------------------------------------------------*/
  .config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("artifact", {
        url: "/artifact/:id",
        templateUrl: "link/link-groups/link-groups.html",
        controller: "LinkCtrl",
        controllerAs: "LinkCtrl",
        data:{
          showEdit: true
        }
      });
    }
  ])
  /* CONTROLLER ----------------------------------------------------------------*/
  .controller("LinkCtrl", [
    "$scope", "$window", "$stateParams", "platformReportsService",
    function( $scope, $window, $stateParams, platformReportsService ) {
      var _self = this;
      _self.currentLink = {};

      _self.currentLink = platformReportsService.getCurrentLink();

      platformReportsService.on(['links:loaded', 'route:changed'], function(){
        _self.currentLink = platformReportsService.getCurrentLink();
      });

      setHgt($window.innerHeight);
      /**
       * Setting a watch to window height to keep footer always
       * on the bottom
       */
      $scope.$watch( function() { return $window.innerHeight; }, setHgt, true );

      /**
       * Container height setter
       */
      function setHgt(val) { _self.hgt = val + 90 + "px"; }

      angular.element($window).bind("resize", function() {
        $scope.$apply();
      });
    }
  ])

  /* SERVICE -------------------------------------------------------------------*/
  .service("linkGroupsService", [
    "config",
    "$http",
    function(config, $http) {
      var _self = this;

      return {};
    }
  ]);
