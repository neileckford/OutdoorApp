function onSuccess(position) {
var element = document.getElementById('geolocation');
element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
'Longitude: ' + position.coords.longitude + '<br />' +
'<hr />' + element.innerHTML;
var lat=position.coords.latitude;
var lang=position.coords.longitude;
var myLatlng = new google.maps.LatLng(lat,lang);
var mapOptions = {zoom: 4,center: myLatlng}
var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
var marker = new google.maps.Marker({position: myLatlng,map: map});
}
function onError(error) {
alert('code: ' + error.code + '\n' +
'message: ' + error.message + '\n');
}
var watchID = navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 3000 });
google.maps.event.addDomListener(window, 'load', onSuccess);