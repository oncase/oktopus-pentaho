"use strict";

angular
  .module("portalApp.add-group", ["ui.router"])
  .config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("add-group", {
        url: "/add-group",
        templateUrl: "group/add-group/add-group.html",
        controller: "GroupCtrl",
        data: {
          title: "Adicionar",
          showEdit: false
        },
        controllerAs: "ctrl"
      });
    }
  ])
  .controller("GroupCtrl", [
    "$timeout", "$q", "$log", "groupService", "$element", "platformReportsService", "$location", "$scope", "$window", "$state",
    function( $timeout, $q, $log, groupService, $element, platformReportsService, $location, $scope, $window, $state ) {
      var _self = this;
      $scope.folder = "";

      $scope.groupEditForm = {
        roles: [],
        folder: "",
        links: [],
        title: "",
        icon: "",
        index: 0
      };

      _self.icons = getIcons();

      // Init function to get platform roles
      _self.getAllRoles = function() {
        groupService
          .fetchAllRoles()
          .then(function(response){
            $scope.roles = response.data.roles;
          }, function(err){ });
      };

      // gets available icons to choose
      function getIcons() {
        return groupService.getAllICons().map(function(icon) {
          icon.value = icon.name.toLowerCase();
          return icon;
        });
      }

      //stores the initial icon selection
      function setCurrenteIcon(iconValue) {
        groupService.getAllICons().map(function(key) {
          if (key.icon == iconValue) {
            _self.selectedIcon = key;
          }
        });
      }

      // Filters the available icons
      _self.querySearch = function(query) {
        var results = query
            ? _self.icons.filter(createFilterFor(query))
            : _self.icons,
          deferred;
        return results;
      };

      // Creates a filter function for a query string - used on icons
      function createFilterFor(query) {
        return function filterFn(item) {
          return item.value.indexOf(angular.lowercase(query)) === 0;
        };
      }


      // Não altera folder/grupo
      this.cancel = function() {
        $window.history.back();
      };

      // Altera folder/grupo
      this.submitGroup = function() {

        platformReportsService.updateFolder(
          $scope.groupEditForm.folder,
          $scope.groupEditForm
        );

      };

    }
  ]);
