package com.appweave.bus.pojos;

public class SeatsStatus {

	private String seatNumber;
	private String seatStatus;
	
	public SeatsStatus() {
		
	}
	public SeatsStatus(String seatNumber, String seatStatus) {
		super();
		this.seatNumber = seatNumber;
		this.seatStatus = seatStatus;
	}
	
	public String getSeatNumber() {
		return seatNumber;
	}
	public void setSeatNumber(String seatNumber) {
		this.seatNumber = seatNumber;
	}
	public String getSeatStatus() {
		return seatStatus;
	}
	public void setSeatStatus(String seatStatus) {
		this.seatStatus = seatStatus;
	}	
}