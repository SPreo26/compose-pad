(function () {
  "use strict";

  angular.module("app").controller("noteFilesCtrl", function($scope, $http) {

    $scope.setup = function() {
      $http.get("/api/v1/note_files.json").then(function(response) {
        $scope.noteFiles = response.data;
        console.log($scope.noteFiles);
      });

    }

    // $scope.deleteShow = function(index){
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


    // $scope.deleteShow = function(index){
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
