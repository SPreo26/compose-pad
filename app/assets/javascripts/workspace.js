// function hexCode(d) { return d.charCodeAt(0).toString(16); }

window.adjustMatrixMaxHeightToWindowHeight =function(adjustment){
    if (matrix_div_created){
      var bodyPaddingAndMarginTop = parseInt($(document.body).css("padding-top")+$(document.body).css("margin-top"));
      var offsetTop = Math.max(bodyPaddingAndMarginTop,$('.matrix-table-container').offset().top);
      var offsetBottom = $('.matrix-labels-controls-container').outerHeight(true) - $('.matrix-table-container').outerHeight(true)-adjustment;
      var maxHeight = $(document).height() - offsetTop - offsetBottom;
      $('.matrix-table-container').css('max-height',maxHeight);
    }
  }

  $(window).resize(function() {
    adjustMatrixMaxHeightToWindowHeight(0);
  });