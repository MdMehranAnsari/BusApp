$(document).ready(function() {
	const currentBusJSON = JSON.parse(currentBus);
	const seatsArray = seatsString.split(',');
 	const seatsBookedCount = seatsArray.length;
	console.log(seatsString);
	
	let departureTime = "";
	let arrivalTime = "";
	$.each(currentBusJSON.stops, function(key, stop) {
		if(stop.stopName.toUpperCase() === departureCity.toUpperCase()) {
			departureTime = stop.departureTime;
			departureTime = departureTime.substring(0,2) + ":" + departureTime.substring(2);
		}
		else if(stop.stopName.toUpperCase() === arrivalCity.toUpperCase()) {
			arrivalTime = stop.arrivalTime;
			arrivalTime = arrivalTime.substring(0,2) + ":" + arrivalTime.substring(2);
		}
	});
	
	let strBusSection = '<h3>Bus Details</h3>' + '\n'
			+ '<p><strong>' + currentBusJSON.busName + '</strong></p>' + '\n'
			+ '<p>' + ((currentBusJSON.isAC)?'AC':'Non-AC') + ' ' + currentBusJSON.seatTypes + '</p>' + '\n'
			+ '<p>Route: ' + departureCity + ' → ' + arrivalCity + '</p>' + '\n'
			+ '<p>Date: ' + currentBusJSON.date + '</p>' + '\n'
			+ '<p>Time: ' + departureTime.split('.') + ' - ' + arrivalTime + '</p>';
			
	document.querySelector('.bus-section').innerHTML = strBusSection;
	
	let strSectionSummary = '<h3>Booking Summary</h3>' + '\n'
					+ '<p>Selected Seats: ' + seatsString.replace(",", ", ") + '</p>' + '\n'
					+ '<p>Total Price: ₹' + currentBusJSON.price * seatsBookedCount + '</p>';
					
	document.querySelector('.section-summary').innerHTML = strSectionSummary;
	
	let strSection = '<h3>Passenger Details</h3>' + '\n';
	for(let i=1; i<=seatsBookedCount; i++) {
		strSection += '<div class="form-group">' + '\n'
						+ '<label>Passenger '+i+' Name</label>' + '\n'
						+ '<input type="text" id="p'+i+'Name" placeholder="Enter name">' + '\n'
					+ '</div>' + '\n'
					+ '<div class="form-group">' + '\n'
						+ '<label>Passenger '+i+' Age</label>' + '\n'
						+ '<input type="number" id="p'+i+'Age" placeholder="Enter age">' + '\n'
					+ '</div>' + '\n'
					+ '<div class="form-group">' + '\n'
						+ '<label>Passenger '+i+' Gender</label>' + '\n'
						+ '<div class="gender-options">' + '\n'
							+ '<label><input type="radio" name="p'+i+'Gender" value="male"> Male</label>' + '\n'
							+ '<label><input type="radio" name="p'+i+'Gender" value="female"> Female</label>' + '\n'
							+ '<label><input type="radio" name="p'+i+'Gender" value="Other"> Other</label>' + '\n'
						+ '</div>' + '\n'
					+ '</div>' + '\n';
	}
	document.querySelector('.section-summary').innerHTML = strSection;
	
	$(document).on('click', '.confirm-btn', function(event) {
		seatsArray.forEach(function(key, index) {
			this[index] = '"' + this[index] + '"';
		}, seatsArray);
		
		let strJSON = '{'
							+ '"busId":"' + currentBusJSON.busId + '",'
							+ '"date":"' + currentBusJSON.date + '",'
							+ '"seats":[' + seatsArray.toString() + '],'
							+ '"passengerDetails":[';
		
		for(let i=1; i<=seatsBookedCount; i++) {
			let pName = document.getElementById('p'+i+'Name').value;
			let pAge = document.getElementById('p'+i+'Age').value;
			let pGender = document.querySelector('input[name="p'+i+'Gender"]:checked');
			
			if(!pName || !pAge || !pGender) {
				alert("Please fill all passenger details.");
				return;
			}
			else {
				strJSON += '{'
								+ '"name":"' + pName + '",'
								+ '"age":' + pAge + ','
								+ '"gender":"' + pGender.value + '"'
						+ '},';
			}
		}
		strJSON = strJSON.substring(0, strJSON.length - 1) + ']}';
		console.log(JSON.parse(strJSON));
		
		let newURL = new URL("/api/bookings", window.location.origin);
		
		$.ajax({
			traditional: true,
			type: 'POST',
			url: newURL,
			data: strJSON,
			success: function(data, status)	{
					alert(data);
				}
		});
		
		/*$.post(newURL, JSON.parse(strJSON), (data, status) => {
			window.location.href = newURL;
		});*/
	});
});