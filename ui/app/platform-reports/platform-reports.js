"use strict";

angular
  .module("portalApp.platform-reports", ["ui.router"])
  /* CONFIGS -------------------------------------------------------------------*/
  .config([
    "$stateProvider",
    function($stateProvider) {
      $stateProvider.state("platform-reports", {
        url: "/platform-reports/:reportPath",
        templateUrl: "platform-reports/platform-reports.html",
        controller: "ReportCtrl",
        controllerAs: "ReportCtrl",
        data: {
          title: "Relatórios"
        }
      });
    }
  ])
  /* CONTROLLER ----------------------------------------------------------------*/
  .controller("ReportCtrl", [
    "config",
    "$scope",
    "$window",
    "$stateParams",
    "platformReportsService",
    "$state",
    function(
      config,
      $scope,
      $window,
      $stateParams,
      platformReportsService,
      $state
    ) {
      var _self = this;
      platformReportsService
        .getReport($stateParams.reportPath)
        .then(getReportResponseHandler, getReportErrorHandler);

      function getReportResponseHandler(response) {
        var actualEnvironment = $window._env;
        _self.currentReport = response.data;
        _self.currentReport["title"] = _self.currentReport.name;

        var _title = _self.currentReport["title"];
        $state.current.data.title = _title.substring(
          0,
          _title.lastIndexOf(".")
        );

        var viewOrEdit =
          _self.currentReport.path.indexOf("xanalyzer") >= 0
            ? "/editor?showRepositoryButtons=true"
            : "/viewer?showRepositoryButtons=true";

        _self.currentReport.url =
          config.BASE_URL +
          "api/repos/" +
          _self.currentReport.path.replace(/\//g, ":") +
          viewOrEdit;
      }

      function getReportErrorHandler(error) {}

      setHgt($window.innerHeight);
      /**
       * Setting a watch to $window height to keep footer always
       * on the bottom
       */
      $scope.$watch(
        function() {
          return $window.innerHeight;
        },
        setHgt,
        true
      );

      /**
       * Container height setter
       */
      function setHgt(val) {
        _self.hgt = val - 170 + "px";
      }

      angular.element($window).bind("resize", function() {
        $scope.$apply();
      });
    }
  ])
  /* SERVICE -------------------------------------------------------------------*/

  /**
   * The main purpose of this service is to centralize the management of
   * the list of reports and routes that are shown into the left menu
   * It is also its work to keep track of the current state of these links
   */
  .service("platformReportsService", [
    "config",
    "$http",
    "$window",
    "$state",
    function(config, $http, $window, $state) {
      var _events = {};              // Will hold events & registered callbacks
      var _links = {};               // Will hold menu links
      var _currentLink;              // Will hold the current report link {}
      var _currentFolder;
      var _eventsHistory = {};
      var _currentState;
      var _currentParams;


      // SERVER ACCESS ------------------------------

      // Links from database
      function _fetchLinksfromJson() {
        var endpointUrl =
          config.BASE_URL +
          "/content/oktopus/ui/db/" +
          $window._linksPath +
          ".json";
        return $http.get(endpointUrl);
      }

      // reports from Pentaho
      function _fetchReports(folder) {
        var endpointUrl =
          config.BASE_URL +
          "api/repo/files/%3Apublic%3A" +
          folder +
          "/children?showHidden=false&filter=*%7CFILES&_=1499153387098";
        return $http.get(endpointUrl);
      }

      // Specific report from Pentaho
      function _getReport(reportPath) {
        var endpointUrl =
          config.BASE_URL +
          "api/repo/files/" +
          reportPath.replace(/\//g, ":") +
          "/properties";
        return $http.get(endpointUrl);
      }
      
      // Updates json on the server
      function _saveEnv() {
        var newEnv = _stripAppAttributes(_links);
        var url = config.BASE_URL + "plugin/oktopus/api/savejson";
        var conf = { headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8;"
        } };
        var data = $.param({
          paramjsonData: newEnv,
          paramlinksPath: $window._linksPath, //TODO: this is unsafe - store at service
          paramenv: $window._env
        });
        return $http.post(url, data, conf);
      }

      // RESPONSE HANDLERS ------------------------------

      // Links
      function _getLinkResponseHandler(response) {
        _links = _getSecuredLinks(response.data[$window._env]);
        _setCurrentLink();
        _trigger('links:loaded', _links);
      }
      function _getLinkErrorHandler(error) {}

      function _saveResponseHandler(response){
        _trigger('links:loaded', {});
        _fetchLinksfromJson().then(_getLinkResponseHandler, _getLinkErrorHandler);
      }
      function _saveErrorHandler(error){
        
      }
      
      // INIT AND PARSING ------------------------------

      function _getSecuredLinks( env ){
        Object.keys(env).forEach(function(folderKey){
          var folder = env[folderKey];
          folder.isAllowed = folder.roles.filter(function(role) {
            return oktopusRoles.indexOf(role) !== -1;
          }).length > 0;
        });

        return env;
      }

      // ROUTE INTERACTION ------------------------------
      function _onEnterRoute( transition ){

        _currentState = transition.to();
        _currentParams = transition.params();

        if(Object.keys(_links).length === 0){
          _saveResponseHandler()
        } else {
          _setCurrentLink();
        }
        _trigger('route:changed', transition);
      }

      function _setCurrentLink(){
        _currentLink = undefined;
        _currentFolder = undefined;
        Object.keys(_links).forEach(function(folderName){
          var folder = _links[folderName];
          if (!folder.isAllowed) return;

          folder.links.forEach(function( link ){
            if ( _isCurrent(link) ){
              _currentLink = link;
              _currentFolder = folder;
              _currentState.data = angular.extend(
                _currentState.data || {}, {title : _currentLink.title, link : link});
            }
          });
        });
        _trigger('link:changed', _currentLink);
      }

      // API  ---------------------------------------

      // triggers an event 
      function _trigger( eventName, arg ){
        var callbacks = _events[eventName];
        if (callbacks === undefined || 
            !Array.isArray(callbacks) || 
            callbacks.length === 0 ){
              _eventsHistory[eventName] = arg;
              return;
        }
        
        var len = callbacks.length;
        for(var x = 0 ; x < len ; x++ ) {
          var callback = callbacks[x];
          if(typeof callback === 'function') callback( arg )
        }
      }

      // registers a callback for a given event
      function _on(eventName, callback){

        // only accept array|string, function
        if( (typeof eventName !== 'string') && !Array.isArray(eventName) || typeof callback !== 'function'){
          return;
        }

        // eventName can be an array with eventNames
        if (Array.isArray(eventName)){
          eventName.forEach(function(evtn){ __register(evtn, callback) });
        } else {
          __register(eventName, callback)
        }

        // private function that registers the callbacks for event[s]
        function __register(_eventName, callback){
          if (_events[_eventName] === undefined) _events[_eventName] = [];
          
          if(!_events[_eventName].includes(callback)) {
            _events[_eventName].push(callback);
          }
  
          // If registration comes after trigger, checks for history
          if(_eventsHistory[_eventName] !== undefined) {
            _trigger(_eventName, _eventsHistory[_eventName]);
            delete _eventsHistory[_eventName];
          }
        }

      }

      function _getCurrentLink(){
        return _currentLink;
      }

      // Creates, updates or deletes link
      function _updateLink( newLink, shouldDelete, toFolder ){
        // for each folder on the env
        Object.keys(_links).forEach(function( folderName ){
          var folder = _links[folderName].links;
          var idx;
          
          // search for index
          for(var x = 0 ; x < folder.length; x++){
            if(folder[x].id === newLink.id){
               idx = x;
               break;
            }
          }

          // delete
          if(shouldDelete && idx !== undefined){
            folder.splice(idx, 1);

          // update
          }else if(idx !== undefined){
            folder[idx] = newLink

          // create
          }else if(idx === undefined && toFolder === folderName){
            folder.push(newLink);
          }
        });
        _saveEnv().then(function(res){
          _saveResponseHandler()
          $state.go( 
            shouldDelete ?  'home' : newLink.route, 
            shouldDelete ? {} : {id : newLink.id}
          );
        }, function(err){});
      }

      function _stripAppAttributes(){
        var newEnv = angular.copy(_links);
        Object.keys(newEnv).forEach(function( folderName ){
          delete newEnv[folderName].isAllowed;
          delete newEnv[folderName].key;
        });
        return angular.toJson(newEnv, 2);
      }

      function _isCurrent(link){
        
        return ( (link.id === _currentParams.id && link.id !== undefined)
        ||   (link.route === _currentState.name && _currentParams.id === undefined));
      }

      function _getFolder(folderName){
        return _links[folderName];
      }

      //TODO: tratar duplicacao de chave no no escopo da edicao
      function _updateFolder( folderName, newFolder, shouldDelete ){
        

        if(shouldDelete){
          delete _links[folderName];
        }else{
          delete _links[folderName];
          _links[folderName] = newFolder;
        }

        _saveEnv().then(function(res){
          _saveResponseHandler()
          $state.go('home');
        }, function(err){});
      }

      // PUBLIC -------------------------------------

      return {
        on : _on,
        getReport: _getReport,
        getFolder : _getFolder,
        isCurrent : _isCurrent,
        updateLink: _updateLink,
        updateLink : _updateLink,
        fetchReports: _fetchReports,
        onEnterRoute : _onEnterRoute,
        updateFolder : _updateFolder,
        getCurrentLink : _getCurrentLink,
        fetchLinksfromJson: _fetchLinksfromJson,
      };
    }
  ]);
