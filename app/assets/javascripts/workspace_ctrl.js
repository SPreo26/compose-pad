(function () {
  "use strict";
  var app=angular.module("app");
  
  app.controller("workspaceCtrl", function($scope, $http) {

    $scope.setup = function() {
      var userId=document.body.attributes.userid;
      $http.get("/api/v1/note_files/open").then(function(response) {
        $scope.workspaceData = response.data;
        $scope.files = $scope.workspaceData.files;
        $scope.openFiles = $scope.files.filter($scope.ReturnOpenFiles)
        loadMidi();

        },
        function(error){
          console.log(error.data);
        }
      )
    }

    $scope.ReturnOpenFiles = function(files){
      if (files.file_open){
        return true
      }
      else {
        return false
      }
    }

    window.$scope = $scope;
  
    });

  // app.run([
  //   '$window',
  //   '$rootScope',
  //   function($window, $rootScope) {
  //     $window.addEventListener('beforeunload', function() {
  //       if(window.location.href.indexOf("my_files") > -1 && document.activeElement.id.indexOf("file_text")> -1 || true) {
  //         var index = parseInt(document.activeElement.id.slice("file_text") );
  //         $scope.renameFile(index);
  //       }
  //     });
  //   }
  // ]);

}());
