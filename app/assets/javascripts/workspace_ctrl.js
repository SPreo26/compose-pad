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
        $scope.d3Matrix={};

        },
        function(error){
          console.log(error.data);
        }
      )
    };

    $scope.adjustMatrixMaxHeightToWindowHeight =function() {
      matrix_div_created = true;
      adjustMatrixMaxHeightToWindowHeight();
    }

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
            file.matrix[pitch][division]=$scope.thereIsOriginallyNoteAtDivisionAndPitch(file,pitch,division)
          }
        }        
      }
    };

    $scope.thereIsOriginallyNoteAtDivisionAndPitch = function(file,pitch,division){
      var notes = file.notes;
      var i;
      for (i=0;i<notes.length;i++){
        if (notes[i].start_index == division && notes[i].pitch == pitch) {
          return true;
        }
      }
      return false;
    };

    // $scope.AAA = function(){
    //    console.log("wow");
    // };

    $scope.drawD3Notes = function(file){

      for (var pitch in file.matrix){
        for (var division in file.matrix[pitch]) {

          if(file.matrix[pitch][division]) {

            $scope.drawD3Note(file,pitch,division,true);
          }
        }
      }
    };                               

    $scope.toggleD3Note = function(file,pitch,division){
      if (file.matrix[pitch][division]){
        file.matrix[pitch][division] = false;
        $scope.eraseD3Note(file,pitch,division);
      }
      else {
        if($scope.onlyOnePitchPerStartIndex(file.matrix,pitch,division)){
          file.matrix[pitch][division] = true;
          var noteOK=true;
        }
        else {
          var noteOK=false;
        }
      $scope.drawD3Note(file,pitch,division,noteOK);
      }
    };

    $scope.drawD3Note = function(file,pitch,division,noteOK){
      var id = 'file'+file.id+'note'+pitch+'-'+division;
      var svgDivJs = document.getElementById(id);
      // var cellWidth = svgDivJs.parentElement.parentElement.offsetWidth;
      // var cellHeight = svgDivJs.parentElement.parentElement.offsetHeight;
      // console.log(cellHeight)
      // console.log(cellWidth)
      var noteWidth = "100%";
      var noteHeight = 15;

      var svgDivD3 = d3.select("[id='"+id+"']");
      var svg = svgDivD3.append("svg")
        .attr("width", noteWidth)
        .attr("height", noteHeight)
        .style("max-width","92%")
        .style("max-height","92%")
        .attr("class","note-svg");
      var g = svg.append("g");
      
      if (noteOK){
        var rectFillColor = "#2b7ce5";
      }
      else {
        var rectFillColor = "#c62605";
      } 
      var rect = g.append("rect");
      rect.attr("width",noteWidth)
        .attr("height",noteHeight)
        .attr("fill",rectFillColor)
        .attr("rx","4px")
        .attr("ry","4px")

      var text = g.append("text")
        .text(pitch)
        .attr("font-size","9.5px")
        .attr("fill","#373737")
        // .attr("text-anchor","middle")
        .attr("x",3)
        .style("dominant-baseline","central")
        .attr("y",noteHeight/2);
      
      if (!noteOK){
        setTimeout(
          function(){
            $scope.eraseD3Note(file,pitch,division)
          },
        150
        )
      }
    }

    $scope.eraseD3Note = function(file,pitch,division){
      var id = 'file'+file.id+'note'+pitch+'-'+division;
      d3.select("[id='"+id+"']").selectAll("svg").remove();
    }

    $scope.onlyOnePitchPerStartIndex = function(matrix,pitch,division){
      // var noteBox = document.getElementById(event.target.id);
        var another_pitch;
        for (another_pitch in matrix){
          if (another_pitch!=pitch && matrix[another_pitch][division]){
            return false;
            break;
          }
        }
      return true;
    }

    $scope.saveFile = function(){
      var file = $scope.findFileById(getActiveFileId());
      if (file) {
        $http.patch("/api/v1/note_files/"+file.id+"/save.json", file).then(
        function(response){
        alert(response.data.message);
        
      },
        function(error){
        console.log(error.data.errors);
      })
      }
      else {
        console.log("File is null")
      }
    };

    $scope.closeFile = function(){
      var file = $scope.findFileById(getActiveFileId());
      if (file) {
        $http.patch("/api/v1/note_files/"+file.id+"/close.json", file).then(
        function(response){
        console.log(response.data.message);
        file.file_open = false;
        
        var all_files_closed = true;
        for (var i=0; i<$scope.files.length; i++){
          if ($scope.files[i].file_open){
            all_files_closed = false;
          }
        }

        if (all_files_closed){
          window.location.href = '/note_files/close_all'
        }
      },
        function(error){
        console.log(error.data.errors);
      })
      }
      else {
        console.log("File is null")
      }
    };

    $scope.findFileById = function(id){
      var i;
      for(i=0;i<$scope.files.length;i++){
        if ($scope.files[i].id == id){
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
      playFile(file, $scope.allDivisions, $scope.workspaceData.octave_tones );
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
