// events
$(function () {
	$('[type=submit]').on('click', function (e) {
		venueList.addVenue(
			$('#name').val(),
			$('#address').val(),
			$('#type').val(),
			$('#lat').val(),
			$('#lng').val()
		);
		$('input:text').val(''); // reset form elements of type text after the input data has been stored
		return false;
	});

	$('#venues').on('click', '.delete', function (e) {
		venueList.deleteVenue(parseInt($(this).parent().find('.key').text()));
		return false;
	});
	
	// DWT - add update event handler to [Update] text, this event handler modelled on delete event handler which also refers to a specific record
	$('#venues').on('click', '.update', function (e) {
		// use six classes to address the five pieces of information plus the key
		var name = $(this).parent().find('.name').text(); 
		var address = $(this).parent().find('.address').text();
		var type = $(this).parent().find('.type').text();
		var lat = $(this).parent().find('.lat').text();
		var lng = $(this).parent().find('.lng').text();
		var key = parseInt($(this).parent().find('.key').text()); // DWT - key that identifies the record is within the invisble span
		venueList.updateVenue(name,address,type,lat,lng,key);
		return false;
	});

	venueList.open(); // open displays the data previously saved

});



venueList = {}; // addVenue, getAllVenues, deleteVenue, updateVenue - are own methods

// open/create - method & variable(s) renamed but otherwise no changes
venueList.open = function() {
	this.list = { }; // create an empty data structure by default
	if (localStorage.venueList) {
		 // do work here - Read from serialized data from persistent storage
		 this.list = JSON.parse(localStorage.venueList);
	} 
	venueList.getAllVenues(); // Refresh the screen
};		


// add - method renamed and more arguments
venueList.addVenue = function(name,address,type,lat,lng) {
	console.log(arguments.callee.name, arguments); // DWT - handy for debugging functions
	//name="mark";address="high st";type="bar";lat=55;lng=-4;
	this.list[new Date().getTime()] = {
		'name':name,
		'address':address,
		'type':type,
		'lat':lat,
		'lng':lng
		};
	// stringify the list as before
	localStorage.venueList = JSON.stringify(this.list);
	this.getAllVenues(); // Refresh the screen
};


// read each item from list and render on display - no changes required!!!
venueList.getAllVenues = function() {
	$('#venues').html('');
	for (var key in this.list) {
		renderVenue(key, this.list[key]);
	}
};

// delete - no changes required!!!
venueList.deleteVenue = function(id) { 
	console.log(arguments.callee.name, arguments); // DWT - handy for debugging functions
	delete this.list[id];// do work here - delete the element from data structure
	localStorage.venueList = JSON.stringify(this.list); // do work here - serialize data and refresh (store in) persistent data
	this.getAllVenues();  // Refresh the screen
};

// update - method has more arguments
venueList.updateVenue = function(name,address,type,lat,lng,id) {
	console.log(arguments); // DWT - handy for debugging functions
	//name="mark";address="high st";type="bar";lat=55;lng=-4;
	this.list[id] = {
		'name':name,
		'address':address,
		'type':type,
		'lat':lat,
		'lng':lng
	};	// list item is an object rather than a primitive string
	localStorage.venueList = JSON.stringify(this.list); // do work here - Refresh persistent Storage
	this.getAllVenues();  // no change other than name of method
};		

// helper
function renderVenue(key,value) {
	console.log(arguments); // DWT - handy for debugging functions
	var li = '<li><span class="name" contenteditable="true">'+value.name+'</span> &nbsp; ';
	li += '<span class="address" contenteditable="true">'+value.address+'</span> &nbsp; ';
	li += '<span class="type" contenteditable="true">'+value.type+'</span> &nbsp; ';
	li += '<span class="lat" contenteditable="true">'+value.lat+'</span> &nbsp; ';
	li += '<span class="lng" contenteditable="true">'+value.lng+'</span> &nbsp; ';
	// must have five editable and addressable sections sections for five pieces of information
	li += '<a href="#" class="update">[Update]</a> &nbsp; '; 
	li += '<a href="#" class="delete">[Delete]</a><span class="key">'+key+'</span></li>';
	$('#venues').append(li);
}