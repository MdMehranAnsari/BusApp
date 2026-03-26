package com.appweave.bus.pojos.dbpojos;

import java.util.Arrays;
import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

import com.appweave.bus.pojos.Seat;
import com.appweave.bus.pojos.Stop;

@Document(collection = "Buses")
public class Bus {

	private String busId;
	private String busName;
	private int totalSeats;
	private double price;
	private List<String> seatTypes;
	private boolean isAC;
	private List<Stop> stops;
	private List<Seat> seats;
	
	public Bus() {
		
	}
	public Bus(String busId, String busName, int totalSeats, double price, List<String> seatTypes, boolean isAC,
			List<Stop> stops, List<Seat> seats) {
		super();
		this.busId = busId;
		this.busName = busName;
		this.totalSeats = totalSeats;
		this.price = price;
		this.seatTypes = seatTypes;
		this.isAC = isAC;
		this.stops = stops;
		this.seats = seats;
	}

	public String getBusId() {
		return busId;
	}

	public void setBusId(String busId) {
		this.busId = busId;
	}

	public String getBusName() {
		return busName;
	}

	public void setBusName(String busName) {
		this.busName = busName;
	}

	public int getTotalSeats() {
		return totalSeats;
	}

	public void setTotalSeats(int totalSeats) {
		this.totalSeats = totalSeats;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public List<String> getSeatTypes() {
		return seatTypes;
	}

	public void setSeatTypes(List<String> seatTypes) {
		this.seatTypes = seatTypes;
	}

	public boolean isAC() {
		return isAC;
	}

	public void setAC(boolean isAC) {
		this.isAC = isAC;
	}

	public List<Stop> getStops() {
		return stops;
	}

	public void setStops(List<Stop> stops) {
		this.stops = stops;
	}

	public List<Seat> getSeats() {
		return seats;
	}

	public void setSeats(List<Seat> seats) {
		this.seats = seats;
	}
	@Override
	public String toString() {
		return "Bus{" +
					"busId=\"" + busId + "\"," +
					"busName=\"" + busName + "\"," +
					"totalSeats=" + totalSeats + "," +
					"price=" + price + "," +
					"seatTypes=" + Arrays.toString(seatTypes.toArray()) + "," +
					"isAC=" + isAC + "," +
					"stops=" + Arrays.toString(stops.toArray()) + "," +
					"seats=" + Arrays.toString(seats.toArray()) +
				"}";
	}
}