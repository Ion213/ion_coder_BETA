// GENERATED CODE BOX AND PREVIEW BOX
let generatedCode = "";

$(document).ready(function () {
    // Initialize Highlight.js
    hljs.highlightAll();
    

    $("#sendButton").click(function () {

        let prompt = $("#userInput").val().trim();
        if (prompt === "") return;
        let model = $('#modelSelect').val();
        if (!model) {
            Swal.fire({
                title: 'Error',
                text: 'No AI model available. Please add a model in the GGUF directory.',
                icon: 'error',
                timer: 2000,
                timerProgressBar: true
            });
            return; // Add this to stop further code execution if no model is selected
        }

        $(".nav-link").css({
            "pointer-events": "none",
            "opacity": "0.5"
        });
        // Disable send button
        let sendButton = $("#sendButton");
        sendButton.prop("disabled", true);
        sendButton.addClass("bg-warning");  // Change to red
        //sendButton.text("Generating ⏳ ");
        sendButton.html(' Generating <i class="fa-solid fa-hourglass-half"></i> ');

        //disable refresh iframe button
        let refresh_button=$('#refresh');
        refresh_button.prop("disabled", true);
        refresh_button.css("background-color", "#ff0000");  // Change to red

        //disable restore code button
        let restore_button=$('#restore');
        restore_button.prop("disabled", true);
        restore_button.css("background-color", "#ff0000");  // Change to red

        //disable copy button
        let copy_button=$('#copyButton');
        copy_button.prop("disabled", true);
        copy_button.css("background-color", "#ff0000");  // Change to red

        //codebox not editable
        $("#codeBox").attr("contenteditable", "false");

        // Make iframe unclickable
        let iframe = $("#preview");
        iframe.css("pointer-events", "none"); 

        // SEND THE CHAT TO AI
        let eventSource = new EventSource(`/generate_html?prompt=${encodeURIComponent(prompt)}&model=${encodeURIComponent(model)}`);

        $("#codeBox").text(""); // Clear previous output
        $("#preview").contents().find("html").html(""); // Clear preview
        generatedCode=""

        //stream data response
        eventSource.onmessage = function (event) {
            let chunk = event.data;
            // Clean the chunk
            chunk = chunk.replace(/^html\s*/, ""); // Remove "html" at the beginning
            chunk = chunk.replace(/^```\s*/, ""); // Remove ``` at the beginning
            chunk = chunk.replace(/<\|EOT\|>$/, ""); // Remove <|EOT|> at the end

           
            // Append the cleaned chunk to the generated codebox
            $('#codeBox').append(chunk);
            generatedCode += chunk;

            //fromat the code
            let formattedCode = prettier.format(generatedCode, {
                parser: "html",
                plugins: window.prettierPlugins,
            });

            //update codebox with formatted code 
            $("#codeBox").text(formattedCode);
            //update codebox with syntax highlighter
            hljs.highlightElement(document.getElementById("codeBox"));
            // Update the preview iframe
            $("#preview").contents().find("html").html(generatedCode);

        };

        eventSource.onerror = function () {
            
            $(".nav-link").css({
                "pointer-events": "auto",
                "opacity": "1"
            });

            // Re-enable the all buttons and re-enaable the editable codebox and clickable iframe
            sendButton.prop("disabled", false);
            refresh_button.prop("disabled", false);
            restore_button.prop("disabled", false);
            copy_button.prop("disabled", false);
            sendButton.removeClass("bg-warning"); 
            refresh_button.css({"background-color": "", "color": ""});
            restore_button.css({"background-color": "", "color": ""});
            copy_button.css({"background-color": "", "color": "" });
            //sendButton.text("Send ✈️");
            sendButton.html(' Send <i class="fa-regular fa-paper-plane"></i> ');
            $("#codeBox").attr("contenteditable", "true");
            iframe.css("pointer-events", "auto"); // Make iframe clickable again
            eventSource.close();

        };

    });
});





