var clipboard = new Clipboard('.copybtn');
    clipboard.on('success', function(e) {
        alert("Text copied");
    });
    clipboard.on('error', function(e) {
        alert("Text not copied");
    });