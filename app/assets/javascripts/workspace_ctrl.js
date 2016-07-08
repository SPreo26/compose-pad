(function () {
  "use strict";
  var app=angular.module("app");
  
  app.controller("workspaceCtrl", function($scope, $http) {

    $scope.setup = function() {
      var userId=document.body.attributes.userid;
      $http.get("/api/v1/note_files/open").then(function(response) {
        $scope.workspaceData = response.data;
        $scope.files = $scope.workspaceData.files;
        // $scope.openFiles = $scope.files.filter($scope.returnOpenFiles)
        $scope.allBeatCells = $scope.workspaceData.beats;
        $scope.allDivisions = $scope.workspaceData.divisions;
        $scope.pitchesInWorkspace = $scope.workspaceData.pitches_in_workspace;
        $scope.timeConstants=$scope.workspaceData.time_constants;
        $scope.loadNotesIntoMatrixModel

        loadMidi();

        },
        function(error){
          console.log(error.data);
        }
      )
    };

    // $scope.returnOpenFiles = function(files){
    //   if (files.file_open){
    //     return true
    //   }
    //   else {
    //     return false
    //   }
    // }
    $scope.loadNotesIntoMatrixModel = function() {
    };

    $scope.closeFile = function(file){
      file.file_open = false;
      return;
    };

    $scope.thereIsNoteAtDivisionAndPitch = function(file,division,pitch){
      var notes = file.notes;
      var i;
      for (i=0;i<notes.length; i++){
        if (notes[i].start_index == division && notes[i].pitch == pitch) {
          return true;
        }
      }
      return false;
    };

    window.$scope = $scope;
  
    });

}());
