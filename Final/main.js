$(document).ready(function(){
    $('.carousel').carousel({ 
        keyboard:   true
    });

    $('.carousel-pauser').click(function(){
        $('.carousel').carousel('pause');
    });

    $('.carousel').on('slid.bs.carousel', function(event){
        console.log(event);
    });
});