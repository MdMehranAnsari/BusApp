package com.appweave.bus.pojos;

public class BusAPIRequestItems {

	private String departureCity;
	private String arrivalCity;
	private String date;
	private String seatType;
	private boolean isAC;
	private String departureSlot;
	
	public BusAPIRequestItems() {
		
	}
	public BusAPIRequestItems(String departureCity, String arrivalCity, String date, String seatType, boolean isAC,
			String departureSlot) {
		super();
		this.departureCity = departureCity;
		this.arrivalCity = arrivalCity;
		this.date = date;
		this.seatType = seatType;
		this.isAC = isAC;
		this.departureSlot = departureSlot;
	}
	
	public String getDepartureCity() {
		return departureCity;
	}
	public void setDepartureCity(String departureCity) {
		this.departureCity = departureCity;
	}
	public String getArrivalCity() {
		return arrivalCity;
	}
	public void setArrivalCity(String arrivalCity) {
		this.arrivalCity = arrivalCity;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getSeatType() {
		return seatType;
	}
	public void setSeatType(String seatType) {
		this.seatType = seatType;
	}
	public boolean isAC() {
		return isAC;
	}
	public void setAC(boolean isAC) {
		this.isAC = isAC;
	}
	public String getDepartureSlot() {
		return departureSlot;
	}
	public void setDepartureSlot(String departureSlot) {
		this.departureSlot = departureSlot;
	}
}
