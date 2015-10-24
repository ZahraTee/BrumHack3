var i, imgs, token;
getToken();
imgs = $('img');
for (i = 0; i < imgs.length; i++) {
	console.log(imgs[i].src);
	getImageTagsFromURL(imgs[i].src);
}

function getToken()
{
	$.post("https://api.clarifai.com/v1/token/", {grant_type: "client_credentials", client_id: "0tibu3hLLX0yM_B1IZj_wfIyweqsjhn6w5XRS41O", client_secret: "uS8pDSrBUiR3ZucHLcIrDcU0MMYObopodjU0zmkD"}, function(result){
        console.log(result);
        token = result;
    });
}


function getImageTagsFromURL(image_url)
{
	$.ajax({
		url: 'https://api.clarifai.com/v1/tag/',
		type: 'POST',
		beforeSend: function (xhr) {
		    xhr.setRequestHeader('Authorization', 'bearer ' + token);
		},
		data: {url: image_url},
		success: function (object) { console.log(object.results.result.tag.classes[0])},
		error: function (err) { console.log("Couldn't get image tags!")},
		});

}