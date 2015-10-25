var i, imgs, token;

alt_tag_mode = true;
tag_helper_mode = true;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    if (request.alt_tag_mode){
      alt_tag_mode = true;
  	}
  	else{
  		alt_tag_mode = false;
  	}
  	if (request.tag_helper_mode){
      tag_helper_mode = true;
  	}
  	else{
  		tag_helper_mode = false;
  	}

 });

getToken();

function getToken()
{
	$.post("https://api.clarifai.com/v1/token/", {grant_type: "client_credentials", client_id: "0tibu3hLLX0yM_B1IZj_wfIyweqsjhn6w5XRS41O", client_secret: "uS8pDSrBUiR3ZucHLcIrDcU0MMYObopodjU0zmkD"}, function(result){
        token = result;
        imgs = $('img');
		for (i = 0; i < imgs.length; i++) {
			var alttext = getImageTagsFromURL(imgs[i], imgs[i].src);
		}
	});
}

function getImageTagsFromURL(image_element,image_url)
{
	if (image_url == null || image_url == "") { return; }
	var pic_formats = ["jpg", "jpeg", "png", "gif", "bmp", "tiff"];
	var count;
	for (var i in pic_formats) { if (endsWith(image_url, pic_formats[i])) count++; }
	if (count == 0) return;

	$.ajax({
		url: 'https://api.clarifai.com/v1/tag/',
		type: 'POST',
		beforeSend: function (xhr) {
		    xhr.setRequestHeader('Authorization', 'bearer ' + "kEIZsCcn6Uh1ouFACPka8HPXbKRIqY");
		},
		data: {url: image_url},
		success: function (object) {
			for (i = 0; i < object.results.length; i++) { 
				var docid = object.results[i].docid;
				var keywords = object.results[i].result.tag.classes;
				var alttext = ""
				for (j = 0; j < keywords.length; j++) {
					alttext = alttext + " " + keywords[j];
				}
				if (alt_tag_mode){
					$(image_element).attr("alt", "Clarifai Image:" + alttext);
				}
				if (tag_helper_mode){
					$(image_element).after('<div class="overlay">' + createWordButtons(docid, keywords) + '</div>');
				wordbuttons = $(".word-btn-"+docid );
				for (k=0; k < wordbuttons.length; k++) {
					wordbuttons[k].addEventListener("click", function() {
						tag = $(this).parent().text().substring(1);
						console.log(docid + " " + tag);
						removeTags(docid, tag);
						$(this).parent().remove();
					});
				}
				$(image_element).each(function(index) {
					$(this).next(".overlay").andSelf().wrapAll("<div class='ce-container'/>")
				});
				}
				
			}
		},
		error: function (err) { return "Unreadable image."},
	});
}

function removeTags(docid, tag)
{
	$.ajax({
		url: 'https://api.clarifai.com/v1/feedback/',
		type: 'POST',
		beforeSend: function (xhr) {
		    xhr.setRequestHeader('Authorization', 'bearer ' + "kEIZsCcn6Uh1ouFACPka8HPXbKRIqY");
		},
		data: {docids: docid, remove_tags: tag},
		success: function (object) {
			console.log(tag);
		},
		error: function (err) { return "Could not remove tag."},
	});
}

function createWordButtons(docid, word_list)
{
	button_html = '<ul class="word-button-list">'
	for (i=0; i < word_list.length; i++) {
		button_html += '<li class="word-button"><button class="word-btn-' + docid + '">x</button>' + word_list[i] + '</li>'
	}
	button_html += '</ul>'
	return button_html;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
    console.log(response.farewell);
  });
});
