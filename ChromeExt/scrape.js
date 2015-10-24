var i, imgs, token;
getToken();


function getToken()
{
	$.post("https://api.clarifai.com/v1/token/", {grant_type: "client_credentials", client_id: "0tibu3hLLX0yM_B1IZj_wfIyweqsjhn6w5XRS41O", client_secret: "uS8pDSrBUiR3ZucHLcIrDcU0MMYObopodjU0zmkD"}, function(result){
        console.log(result);
        token = result;

        imgs = $('img');
	for (i = 0; i < imgs.length; i++) {
	//console.log(imgs[i].src);
	getImageTagsFromURL(imgs[i].src);
}
    });
}

function getImageTagsFromURL(image_url)
{
	if (image_url == null || image_url == "") { return; }
	$.ajax({
		url: 'https://api.clarifai.com/v1/tag/',
		type: 'POST',
		beforeSend: function (xhr) {
		    xhr.setRequestHeader('Authorization', 'bearer ' + "3g69QuTW94KoJnWHEkzNmqtvmKMYOQ");
		},
		data: {url: image_url},
		success: function (object) { console.log(object.results[0].result.tag.classes[0])},
		error: function (err) { console.log("Couldn't get image tags! " + image_url)},
		});

}