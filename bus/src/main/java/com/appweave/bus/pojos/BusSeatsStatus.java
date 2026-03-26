package com.appweave.bus.pojos;

import java.util.List;

public class BusSeatsStatus {

	private String busId;
	private List<SeatsStatus> seats;
	
	public BusSeatsStatus() {
		
	}
	public BusSeatsStatus(String busId, List<SeatsStatus> seats) {
		super();
		this.busId = busId;
		this.seats = seats;
	}
	
	public String getBusId() {
		return busId;
	}
	public void setBusId(String busId) {
		this.busId = busId;
	}
	public List<SeatsStatus> getSeats() {
		return seats;
	}
	public void setSeats(List<SeatsStatus> seats) {
		this.seats = seats;
	}
}
