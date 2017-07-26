var pictureSource;
var destinationType;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady(){
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}

function onCamSuccess(imageURI){
	var image = document.getElementById("image");
	image.style = "display:block";
	image.src = imageURI;
}

function onPhotoURISuccess(imageURI){
	var largeImage = document.getElementById("largeImage");
	largeImage.style.display = "block";
	largeImage.src = imageURI;
}

function capturePhoto(){
	navigator.camera.getPicture(onCamSuccess, onFail, {quality: 50,
		 destinationType: Camera.DestinationType.FILE_URI });
}

function capturePhotoEdit(){
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 20, allowEdit: true, destinationType: destinationType.DATA_URL });
}

function getPhoto(source){
	navigator.camera.getPicture(onPhotoURISuccess, onFail, {quality: 50,
		destinationType: destinationType.FILE_URI,
		sourceType: source });
}

function onFail(message){
	alert("Failed because: " + message);
}
