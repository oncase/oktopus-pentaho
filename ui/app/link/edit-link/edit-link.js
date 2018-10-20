'use strict';

angular
  .module('portalApp.edit-link', ['ui.router'])
  .config([
    '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('artifact.edit', {
        url: '/edit',
        templateUrl: 'link/edit-link/edit-link.html',
        controller: 'EditCtrl',
        data: {
          title: 'Editar',
          showEdit: false
        },
        controllerAs: 'ctrl'
      });
    }
  ])
  .controller('EditCtrl', [
    'platformReportsService', '$window', 
    function( platformReportsService, $window ) {
      var _self = this;

      _self.formEdit = platformReportsService.getCurrentLink();
      platformReportsService.on(['links:loaded', 'route:changed'], function(){
        _self.formEdit = platformReportsService.getCurrentLink();
      });

      this.submit = function() {
        platformReportsService.updateLink(_self.formEdit);
      };

      this.cancel = function(){
        $window.history.back();
      }
    }
  ]);
