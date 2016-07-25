(function () {
  "use strict";
  var app=angular.module("app");
  
  // app.directive('creationDirective', function() {
  //   return true;
  // })

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
        $scope.loadNotesIntoMatrixModel();

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
      var files = $scope.files;
      var pitches = $scope.pitchesInWorkspace;
      var divisions = $scope.allDivisions;
      var i;
      for (i=0;i<files.length;i++){

        var file = files[i];
        file["matrix"]={};
        
        var j;
        for (j=0;j<pitches.length;j++){
          var pitch = pitches[j];
          file.matrix[pitch]={};

          var k;
          for (k=0;k<divisions.length;k++){
            var division = divisions[k];
            file.matrix[pitch][division]=$scope.thereIsNoteAtDivisionAndPitch(file,pitch,division)
          }
        }        
      }
    };

    $scope.thereIsNoteAtDivisionAndPitch = function(file,pitch,division){
      var notes = file.notes;
      var i;
      for (i=0;i<notes.length;i++){
        if (notes[i].start_index == division && notes[i].pitch == pitch) {
          return true;
        }
      }
      return false;
    };

    $scope.saveFile = function(){
      var file = $scope.findFileById(getActiveFileId());
      if (file) {
        $http.patch("/api/v1/note_files/"+file.id+"/save.json", file).then(
        function(response){
        console.log(response.data.message);
        
      },
        function(error){
        console.log(error.data.errors);
      })
      }
      else {
        console.log("File is null")
      }
    };



    $scope.addShow = function(newDatetime, newArtistName, newVenue, newCity, newRegion, newCountry) {
      var newShow = {
        datetime: newDatetime,
        artsists: newArtistName,
        venue: newVenue,
        city: newCity,
        region: newRegion,
        country: newCountry
      };
      
    }

    $scope.closeFile = function(){
      //var file =
      file.file_open = false;
      alert("AAA");
      //need to send to db that file is closed
    };

    $scope.findFileById = function(id){
      var i;
      for(i=0;i<$scope.files.length;i++){
        if ($scope.files[i]){
          return $scope.files[i];
        }
      };
    };

    // $scope.closeAllFiles = function(){
    //   var i;
    //   for(i=0; i<$scope.files.length; i++){
    //     $scope.files[i].file_open = false;
    //   }
    // };

    $scope.playFile = function(file){
      playFile(file);
    }

    // $scope.adjustMaxHeightToWindowHeight = function(elem){
    //   matrix_loaded = true;
    //   adjustMaxHeightToWindowHeight(elem);
    // }

    // $scope.alertMe = function(){
    //   alert("yo");
    // }

    window.$scope = $scope;
  
    });

}());
