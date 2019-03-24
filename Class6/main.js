$(document).ready(function(){
    $('.carousel').carousel({
        interval:   500, 
        keyboard:   true
    });

    $('.carousel-pauser').click(function(){
        $('.carousel').carousel('pause');
    });

    $('.carousel').on('slid.bs.carousel', function(event){
        console.log(event);
    });

    $('.modal-popper').click(function(){
        $('.modal').modal( {backdrop: 'static'} );
    });
    
});