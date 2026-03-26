$(document).ready(function () {
	
	const url1 = window.location;
	const params = new URLSearchParams(location.search);
	
	var allBusesData;
	var renderedBuses;
	/*fetch(url.origin + "/api/buses" + url.toString().substring(url.toString().indexOf('?')))
		.then(function(response) {
			console.log(response);
			let busesList = $.parseJSON(response);
			
			let str = "";
			$.each(busesList.buses, function(bus) {
				
				let departureTime = "";
				let arrivalTime = "";
				$.each(bus.stops, function(stop) {
					if(stop.stopName.toUpperCase() === bus.departureCity.toUpperCase())
						departureTime = stop.departureTime.substring(0,2) + ":" + stop.departureTime.substring(2);
					else if(stop.stopName.toUpperCase() === bus.arrivalCity.toUpperCase()) {
						arrivalTime = stop.arrivalTime.substring(0,2) + ":" + stop.arrivalTime.substring(2);
					}
				});
				
				str += '<div class="bus-card">'
					+ '<h4>' + bus.busName + '</h4>' + '\n'
					+ '<p>Route: ' + bus.departureCity + ' → ' + bus.arrivalCity + '</p>' + '\n'
					+ '<p>Time: ' + departureTime + ' – ' + arrivalTime + '</p>' + '\n'
					+ '<p>Seat Type: ' + bus.seatTypes + '</p>' + '\n'
					+ '<p>AC Type: ' + (bus.isAC)?'AC':'Non AC' + '</p>' + '\n'
					+ '<p>Price: ' +  bus.price + '</p>' + '\n'
					+ '<button class="book-btn">Book Now</button>' + '\n'
					+ '</div>';
			});
			$('.bus-cardbus-listings').append(str);
		});
	*/
	$.ajax({
	    type: "GET",
	    url: url1.origin + "/api/buses" + url1.toString().substring(url1.toString().indexOf('?')),
		data: "json",
		contentType: "application/json",
		
	    success: function (data) {
			
			let busesList = $.parseJSON(data);
			
			allBusesData = $.parseJSON(data);
			renderedBuses = busesList;
			
			let str = '';
			$.each(busesList.buses, function(key1, bus) {
				console.log(bus);
				let departureTime = "";
				let arrivalTime = "";
				$.each(bus.stops, function(key2, stop) {
					if(stop.stopName.toUpperCase() === params.get('departureCity').toUpperCase())
						departureTime = stop.departureTime.substring(0,2) + ":" + stop.departureTime.substring(2);
					else if(stop.stopName.toUpperCase() === params.get('arrivalCity').toUpperCase()) {
						arrivalTime = stop.arrivalTime.substring(0,2) + ":" + stop.arrivalTime.substring(2);
					}
				});
				str += '<div class="bus-card">' + '\n'
					+ '<h4>' + bus.busName + '</h4>' + '\n'
					+ '<p>Route: ' + params.get('departureCity') + ' → ' + params.get('arrivalCity') + '</p>' + '\n'
					+ '<p>Time: ' + departureTime + ' – ' + arrivalTime + '</p>' + '\n'
					+ '<p>Seat Type: ' + bus.seatTypes + '</p>' + '\n'
					+ '<p>AC Type: ' + ((bus.isAC === true)?'AC':'Non AC') + '</p>' + '\n'
					+ '<p>Price: ' +  bus.price + '</p>' + '\n'
					+ '<button class="book-btn">Book Now</button>' + '\n'
					+ '</div>' + '\n';
					console.log(str);
			});
			
			$('.bus-listings').append(str);
			//document.querySelector('.bus-listings').innerHTML += str;
	    },
	
	    error: function (data) {
	    	console.log(data);
	    },
	});
	
	function renderBusesList(busesList) {
		let str = '';
		$.each(busesList.buses, function(key1, bus) {
			console.log(bus);
			let departureTime = "";
			let arrivalTime = "";
			$.each(bus.stops, function(key2, stop) {
				if(stop.stopName.toUpperCase() === params.get('departureCity').toUpperCase())
					departureTime = stop.departureTime.substring(0,2) + ":" + stop.departureTime.substring(2);
				else if(stop.stopName.toUpperCase() === params.get('arrivalCity').toUpperCase()) {
					arrivalTime = stop.arrivalTime.substring(0,2) + ":" + stop.arrivalTime.substring(2);
				}
			});
			str += '<div class="bus-card">' + '\n'
				+ '<h4>' + bus.busName + '</h4>' + '\n'
				+ '<p>Route: ' + params.get('departureCity') + ' → ' + params.get('arrivalCity') + '</p>' + '\n'
				+ '<p>Time: ' + departureTime + ' – ' + arrivalTime + '</p>' + '\n'
				+ '<p>Seat Type: ' + bus.seatTypes + '</p>' + '\n'
				+ '<p>AC Type: ' + ((bus.isAC === true)?'AC':'Non AC') + '</p>' + '\n'
				+ '<p>Price: ' +  bus.price + '</p>' + '\n'
				+ '<button class="book-btn">Book Now</button>' + '\n'
				+ '</div>' + '\n';
				console.log(str);
		});
		
		//$('.bus-listings').append(str);
		$('.bus-listings').innerHTML = str;
	}
	
	function initializeSeatTypeFilter() {
		document.getElementById('normal').checked = false;
		document.getElementById('semi-sleeper').checked = false;
		document.getElementById('sleeper').checked = false;
	}
		
	function initializeACTypeFilter()	{
		document.getElementById('ac').checked = false;
		document.getElementById('non-ac').checked = false;
	}
	
	function initializeDepartureSlotFilter()	{
		document.getElementById('morning').checked = false;
		document.getElementById('afternoon').checked = false;
		document.getElementById('evening').checked = false;
		document.getElementById('night').checked = false;
	}
	
	
	$('#seatType').change(function(event) {
		let checkStatus = document.getElementById(event.target.id).checked;
		
		initializeSeatTypeFilter();
		
		let busesToRender = renderedBuses;
		if(checkStatus) {
			document.getElementById(event.target.id).checked = true;			
				
			busesToRender.buses = renderedBuses.buses.filter(function(bus) {
				
				let isValid = false;
				$.each(bus.seatTypes, function(key2, seatType) {
					if(seatType.toUpperCase() === $(event.target.id).value.toUpperCase()) {
						isValid = true;
					}
				});
				if(!isValid) busesToRender.totalSeats--;
				return isValid;
			});
		}
		else {
			$.each(allBusesData.buses, function(key1, bus) {
				
				let isPresent = false;
				$.each(renderedBuses.buses, function(key2, renderedBus) {					
					if(renderedBus.busId.toUpperCase() === bus.busId.toUpperCase()) {
						isPresent = true;
					}
				});
				
				if(!isPresent) {
					busesToRender['buses'].push(bus);
					busesToRender.totalSeats++;
				}
			});
		}
		
		renderBusesList(busesToRender);
		renderedBuses = busesToRender;
	});
	
	$('#acType').change(function(event) {
		let checkStatus = document.getElementById(event.target.id).checked;
		
		initializeACTypeFilter();
		
		if(checkStatus) {
			document.getElementById(event.target.id).checked = true;
			
			busesToRender.buses = renderedBuses.buses.filter(function(bus) {
				return (bus.isAC.toString() === ((document.getElementById(event.target.id).value === "ac")?true:false)); 
			});
		}
		else {
			$.each(allBusesData.buses, function(key1, bus) {
							
				let isPresent = false;
				$.each(renderedBuses.buses, function(key2, renderedBus) {					
					if(renderedBus.isAC.toString() === bus.isAC.toString()) {
						isPresent = true;
					}
				});
				
				if(!isPresent) {
					busesToRender['buses'].push(bus);
					busesToRender.totalSeats++;
				}
			});
		}
		
		renderBusesList(busesToRender);
		renderedBuses = busesToRender;
	});
	
	$('#departureSlot').change(function(event) {
		let checkStatus = document.getElementById(event.target.id).checked;
		
		initializeDepartureSlotFilter();
		
		if(checkStatus)
			document.getElementById(event.target.id).checked = true;
	});
	
	
});