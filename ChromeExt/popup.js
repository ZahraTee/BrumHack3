
alt_tag_mode = true;
tag_helper_mode = true;

$('alt-tag-mode').on("click", function(){
	alt_tag_mode = !alt_tag_mode;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {alt-tag-mode: alt_tag_mode}, function(response) {
	    console.log(alt_tag_mode);
	  });
	});
})

$('tag-helper-mode').on("click", function(){
	tag_helper_mode = !tag_helper_mode;
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  chrome.tabs.sendMessage(tabs[0].id, {tag-helper-mode: tag_helper_mode}, function(response) {
	    console.log(tag_helper_mode);
	  });
	});
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });
