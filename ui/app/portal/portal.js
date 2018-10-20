'use strict';

angular
  .module('portalApp.portal-controller', [])
  /* CONTROLLER ----------------------------------------------------------------*/
  .controller('PortalController', [
    '$location', '$mdDialog', 'platformReportsService', '$scope', '$state', '$window', '$mdPainLessToast', 'portalService', '$transitions', 'config',
    function( $location, $mdDialog, platformReportsService, $scope, $state, $window, $mdPainLessToast, portalService, $transitions, config ) {
      var _self = this;
      _self.canEdit = $window._canEdit;
    
      $scope.showSidebar = true;
      $scope.editMode = $window.editModeValue;

      // Mudar modo de edição/modo normal
      $scope.setEditMode = function() {
        $scope.editMode = !$scope.editMode;
        portalService.setEditMode($scope.editMode);
        $window.location.reload();
        $state.go('home');
      };

      // Hook para mudança de estado - o serviço delinks registra o link atual
      $transitions.onSuccess({}, function(transition) {
        platformReportsService.onEnterRoute( transition );
      });

      // Hidden Menu SideBar
      $scope.showSidebarMenu = function() {
        $scope.showSidebar = !$scope.showSidebar;
      };

      // Quando o link atual for atualizado, atualiza valor do controller
      platformReportsService.on('link:changed', function( currentLink ){
        _self.currentLink = currentLink;
      })

      // Quando os links forem carregados, atualiza valor do controller
      platformReportsService.on('links:loaded', function( links ){
        _self.environment = links;
      })

      // Valor do titulo da toolbar
      this.getCurrentTitle = function() {
        return ($state && $state.current && $state.current.data) 
                ? $state.current.data.title
                : '';
      };

      $scope.shouldShowEditButtons = function(){
        return $state.current.data && $state.current.data.showEdit === true
      }

      // Confirmacao de delete
      $scope.confirmLinkDelete = function(ev) {
        var current = platformReportsService.getCurrentLink();
        var confirm = $mdDialog
          .confirm()
          .title('Tem certeza que deseja remover o link: "'+current.title +'"?')
          .textContent('Não será possível recuperá-lo.')
          .ariaLabel('Delete link?')
          .targetEvent(ev)
          .ok('Continuar')
          .cancel('Cancelar');

        $mdDialog.show(confirm).then(
          function() {
            platformReportsService.updateLink(current, true /* shouldDelete */);
          },
          function() {}
        );
      };

      // Compartilhamento de link
      $scope.shareLink = function(name) {
        var copyElement = document.createElement('textarea');
        copyElement.style.position = 'fixed';
        copyElement.style.opacity = '0';
        copyElement.textContent = $window.location.href;
        var body = document.getElementsByTagName('body')[0];
        body.appendChild(copyElement);
        copyElement.select();
        document.execCommand('copy');
        body.removeChild(copyElement);
        $mdPainLessToast.show('Link Copiado');
      };

      this.logout = function() {
        $window.location.href = config.BASE_URL + 'Logout';
      };

      this.adm = function() {
        $window.open(config.BASE_URL + 'Home');
      };
      
    }
  ])
  .service('portalService', [
    'config',
    '$http',
    function(config, $http) {
      var _self = this;

      function _setEditMode(editMode) {
        var editModeValue = 'var editModeValue = ' + editMode + ';';
        var endpointUrl =
          config.BASE_URL +
          'plugin/oktopus/api/setEditMode?paramdata=' +
          editModeValue;

        return $http.get(endpointUrl);
      }

      return {
        setEditMode: _setEditMode
      };
    }
  ]);
