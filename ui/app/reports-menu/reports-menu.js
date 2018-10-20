"use strict";

angular
  .module("portalApp.reports-menu", ["ui.router"])
  /* REPORTS-MENU DIRECTIVE ----------------------------------------------------*/
  .directive("reportsMenu", function() {
    return {
      restrict: "E",
      link: function(scope, element, attrs, controllers) {},
      templateUrl: "reports-menu/reports-menu.html",
      controller: "ReportsMenuCtrl",
      controllerAs: "rmCtrl",
      scope: {
        folder: "@folder",
        icon: "@icon",
        title: "@title",
        subtitle: "@subtitle",
        canEdit: "@canEdit",
        index: "@index",
        roles: "@roles"
      }
    };
  })
  /* CONTROLLER ----------------------------------------------------------------*/
  .controller("ReportsMenuCtrl", [
    "platformReportsService", "$timeout", "$scope", "$state", "$window",
    function(platformReportsService, $timeout, $scope, $state, $window) {
      var _self = this;
      var _perItem = 32;
      var _links = {};
      _self.reports = [];
      _self.containerHeight = 0;
      _self.canEdit = window._canEdit;
      $scope.arrow = false;
      $scope.editMode = window.editModeValue;
      $scope.addLink =
        '<md-icon class="material-icons">add_circle</md-icon> Adicionar Link';

      function getContainerHeight() {
        return _perItem * _self.reports.length + "px";
      }

      // Verifica se link dado é o link atual
      _self.isCurrent = platformReportsService.isCurrent;

      _self.toggleReportsVisibility = function() {
        _self.containerHeight =
          _self.containerHeight === 0 ? getContainerHeight() : 0;
      };

      _self.changeArrow = function() {
        $scope.arrow = !$scope.arrow;
      };

      // Fetch links handler
      function fetchLinksHandler(response) {
        //current enviroment  name
        var actualEnvironment = $window._env;
        _links = response.data[actualEnvironment];
        manageJson(_links);
      }

      // Fetch links error handler
      function fetchLinksErrorHandler() {}

      // Pego a promise dos platform links
      platformReportsService
        .fetchLinksfromJson()
        .then(fetchLinksHandler, fetchLinksErrorHandler);

      function manageJson(links) {
        platformReportsService.fetchReports($scope.folder).then(
          function(response) {
            var _reports = response.data ? response.data.repositoryFileDto : [];
            _self.reports = _reports;
            if (links[$scope.folder]) {
              _self.reports = links[$scope.folder]["links"].concat(_reports);
              //Adiciando property folderName para localizar o link
              for (var i = 0; i < _self.reports.length; i++) {
                _self.reports[i]["folderName"] = $scope.folder;
              }
            }
            if (window._canEdit && window.editModeValue) {
              _self.reports.unshift({
                title:
                  '<md-icon class="material-icons">add_circle</md-icon> Adicionar Link',
                route: "add-link",
                params: {
                  folder: $scope.folder
                },
                hasRoute: true,
                crudLink: true
              });
            }
            $timeout(_self.toggleReportsVisibility, 300);
          },
          function(err) {}
        );
      }

      _self.getLinkUrl = function(report) {

        if (report.crudLink) {
          return $state.go(report.route, {
            folder: report.params.folder,
            report: report
          });
        }

        if (report.hasRoute) {
          return $state.go(report.route, {id:report.id});
        }

        //TODO: show loading here
        return $state.go("platform-reports", {
          reportPath: report.path,
          report: report
        });
      };
    }
  ]);
