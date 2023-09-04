chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getClipboard") {
        navigator.clipboard.readText().then(function(text) {
            sendResponse({ clipboardData: text });
        });
        return true;
    }
});
