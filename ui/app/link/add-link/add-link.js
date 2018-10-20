'use strict';

angular
  .module('portalApp.add-link', ['ui.router'])
  .config([
    '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('add-link', {
        url: '/add-link/:folder',
        templateUrl: 'link/add-link/add-link.html',
        controller: 'addLinkCtrl',
        data: {
          title: 'Adicionar',
          showEdit: false
        },
        controllerAs: 'ctrl'
      });
    }
  ])
  .controller('addLinkCtrl', [
    'platformReportsService', 'config', '$window','$stateParams',
    function(platformReportsService, config, $window, $stateParams) {
      var _self = this;

      _self.linkForm = {
        title: '',
        route: 'artifact',
        params: {},
        hasRoute: true,
        id: config.uuid(),
        folder: $stateParams.folder,
      };

      this.submit = function() {
        platformReportsService.updateLink(
          _self.linkForm, undefined, $stateParams.folder);
      };
      
      this.cancel = function() {
        $window.history.back();
      };
    }
  ]);
