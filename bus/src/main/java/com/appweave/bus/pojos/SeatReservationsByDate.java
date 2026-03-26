package com.appweave.bus.pojos;

import java.util.List;

import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="SeatReservationsByDate")
public class SeatReservationsByDate {

	private String date;
	private List<BusSeatsStatus> buses;
	
	public SeatReservationsByDate() {
		
	}
	public SeatReservationsByDate(String date, List<BusSeatsStatus> buses) {
		super();
		this.date = date;
		this.buses = buses;
	}
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public List<BusSeatsStatus> getBuses() {
		return buses;
	}
	public void setBuses(List<BusSeatsStatus> buses) {
		this.buses = buses;
	}
}
