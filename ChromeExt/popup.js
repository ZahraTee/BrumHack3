
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

var topic_list = [];
var send_topic = function(){
  var blocked = $('#block_topic').val();
  console.log(blocked);
  topic_list.push(blocked);
  console.log(topic_list);
  document.body.appendChild(document.createTextNode(blocked + " "));
  var elem = document.getElementById("block_topic");
  elem.value = "";
};

chrome.runtime.sendMessage({greeting: topic_list}, function(response) {
  console.log(response.farewell);
});

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });
