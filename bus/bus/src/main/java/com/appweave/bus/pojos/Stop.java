package com.appweave.bus.pojos;

public class Stop {

	private String stopName;
	private String arrivalTime;
	private String departureTime;
	
	public Stop() {
		
	}
	public Stop(String stopName, String arrivalTime, String departureTime) {
		super();
		this.stopName = stopName;
		this.arrivalTime = arrivalTime;
		this.departureTime = departureTime;
	}
	
	public String getStopName() {
		return stopName;
	}
	public void setStopName(String stopName) {
		this.stopName = stopName;
	}
	public String getArrivalTime() {
		return arrivalTime;
	}
	public void setArrivalTime(String arrivalTime) {
		this.arrivalTime = arrivalTime;
	}
	public String getDepartureTime() {
		return departureTime;
	}
	public void setDepartureTime(String departureTime) {
		this.departureTime = departureTime;
	}
	
	@Override
	public String toString() {
		return "Stop{" +
					"stopName=\"" + stopName + "\"," +
					"arrivalTime=\"" + arrivalTime + "\"," +
					"departureTime=\"" + departureTime + "\"" +
				"}";
	}
	
}
