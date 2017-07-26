$(function (){
	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
    function showPosition(position) {
	    var lat = position.coords.latitude;
	    var lang = position.coords.longitude;
	   }
	
	$('[type=submit]').on('click', function (e) {
		
		if($('#summary').val().length<1 || $('#location').val().length<1 || $('#urgency').val().length<1){
			alert("please complete all fields");
		}
		else{
		    imageList.addImage(
			new Date().toUTCString(),
			document.getElementById("image").src,
			$('#summary').val(),
			$('#location').val(),
			$('#urgency').val(),
			lat,
			lang
		);  
		$('input:text').val('');
		return false;
		}		
	});

	$('#images').on('click', '.delete', function (e) {
		imageList.deleteImage(parseInt($(this).parent().find('.key').text()));
		return false;
	});
	
	$('#images').on('click', '.update', function (e) {
		var timestamp = $(this).parent().find('.timestamp').text();
		var image = $(this).parent().find('.image').text(); 
		var summary = $(this).parent().find('.summary').text(); 
		var location = $(this).parent().find('.location').text();
		var urgency = $(this).parent().find('.urgency').text();
		var lat = $(this).parent().find('.lat').text();
		var lng = $(this).parent().find('.lng').text();
		var key = parseInt($(this).parent().find('.key').text());
		imageList.updateImage(timestamp,image,summary,location,urgency,lat,lng,key);
		return false;
	});

	imageList.open();

});

imageList = {};

imageList.open = function() {
	this.list = { };
	if (localStorage.imageList) {
		 this.list = JSON.parse(localStorage.imageList);
	} 
	imageList.getAllImages();
};		

imageList.addImage = function(timestamp,image,summary,location,urgency,lat,lng) {
	this.list[new Date().getTime()] = {
		'timestamp':timestamp,
		'image':image,
		'summary':summary,
		'location':location,
		'urgency':urgency,
		'lat':lat,
		'lng':lng
		};
	localStorage.imageList = JSON.stringify(this.list);
	this.getAllImages();
};

imageList.getAllImages = function() {
	$('#images').html('');
	var myLatlng = new google.maps.LatLng(lat,lang);
	var mapOptions = {zoom: 11,center: myLatlng};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	for (var key in this.list) {
		renderImage(key, this.list[key]);
		addPoints(key, this.list[key]);
	}
};

imageList.deleteImage = function(id) { 
	delete this.list[id];
	localStorage.imageList = JSON.stringify(this.list);
	this.getAllImages();
};

imageList.updateImage = function(timestamp,image,summary,location,urgency,lat,lng,id) {
	var theimage = this.list[id].image; //to keep the same image while updating
	this.list[id] = {
		'timestamp':timestamp,
		'image':theimage,
		'summary':summary,
		'location':location,
		'urgency':urgency,
		'lat':this.list[id].lat,
		'lng':this.list[id].lng
	};
	localStorage.imageList = JSON.stringify(this.list);
	this.getAllImages();
};		
var map;
var infoWindow = new google.maps.InfoWindow;

function onSuccess(position) {
lat=position.coords.latitude;
lang=position.coords.longitude;
var myLatlng = new google.maps.LatLng(lat,lang);
var mapOptions = {zoom: 11,center: myLatlng};
//map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
//var marker = new google.maps.Marker({position: myLatlng,map: map});

imageList.getAllImages();
}
function onError(error) {
alert('code: ' + error.code + '\n' +
'message: ' + error.message + '\n');
}
var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 3000 });
google.maps.event.addDomListener(window, 'load', onSuccess);
function showAll(){
	imageList.getAllImages();
}
function renderImage(key,value) {
	var li = '<span class="image" contenteditable="false"><img src=' + value.image + ' alt="photo" height="120" width="80"></span><br />';
	li += '<li><span class="summary" contenteditable="true">'+value.summary+'</span><br/>';
	li += '<span class="location" contenteditable="true">'+value.location+'</span><br />';
	li += '<span class="urgency" contenteditable="true">'+value.urgency+'</span><br />';
	//li += '<span class="lat" contenteditable="true">'+value.lat+'</span>&nbsp;';
	//li += '<span class="lng" contenteditable="true">'+value.lng+'</span><br />';
	li += '<span class="timestamp" contenteditable="false">'+value.timestamp+'</span><br />';

	li += '<a href="#" class="update">[Update]</a> &nbsp; '; 
	li += '<a href="#" class="delete">[Delete]</a><span class="key">'+key+'</span></li>';
	$('#images').append(li);
}

function addPoints(key,value){
	var latLng = new google.maps.LatLng(value.lat,value.lng);
	
    var infowincontent = document.createElement('div');
	var strong = document.createElement('strong');
	strong.textContent = value.summary;
	infowincontent.appendChild(strong);
	infowincontent.appendChild(document.createElement('br'));
  	
  	var text = document.createElement('text');
    text.textContent = value.location;
    infowincontent.appendChild(text);
    
    infowincontent.appendChild(document.createElement('br'));

	var text = document.createElement('text');
    text.textContent = value.timestamp;
    infowincontent.appendChild(text);
              
    
  	var picture = {
        //url: value.image,
        //url: 'http://www.scottish-at-heart.com/images/lion_rampant2.jpg',
        scaledSize: new google.maps.Size(30, 50),     
    };
  	var marker = new google.maps.Marker({
    	position: latLng,
    	map: map,
    	label: value.urgency,
  	});
	
  	marker.addListener('click', function(){
  		infoWindow.setContent(infowincontent);
  		infoWindow.open(map, marker);
  	});
}



