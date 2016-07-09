  var matrix_div_created = false;
  //matrix_loaded set to true in script inside ng-repeat for file in files - need to make sure the div holding the matrix is created

  function saveFile() {
    getActiveForm().submit();
  }

  function closeFile() {
    formAction = getActiveForm().getAttribute("action");

    id = formAction.substring(formAction.lastIndexOf("/")+1,formAction.length);

    window.location.href = "/note_files/" + id + "/close_file";
  }

  function getActiveForm() {
    var activePane = document.getElementsByClassName("tab-pane  active")[0];

    var form = activePane.getElementsByTagName("ng-form")[0];

    return form;
  }

  window.adjustMatrixMaxHeightToWindowHeight =function(){
    if (matrix_div_created){
      var bodyPaddingAndMarginTop = parseInt($(document.body).css("padding-top")+$(document.body).css("margin-top"));
      var offsetTop = Math.max(bodyPaddingAndMarginTop,$('.matrix-table-container').offset().top);
      var offsetBottom = $('.matrix-labels-controls-container').outerHeight(true) - $('.matrix-table-container').outerHeight(true);
      var maxHeight = $(document).height() - offsetTop - offsetBottom;
      $('.matrix-table-container').css('max-height',maxHeight);
    }
  }

  $(window).resize(function() {
    adjustMatrixMaxHeightToWindowHeight();
  });