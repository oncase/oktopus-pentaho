"use strict";

angular
  .module("portalApp", [
    "ui.router",
    "ngMaterial",
    "ngSanitize",
    "ngOrderObjectBy",
    "portalApp.home",
    "portalApp.platform-reports",
    "portalApp.link-groups",
    "portalApp.add-link",
    "portalApp.edit-link",
    "portalApp.version",
    "portalApp.add-group",
    "portalApp.edit-group",
    "portalApp.reports-menu",
    "portalApp.portal-controller",
    "portalApp.group-service"
  ])
  /* CONFIGS -------------------------------------------------------------------*/
  .config([
    "$urlRouterProvider",
    "$stateProvider",
    function($urlRouterProvider, $stateProvider) {
      $urlRouterProvider.otherwise("/home");
    }
  ])
  .config(function($mdAriaProvider) {
    // Globally disables all ARIA warnings.
    $mdAriaProvider.disableWarnings();
  })
  .config(function($mdThemingProvider) {
    // http://mcg.mbitson.com/#!?oktopus=%23330060&themename=mcgtheme
    $mdThemingProvider.definePalette('oktopus', {
      '50': 'e7e0ec',
      '100': 'c2b3cf',
      '200': '9980b0',
      '300': '704d90',
      '400': '522678',
      '500': '330060',
      '600': '2e0058',
      '700': '27004e',
      '800': '200044',
      '900': '140033',
      'A100': '946bff',
      'A200': '6f38ff',
      'A400': '4b05ff',
      'A700': '4100eb',
      'contrastDefaultColor': 'light',
      'contrastDarkColors': [
        '50',
        '100',
        '200',
        'A100'
      ],
      'contrastLightColors': [
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
        'A200',
        'A400',
        'A700'
      ]
    });
    $mdThemingProvider
      .theme("default")
      .primaryPalette("oktopus")
      .accentPalette("amber");
  })
  /* CONSTANTS -------------------------------------------------------------------*/
  .constant("config", {
    BASE_URL: "../../../",
    uuid: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  })
  .filter("rawHtml", [
    "$sce",
    function($sce) {
      return function(val) {
        return $sce.trustAsHtml(val);
      };
    }
  ])
  /* ESC directive ----------------------------------------------------------------*/
  .directive("keypressEvents", [
    "$document",
    "$rootScope",
    function($document, $rootScope) {
      return {
        restrict: "A",
        link: function() {
          $document.bind("keydown", function(e) {
            $rootScope.$broadcast("keydown:" + e.which, e);
          });
        }
      };
    }
  ])
  .service("$mdPainLessToast", function($mdToast) {
    return {
      show: function(content) {
        return $mdToast.show(
          $mdToast
            .simple()
            .content(content)
            .position("top right")
            .hideDelay(1500)
        );
      }
    };
  })
  .filter("trusted", [
    "$sce",
    function($sce) {
      return function(url) {
        return $sce.trustAsResourceUrl(url);
      };
    }
  ]);
