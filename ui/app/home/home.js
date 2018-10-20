"use strict";

angular
  .module("portalApp.home", ["ui.router"])
  .config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("home", {
        url: "/home",
        templateUrl: "home/home.html",
        controller: "HomeCtrl",
        data: {
          title: "Introdução"
        }
      });
    }
  ])
  .controller("HomeCtrl", [function() {}]);
