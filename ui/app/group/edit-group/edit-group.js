'use strict';

angular
  .module('portalApp.edit-group', ['ui.router'])
  .config([
    '$stateProvider',
    function($stateProvider) {
      $stateProvider.state('edit-group', {
        url: '/edit-group/:folder',
        templateUrl: 'group/edit-group/edit-group.html',
        controller: 'EditGroupCtrl',
        data: {
          title: 'Editar',
          showEdit: false
        },
        controllerAs: 'ctrl'
      });
    }
  ])
  .controller('EditGroupCtrl', [
    'groupService', '$mdDialog', 'platformReportsService', '$scope', '$state',
    function( groupService, $mdDialog, platformReportsService, $scope, $state ) {
      var _self = this;

      // LOADING ---------------------------------------------------------------

      $scope.groupEditForm = {};
      _self.icons = getIcons();
      var _fallbackGroup;

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


      // gets folder info as soon as it's ready
      platformReportsService.on('links:loaded', folderReady);
      folderReady(); // tenta iniciar o estado

      function folderReady(){
        $scope.groupEditForm = platformReportsService.getFolder($state.params.folder);

        if($scope.groupEditForm === undefined) return;

        _fallbackGroup = angular.copy($scope.groupEditForm);
        $scope.selectedRoles = $scope.groupEditForm.roles;
        setCurrenteIcon($scope.groupEditForm.icon);
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

      // Delete process
      this.deleteDialog = function(ev) {
        var confirm = $mdDialog
          .confirm()
          .title('Tem certeza que deseja remover o Grupo "'+$scope.groupEditForm.title+'"?')
          .textContent('Isso também apagará todos os links e permissões. Não será possível recuperá-lo.')
          .ariaLabel('Apagar grupo')
          .targetEvent(ev)
          .ok('Continuar')
          .cancel('Cancelar');

        $mdDialog.show(confirm).then(deleteGroup, function() {} );
      };

      // Apaga folder/grupo
      var deleteGroup = function() {

        platformReportsService.updateFolder(
          $state.params.folder,
          $scope.groupEditForm,
          true
        );

      };

      // Não altera folder/grupo
      this.cancel = function() {

        // Volta atras em todos os atributos alterados
        Object.keys($scope.groupEditForm).forEach(function(key){
          if( Array.isArray($scope.groupEditForm[key]) ){
            $scope.groupEditForm[key] = _fallbackGroup[key].slice(0);
          }else{
            $scope.groupEditForm[key] = _fallbackGroup[key];
          }
          
        })
        $state.go('home');
      };

      // Altera folder/grupo
      this.submitGroup = function() {
        platformReportsService.updateFolder(
          $state.params.folder,
          $scope.groupEditForm
        );

      };
    }
  ]);
