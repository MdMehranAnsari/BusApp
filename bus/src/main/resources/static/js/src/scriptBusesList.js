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
					+ '<button id="' + bus.busId + '" class="book-btn">Book Now</button>' + '\n'
					+ '</div>' + '\n';
			});
			
			$('.bus-listings').append(str);
			//document.querySelector('.bus-listings').innerHTML += str;
	    },
	
	    error: function (data) {
	    	console.log(data);
	    },
	});
	
	$(document).on("click", ".book-btn", function(event) {
		let newURL = new URL("bookings/search/" + event.target.id, url1.origin);
		newURL.searchParams.append("departureCity", params.get("departureCity"));
		newURL.searchParams.append("arrivalCity", params.get("arrivalCity"));
		newURL.searchParams.append("date", params.get("date"));
		window.location.href = newURL;
	});
	
	function renderBusesList(busesList) {
		
		let str = '<h2>Available Buses</h2>' + '\n';
		$.each(busesList.buses, function(key1, bus) {
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
				+ '<form action="/bookings/search/' + bus.busId + '?date=' + params.get("date") + '">' + '\n'
					+ '<button id="' + bus.busId + '" class="book-btn">Book Now</button>' + '\n'
				+ '</form>' + '\n'
				+ '</div>' + '\n';
		});
		
		//$('.bus-listings').append(str);
		document.querySelector('.bus-listings').innerHTML = str;
	}
	
	function getSlot(time) {
		let hour = +(time.substring(0,2));
		if(hour>6 && hour<12)
			return "Morning";
		else if(hour>=12 && hour<16)
			return "Afternoon";
		else if(hour>16 && hour<20)
			return "Evening";
		else
			return "Night";
	}
	
	function applySeatTypeFilter(id) {
		renderedBuses.buses = renderedBuses.buses.filter(function(bus) {
						
			let isValid = false;
			$.each(bus.seatTypes, function(key2, seatType) {
				if(seatType.toUpperCase() === document.getElementById(id).value.toUpperCase()) {
					isValid = true;
				}
			});
			if(!isValid) renderedBuses.totalBuses--;
			return isValid;
		});
	}
	
	function applyACTypeFilter(id) {
		renderedBuses.buses = renderedBuses.buses.filter(function(bus) {
			if(!(bus.isAC.toString() === ((document.getElementById(id).value === "AC")?"true":"false")))
				renderedBuses.totalBuses--;
						
			return (bus.isAC.toString() === ((document.getElementById(id).value === "AC")?"true":"false")); 
		});
	}
	
	function applyDepartureSlotFilter(id) {
		renderedBuses.buses = renderedBuses.buses.filter(function(bus) {
						
			let isValid = false;
			$.each(bus.stops, function(key2, stop) {
				if(stop.stopName.toUpperCase() === params.get('departureCity').toUpperCase()) {
					if(getSlot(stop.departureTime).toUpperCase() === document.getElementById(id).value.toUpperCase()) {
						isValid = true;
					}
				}
			});
			if(!isValid) renderedBuses.totalBuses--;
			return isValid;
		});
	}
	
	function initializeSeatTypeFilter(id) {
		if(document.getElementById('normal').checked) {
			document.getElementById('normal').checked = false;
			
			if(id === null || id === 'normal') {
				document.getElementById('normal').checked = true;
				applySeatTypeFilter('normal');
			}
		}
		
		if(document.getElementById('semi-sleeper').checked) {
			document.getElementById('semi-sleeper').checked = false;
			
			if(id === null || id === 'semi-sleeper') {
				document.getElementById('semi-sleeper').checked = true;
				applySeatTypeFilter('semi-sleeper');
			}
		}
		
		if(document.getElementById('sleeper').checked) {
			document.getElementById('sleeper').checked = false;
			
			if(id === null || id === 'sleeper') {
				document.getElementById('sleeper').checked = true;
				applySeatTypeFilter('sleeper');
			}
		}
	}
		
	function initializeACTypeFilter(id) {
		if(document.getElementById('ac').checked) {
			document.getElementById('ac').checked = false;
			
			if(id === null || id === 'ac') {
				document.getElementById('ac').checked = true;
				applyACTypeFilter('ac');
			}
		}
		
		if(document.getElementById('non-ac').checked) {
			document.getElementById('non-ac').checked = false;
			
			if(id === null || id === 'non-ac') {
				document.getElementById('non-ac').checked = true;
				applyACTypeFilter('non-ac');
			}
		}
	}
	
	function initializeDepartureSlotFilter(id)	{
		if(document.getElementById('morning').checked) {
			document.getElementById('morning').checked = false;
			
			if(id === null || id === 'morning') {
				document.getElementById('morning').checked = true;
				applyDepartureSlotFilter('morning');
			}
		}
		
		if(document.getElementById('afternoon').checked) {
			document.getElementById('afternoon').checked = false;
			
			if(id === null || id === 'afternoon') {
				document.getElementById('afternoon').checked = true;
				applyDepartureSlotFilter('afternoon');
			}
		}
		
		if(document.getElementById('evening').checked) {
			document.getElementById('evening').checked = false;
			
			if(id === null || id === 'evening') {
				document.getElementById('evening').checked = true;
				applyDepartureSlotFilter('evening');
			}
		}
		
		if(document.getElementById('night').checked) {
			document.getElementById('night').checked = false;
			
			if(id === null || id === 'night') {
				document.getElementById('night').checked = true;
				applyDepartureSlotFilter('night');
			}
		}
	}
	
	
	$('#seatType').change(function(event) {
		//let checkStatus = document.getElementById(event.target.id).checked;
		renderedBuses = JSON.parse(JSON.stringify(allBusesData));
		initializeSeatTypeFilter(event.target.id);
		initializeACTypeFilter(null);
		initializeDepartureSlotFilter(null);
		
		
		/*if(checkStatus) {
			document.getElementById(event.target.id).checked = true;			
				
			busesToRender.buses = renderedBuses.buses.filter(function(bus) {
				
				let isValid = false;
				$.each(bus.seatTypes, function(key2, seatType) {
					if(seatType.seatNummber.toUpperCase() === $(event.target.id).value.toUpperCase()) {
						isValid = true;
					}
				});
				if(!isValid) busesToRender.totalBuses--;
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
					busesToRender.totalBuses++;
				}
			});
		}*/
		
		renderBusesList(renderedBuses);
		//renderedBuses = busesToRender;
	});
	
	$('#acType').change(function(event) {
		//let checkStatus = document.getElementById(event.target.id).checked;
		renderedBuses = JSON.parse(JSON.stringify(allBusesData));

		initializeSeatTypeFilter(null);
		initializeACTypeFilter(event.target.id);
		initializeDepartureSlotFilter(null);
		
		
		/*if(checkStatus) {
			document.getElementById(event.target.id).checked = true;
			
			busesToRender.buses = renderedBuses.buses.filter(function(bus) {
				if(!(bus.isAC.toString() === ((document.getElementById(event.target.id).value === "AC")?"true":"false")))
					busesToRender.totalBuses--;
				
				
				return (bus.isAC.toString() === ((document.getElementById(event.target.id).value === "AC")?"true":"false")); 
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
					busesToRender.totalBuses++;
				}
			});
		}*/
		
		renderBusesList(renderedBuses);
		//renderedBuses = busesToRender;
	});
	
	$('#departureSlot').change(function(event) {
		//let checkStatus = document.getElementById(event.target.id).checked;
		
		renderedBuses = JSON.parse(JSON.stringify(allBusesData));
		initializeSeatTypeFilter(null);
		initializeACTypeFilter(null);
		initializeDepartureSlotFilter(event.target.id);
		
		
		/*if(checkStatus) {
			document.getElementById(event.target.id).checked = true;
			
			busesToRender.buses = renderedBuses.buses.filter(function(bus) {
				
				let isValid = false;
				$.each(bus.stops, function(key2, stop) {
					if(stop.stopName.toUpperCase() === params.get('departureCity').toUpperCase()) {
						if(getSlot(stop.departureTime).toUpperCase() === document.getElementById(event.target.id).value.toUpperCase()) {
							isValid = true;
						}
					}
				});
				if(!isValid) busesToRender.totalBuses--;
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
					busesToRender.totalBuses++;
				}
			});
		}*/
		
		renderBusesList(renderedBuses);
	});
	
	
});