(function () {
  "use strict";
  var app=angular.module("app");
  
  app.controller("workspaceCtrl", function($scope, $http) {

    $scope.setup = function() {
      var userId=document.body.attributes.userid;
      $http.get("/api/v1/note_files/open").then(function(response) {
        $scope.workspaceData = response.data;
        console.log($scope.workspaceData)
        $scope.openFiles = $scope.workspaceData.files
        loadMidi();

        },
        function(error){
          console.log(error.data);
        }
      )
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
