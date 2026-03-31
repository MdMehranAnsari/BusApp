$(document).ready(function() {
	console.log(currentBus);
	const currentBusJSON = JSON.parse(currentBus);
	console.log(currentBusJSON);
	const seatMap = document.getElementById('seatMap');
	const selectedSeatsEl = document.getElementById('selectedSeats');
	const totalPriceEl = document.getElementById('totalPrice');
	const seatPrice = currentBusJSON.price; // price per seat
	let bookedSeats = []; // example booked seats
	let selectedSeats = [];
	
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
	
	let str = '<h3>' + currentBusJSON.busName + '</h3>' + '\n'
	+ '<p>' + ((currentBusJSON.isAC)?'AC':'Non-AC') + '</p>' + '\n'
	+ '<p>' + currentBusJSON.seatTypes + '</p>' + '\n'
	+ '<p>📅 ' + currentBusJSON.date + '</p>' + '\n'
	+ '<p>📍 ' + departureCity + ' → ' + arrivalCity + '</p>' + '\n'
	+ '<p>🕒 ' + departureTime + ' - ' + arrivalTime + '</p>' + '\n';
	
	document.querySelector('.bus-details').innerHTML = str;
	
	$.each(currentBusJSON.seats, function(key1,seat) {
		if(!seat.isAvailable) {
			bookedSeats.push(seat.seatNumber);
		}
	});
	
	// Generate seat map
	$.each(currentBusJSON.seats, function(key1, seat) {
		const seatDiv = document.createElement('div');
		seatDiv.classList.add('seat');
		seatDiv.innerText = seat.seatNumber;
		
		if (bookedSeats.includes(seat.seatNumber)) {
			seatDiv.classList.add('booked');
		}
		else {
			seatDiv.classList.add('available');
			seatDiv.addEventListener('click', () => toggleSeat(seat.seatNumber, seatDiv));
		}
		
		seatMap.appendChild(seatDiv);
	});
	
	
	/*for (let i = 1; i <= 32; i++) {
		const seat = document.createElement('div');
		seat.classList.add('seat');
		seat.innerText = i;
		
		if (bookedSeats.includes(i)) {
			seat.classList.add('booked');
		}
		else {
			seat.classList.add('available');
			seat.addEventListener('click', () => toggleSeat(i, seat));
		}
		
		seatMap.appendChild(seat);
	}*/
	
	function toggleSeat(seatNumber, seatDiv) {
		if (selectedSeats.includes(seatNumber)) {
			selectedSeats = selectedSeats.filter(s => s !== seatNumber);
			seatDiv.classList.remove('selected');
			seatDiv.classList.add('available');
		}
		else {
			selectedSeats.push(seatNumber);
			seatDiv.classList.remove('available');
			seatDiv.classList.add('selected');
		}
		updateSummary();
	}
	
	function updateSummary() {
		if (selectedSeats.length > 0) {
			selectedSeatsEl.innerText = `Selected Seats: ${selectedSeats.join(', ')}`;
			totalPriceEl.innerText = `Total Price: ₹${selectedSeats.length * currentBusJSON.price}`;
		}
		else {
			selectedSeatsEl.innerText = "Selected Seats: None";
			totalPriceEl.innerText = "Total Price: ₹0";
		}
	}
	
});