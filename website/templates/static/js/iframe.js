
$(document).ready(function () {
    //view iframe button
    const iframe = $('#preview')[0]; // Get the iframe DOM element

    // Function to open iframe content in full screen
    $('#fullscreenButton').on('click', function () {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Firefox
            iframe.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE/Edge
            iframe.msRequestFullscreen();
        }
    });

    //refresh iframe
    $("#refresh").on('click', function () {
       //fromat the code
        $("#preview").contents().find("html").html(generatedCode);

    })


});