  $('.carousel').carousel({
      interval: false //changes the speed
      pause: true
  })
  $(document).on('mouseleave', '.carousel', function() {
    (this).carousel('pause');
  });