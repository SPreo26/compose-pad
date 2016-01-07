(function () {
  "use strict";

  angular.module("app").controller("noteFilesCtrl", function($scope, $http) {

    $scope.setup = function() {
      $http.get("/api/v1/note_files.json").then(function(response) {
        $scope.noteFiles = response.data;
        for (var i=0; i<$scope.noteFiles.length; i++){
          $scope.noteFiles[i].selected = false;
        }
        // console.log($scope.noteFiles);
      },
        function(error){
          console.log(error.data)
        });

    }

    $scope.selectedFruits = function selectedFiles() {
    return filterFilter($scope.noteFiles, { selected: true });
    };


    $scope.renameFile = function(index){
      var id=$scope.noteFiles[index].id;
      var rename_data = {
        name: noteFiles[index].name,
        rename: true
      };
      $http.patch('api/vi/note_files', rename_data).then(function(response) {
        $scope.noteFiles = response.data;
        // console.log($scope.noteFiles);
      },
        function(error){
          console.log(error.data)
        });
    }

    // $scope.deleteShow = function(index){
    //   var id = $scope.shows[index].id;
    //   $http.delete('/api/v1/shows/'+id).then(
    //     function(response){
    //     console.log(response.data);
    //     $scope.shows.splice(index,1);
    //   },
    //     function(error){
    //     console.log(error.data);
    //   })
    // }

    // $scope.addShow = function(newDatetime, newArtistName, newVenue, newCity, newRegion, newCountry) {
    //   var newShow = {
    //     datetime: newDatetime,
    //     artsists: newArtistName,
    //     venue: newVenue,
    //     city: newCity,
    //     region: newRegion,
    //     country: newCountry
    //   };
    //   $http.post('/api/v1/shows.json', newShow).then(
    //     function(response){
    //     var showCallback = response.data;
    //     $scope.shows.push(showCallback);
    //   },
    //     function(error){
    //     console.log(error.data.errors);
    //   })
    // }


    // $scope.deleteFile = function(index){
    //   var id = $scope.shows[index].id;
    //   $http.delete('/api/v1/shows/'+id, $scope.shows[index]).then(
    //     function(response){
    //     console.log(response.data);
    //     $scope.shows.splice(index,1);
    //   },
    //     function(error){
    //     console.log(error.data);
    //   })
     
    // }
    
    window.$scope = $scope;
  
    });
  }());
