$("#favorite-btn").click(function(event) {
    event.preventDefault();
    $(".modal").addClass("is-active"); 
  });
   
   
  $(".modal-close").click(function() {
   
     $(".modal").removeClass("is-active");
   
  });