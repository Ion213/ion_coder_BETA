
$(document).ready(function () {
    //view code button
    const codebox = $('#codeBox')[0]; // Get the iframe DOM element

    // Function to open iframe content in full screen
    $('#showCode').on('click', function () {
        if (codebox.requestFullscreen) {
            codebox.requestFullscreen();
        } else if (iframe.mozRequestFullScreen) { // Firefox
            codebox.mozRequestFullScreen();
        } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari, and Opera
            codebox.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE/Edge
            codebox.msRequestFullscreen();
        }
    });



//EDITABLE CODEBOX
    // Make the code box editable
    $("#codeBox").attr("contenteditable", "true");

    // Listen for input changes and update the preview iframe
    $("#codeBox").on("input", function () {
        let editedCode = $(this).text();
        $("#preview").contents().find("html").html(editedCode);
    });



//USE TAB
    $("#codeBox").on("keydown", function (e) {
        if (e.key === "Tab") {
            e.preventDefault(); // Prevent default tab behavior
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let tabNode = document.createTextNode("\t");

            range.insertNode(tabNode);
            range.setStartAfter(tabNode);
            range.setEndAfter(tabNode);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });


//copy to clipboard
    // Handle copy button click event
    $('#copyButton').click(function () {
        var codeContent = $('#codeBox').text();
        
        // Create a temporary textarea to copy the code
        var $temp = $('<textarea>');
        $('body').append($temp);
        $temp.val(codeContent).select();
        document.execCommand('copy');
        $temp.remove();

        // SweetAlert notification on success
        Swal.fire({
            title: 'Copied!',
            text: 'The HTML code has been copied to your clipboard.',
            icon: 'success',
            timer: 2000,
            timerProgressBar: true
        });
    });


    //restore code
    $("#restore").on('click', function () {
        //fromat the code
        let reformat = prettier.format(generatedCode, {
            parser: "html",
            plugins: window.prettierPlugins,
        });
        $("#codeBox").text(reformat);
        //update codebox with syntax highlighter
        hljs.highlightElement(document.getElementById("codeBox"));
        $("#preview").contents().find("html").html(generatedCode);

    })


});