(function () {
  "use strict";

  var app=angular.module("app", [])
  .directive('myRepeatDirective', function() {
    return function(scope, element, attrs) {
      if (scope.$last){
      scope.$emit('LastElem');
      }
    };
  })

  // .directive('myMainDirective', function() {
  //   return function(scope, element, attrs) {

  //   });
  //   };
  // });

  app.controller("noteFilesCtrl", function($scope, $http) {

    $scope.setup = function() {
      $http.get("/api/v1/note_files.json").then(function(response) {
        $scope.noteFiles = response.data;
        $scope.$on('LastElem', function(event){
          angular.element(document).ready(function() {
              window.onload= console.log(document.getElementById('file_line0'))
              // addTopOrBottomClassesToNewspaper($scope.noteFiles.length);

          });  
        });
      },
        function(error){
          console.log(error.data)
        })

    }

    $scope.selectedFiles = function () {
    return filterFilter($scope.noteFiles, { selected: true });
    };


    $scope.renameFile = function(index){
      var id=$scope.noteFiles[index].id;
      var rename_data = {
        // name: $scope.noteFiles[index].name,
        rename: true
      };
      $http.patch('/api/v1/note_files/'+id, rename_data).then(function(response) {
        $scope.RenamedFiles = response.data;
        console.log('Renamed');
        console.log($scope.noteFiles);
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

    $scope.addTopOrBottomClassesToNewspaper = function(numFiles) {
        for (var i=0; i<numFiles; i++){
        addTopOrBottomClassToNewspaperFile('file_line'+ i, 'filesNewspaper', i + 1, numFiles);
        }
    }


    $scope.unabbrevIfAbbrev = function(a,b){
      unabbrevIfAbbrev(a,b);
    }

    // $scope.$on('$viewContentLoaded', function(){
    //   alert("hi!");
    //   addTopOrBottomClassesToNewspaper($scope.noteFiles.length);
    // });

    window.$scope = $scope;
  
    });

  }());
