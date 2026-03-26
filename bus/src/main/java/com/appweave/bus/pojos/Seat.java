package com.appweave.bus.pojos;

public class Seat {

	private String seatNumber;
	private int row;
	private int column;
	private String seatType;
	
	public Seat() {
		
	}
	public Seat(String seatNumber, int row, int column, String seatType) {
		super();
		this.seatNumber = seatNumber;
		this.row = row;
		this.column = column;
		this.seatType = seatType;
	}
	
	public String getSeatNumber() {
		return seatNumber;
	}
	public void setSeatNumber(String seatNumber) {
		this.seatNumber = seatNumber;
	}
	public int getRow() {
		return row;
	}
	public void setRow(int row) {
		this.row = row;
	}
	public int getColumn() {
		return column;
	}
	public void setColumn(int column) {
		this.column = column;
	}
	public String getSeatType() {
		return seatType;
	}
	public void setSeatType(String seatType) {
		this.seatType = seatType;
	}
	
	@Override
	public String toString() {
		return "Seat {" +
					"seatNo=\"" + seatNumber + "\"," +
					"row=" + row + "," +
					"column=" + column + "," +
					"seatType=\"" + seatType + "\"" +
				"}";
	}
}