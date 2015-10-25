var i, imgs, token;
getToken();

function getToken()
{
	$.post("https://api.clarifai.com/v1/token/", {grant_type: "client_credentials", client_id: "0tibu3hLLX0yM_B1IZj_wfIyweqsjhn6w5XRS41O", client_secret: "uS8pDSrBUiR3ZucHLcIrDcU0MMYObopodjU0zmkD"}, function(result){
        console.log(result);
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
		    xhr.setRequestHeader('Authorization', 'bearer ' + "3g69QuTW94KoJnWHEkzNmqtvmKMYOQ");
		},
		data: {url: image_url},
		success: function (object) {
			for (i = 0; i < object.results.length; i++) { 
				
					var keywords = object.results[i].result.tag.classes;
					var alttext = ""
					for (j = 0; j < keywords.length; j++) {
						alttext = alttext + " " + keywords[j];
					}
					$(image_element).attr("alt", "Clarifai Image:" + alttext);
					$(image_element).after('<div class="overlay">Hello</div>');
					$("img").each(function(index) {
		$(this).next(".overlay").andSelf().wrapAll("<div class='ce-container' />")
	});
					//$(image_element).wrap('<div class="ce-container"></div>');

				}
			},
		error: function (err) { return "Unreadable image."},
		});
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}