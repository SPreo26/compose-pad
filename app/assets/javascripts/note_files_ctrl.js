(function () {
  "use strict";
  var app=angular.module("app");
  app.directive(
    "repeatComplete",
    function( $rootScope ) {
        var uuid = 0;
       
        function compile( tElement, tAttributes ) {
            
          var id = ++uuid;    
          tElement.attr( "repeat-complete-id", id );
          var completeExpression = tAttributes.repeatComplete;
          var parent = tElement.parent();
          var parentScope = ( parent.scope() || $rootScope );

          var unbindWatcher = parentScope.$watch(
            function() {
              var lastItem = parent.children( "*[ repeat-complete-id = '" + id + "' ]:last" );
                
              if ( ! lastItem.length ) {
                return;
              }
              
              var itemScope = lastItem.scope();
              
              if ( itemScope.$last ) {
                itemScope.$eval( completeExpression );
              }
            }
          );
        }
        return({
            compile: compile,
            priority: 1001,
            restrict: "A"
        });
    }
  );

  app.controller("noteFilesCtrl", function($scope, $http) {

    $scope.setup = function() {
      var userId=document.body.attributes.userid;
      $http.get("/api/v1/note_files.json?user_id="+userId).then(function(response) {
        $scope.noteFiles = response.data;
        $scope.deselectAllFiles($scope.noteFiles)
          console.log($scope.noteFiles)
        },
        function(error){
          console.log(error.data);
        }
      )
    }

    $scope.deselectAllFiles = function() {
      for(var i=0; i<$scope.noteFiles.length; i++) {
        $scope.noteFiles[i].selected = false
      }
    }

    $scope.selectedFileIds = function() {
      var selectedFileIds = [];
      for(var i=0; i<$scope.noteFiles.length; i++) {
        if ($scope.noteFiles[i].selected){
          selectedFileIds.push($scope.noteFiles[i].id)
        }
      }
      return selectedFileIds  ;
    };

    $scope.renameFile = function(index){
      // if (index){
        var id=$scope.noteFiles[index].id;
        var renameData = {
          name: $scope.noteFiles[index].name,
          rename: true
        };
      // } else {
          // var id = 1;
          // var rename_data = {
          //   name: "test", 
          //   rename: true
          // };
          // console.log("FASFA");
      // };
      $http.patch('/api/v1/note_files/'+id, renameData).then(function(response) {
        $scope.renamedFile = response.data;
        console.log('Renamed');
        console.log($scope.renamedFile);
        $scope.noteFiles[index].renameJustFinished = true;
        setTimeout(function(){
          $scope.$apply(function(){
            $scope.noteFiles[index].renameJustFinished = false;
            });
          },1050)        
      },
        function(error){
          console.log(error.data)
          $scope.noteFiles[index].renameError = true;
          setTimeout(function(){
          $scope.noteFiles[index].renameError = false;
            setTimeout(function(){
              $scope.setup();
            },1050)
        },1050);
        });
    }

    $scope.deleteFiles = function() {
      var deleteData = {
        file_ids: $scope.selectedFileIds()
      };

      $http.patch('/api/v1/note_files/delete_files/', deleteData).then(function(response) {
        $scope.DeletedFiles = response.data;
        console.log('Deleted');
        console.log($scope.DeletedFiles);
        $scope.setup();
      },
        function(error){
          console.log(error.data)
        });
    }

    $scope.fileLineFormatting = function(numFiles) {
        for (var i=0; i<numFiles; i++){
          var id='file_line'+ i;
          //abbrevIfTextOverflow(id, i);
          
          addTopOrBottomClassToNewspaperFile(id, 'filesNewspaper', i + 1, numFiles);
        }
    }


    $scope.unabbrevIfAbbrev = function(elem,index){
      // unabbrevIfAbbrev(elem,index);
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
