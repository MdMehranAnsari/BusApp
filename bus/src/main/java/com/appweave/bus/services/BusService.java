package com.appweave.bus.services;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.convert.MongoConverter;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.UpdateDefinition;

import com.appweave.bus.pojos.BusAPIRequestItems;
import com.appweave.bus.pojos.BusSeatsStatus;
import com.appweave.bus.pojos.Seat;
import com.appweave.bus.pojos.SeatReservationsByDate;
import com.appweave.bus.pojos.SeatsStatus;
import com.appweave.bus.pojos.Stop;
import com.appweave.bus.pojos.dbpojos.Bus;
import com.appweave.bus.repositories.BusRepo;
import com.mongodb.client.AggregateIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

@Service
public class BusService {

	@Autowired
	private BusRepo busRepo;
	@Autowired
	private MongoClient mongoClient;
	@Autowired
	private MongoConverter mongoConverter;
	
	
	
	public Bus getBusById(String busId)
	{		
		MongoTemplate template = new MongoTemplate(mongoClient, "BusApp");
		return template.query(Bus.class).matching(Query.query(Criteria.where("busId").is(busId))).oneValue();
	}
	
	public JSONObject getBusJSONById(String busId, String date)
	{
		MongoTemplate template = new MongoTemplate(mongoClient, "BusApp");
		Bus bus = getBusById(busId);
		BusSeatsStatus busReq = null;
		List<SeatsStatus> seatsBooked = null;
		SeatReservationsByDate bookedDate=null;
		int availableSeats=0;
		
		//SeatReservationsByDate bookedDate = template.query(SeatReservationsByDate.class).matching(Criteria.where("date").is(date)).oneValue();
		if(date != null && !date.isEmpty())
		{
			bookedDate = template.query(SeatReservationsByDate.class).matching(Criteria.where("date").is(date)).oneValue();
			
			if(bookedDate != null)
			{
				List<BusSeatsStatus> busesbookedDate = bookedDate.getBuses();
				for(BusSeatsStatus busbookedDate : busesbookedDate)
				{
					if(busbookedDate.getBusId().equals(busId))
					{
						busReq = busbookedDate;
						seatsBooked = busReq.getSeats();
						break;
					}
				}
			}
		}
		
		List<Stop> stoparr = bus.getStops();
		JSONArray stopsjsonarr = new JSONArray();
		for(Stop stop : stoparr)
		{
			JSONObject stopjsonobj = new JSONObject();
			stopjsonobj.put("stopName", stop.getStopName());
			stopjsonobj.put("arrivalTime", stop.getArrivalTime());
			stopjsonobj.put("departureTime", stop.getDepartureTime());
			
			stopsjsonarr.put(stopjsonobj);
		}
		
		List<Seat> seatarr = bus.getSeats();
		JSONArray seatsjsonarr = new JSONArray();
		for(Seat seat : seatarr)
		{
			JSONObject seatjsonobj = new JSONObject();
			seatjsonobj.put("seatNumber", seat.getSeatNumber());
			seatjsonobj.put("row", seat.getRow());
			seatjsonobj.put("column", seat.getColumn());
			seatjsonobj.put("seatType", seat.getSeatType());
			if(date == null || bookedDate == null)
			{
				seatjsonobj.put("isAvailable", true);
				availableSeats++;
			}
			else
			{
				for(SeatsStatus seatBooked : seatsBooked)
				{
					if(seatBooked.getSeatNumber().equals(seat.getSeatNumber()))
					{
						seatjsonobj.put("isAvailable", seatBooked.getSeatStatus().equals("available"));
						if(seatBooked.getSeatStatus().equals("available")) availableSeats++;
						break;
					}
				}
			}
			
			seatsjsonarr.put(seatjsonobj);
		}
		
		JSONObject busjson = new JSONObject();
		
		busjson.put("busId", bus.getBusId());
		busjson.put("busName", bus.getBusName());
		if(date != null && !date.isEmpty())
		{
			busjson.put("date", date);
			busjson.put("availableSeats", availableSeats);			
		}
		busjson.put("totalSeats", bus.getTotalSeats());
		busjson.put("price", bus.getPrice());
		busjson.put("seatTypes", bus.getSeatTypes());
		busjson.put("isAC", bus.isAC());
		busjson.put("stops", stopsjsonarr);
		busjson.put("seats", seatsjsonarr);
		
		return busjson;
	}
	
	public void addBusesToDate(String date)
	{
		MongoTemplate template = new MongoTemplate(mongoClient, "BusApp");
		List<Bus> buses = template.query(Bus.class).all();
		
		JSONObject finalBusesJSON = new JSONObject();
		JSONArray finalBusesArray = new JSONArray();
		
		finalBusesJSON.put("date", date);
		for(Bus bus : buses)
		{
			JSONObject busJSON = getBusJSONById(bus.getBusId(), null);
			
			busJSON.remove("busName");
			busJSON.remove("totalSeats");
			busJSON.remove("seatTypes");
			busJSON.remove("isAC");
			busJSON.remove("stops");
			JSONArray seats = (JSONArray)busJSON.get("seats");
			JSONArray newSeatsArray = new JSONArray();
			for(Object seat : seats)
			{
				JSONObject seat1 = (JSONObject)seat;
				seat1.remove("row");
				seat1.remove("column");
				seat1.remove("seatType");
				seat1.remove("isAvailable");
				
				seat1.put("seatStatus", "available");
				newSeatsArray.put(seat1);
			}
//			seats.remove("row");
//			seats.remove("column");
//			seats.remove("seatType");
			busJSON.remove("seats");
			busJSON.put("seats", newSeatsArray);
			
			finalBusesArray.put(busJSON);
		}
		finalBusesJSON.put("buses", finalBusesArray);
		
		template.insert(finalBusesJSON.toString(), "SeatReservationsByDate");
	}
	
	public String getSlot(String time)
	{
		int hour = Integer.parseInt(time.substring(0,2));
		if(hour>6 && hour<12)
			return "Morning";
		else if(hour>=12 && hour<16)
			return "Afternoon";
		else if(hour>16 && hour<20)
			return "Evening";
		else
			return "Night";
	}
	
	public JSONObject getBusesListJSON(String departureCity, String arrivalCity, String date, String seatType, String isAC, String departureSlot)
	{
		MongoTemplate template = new MongoTemplate(mongoClient, "BusApp");
		
		//Query.query(Criteria.where("stops.stopName").is(departureCity));
		List<Bus> res = template.query(Bus.class).matching(Query.query(Criteria.where("stops.stopName").is(departureCity))).all();
		JSONArray busesListJSON = new JSONArray();
		int totalBuses = 0;
		for(Bus res1 : res)
		{
			
			List<Stop> stops = res1.getStops();
			Stop stop1 = null, stop2 = null;
			Bus res2 = null;
			for(Stop stop : stops)
			{
				
				if(stop.getStopName().equals(departureCity))
					stop1 = stop;
				else if(stop.getStopName().equals(arrivalCity))
					stop2 = stop;
					
				if(stop1 != null && stop2 != null && stop1.getDepartureTime().compareTo(stop.getArrivalTime()) < 0)
				{
					if(departureSlot != null && !getSlot(stop1.getDepartureTime()).equalsIgnoreCase(departureSlot))
						break;
					res2 = res1;
					break;
				}
			}
			if(res2 != null)
			{
				if(seatType != null)
				{
					boolean added = false;
					for(String seat : res2.getSeatTypes())
					{
						if(seat.equalsIgnoreCase(seatType))
						{
							added = true;
							break;
						}
					}
					if(!added) continue;
					
				}
				if(isAC != null)
				{
					if((Boolean.getBoolean(isAC) && !res2.isAC()) || (!Boolean.getBoolean(isAC) && res2.isAC()))
						continue;
				}
					
				
				JSONObject obj = getBusJSONById(res2.getBusId(), date);
				obj.remove("seats");
				obj.remove("date");
				busesListJSON.put(obj);
				totalBuses++;
				
			}
		}
		JSONObject result = new JSONObject();
		result.put("date", date);
		result.put("totalBuses", totalBuses);
		result.put("buses", busesListJSON);
		
		return result;
	}
	
	public JSONObject bookBus(String bookingDetails)
	{
		MongoTemplate template = new MongoTemplate(mongoClient, "BusApp");
		JSONObject response = new JSONObject();
		
		JSONObject bookingDetailsJSON = new JSONObject(bookingDetails);
		int seatsCount = ((JSONArray)bookingDetailsJSON.get("seats")).length();
		boolean seatsAvailable = true;
		SeatReservationsByDate date = template.query(SeatReservationsByDate.class).matching(Query.query(Criteria.where("date").is(bookingDetailsJSON.get("date").toString().replace("-","")))).oneValue();
		if(date != null)
		{
			List<SeatsStatus> seatsDB = null;
			for(BusSeatsStatus bus : date.getBuses())
			{
				if(bus.getBusId().equals(bookingDetailsJSON.get("busId")))
				{
					seatsDB = bus.getSeats();
				}
			}
			
			if(seatsDB != null)
			{
				
				for(Object seatToBeBooked : (JSONArray)bookingDetailsJSON.get("seats"))
				{					
					boolean seatFound = false;
					for(SeatsStatus seatInDB : seatsDB)
					{
						if(seatToBeBooked.toString().equalsIgnoreCase(seatInDB.getSeatNumber()))
						{
							seatFound = true;
							if(!seatInDB.getSeatStatus().equalsIgnoreCase("available"))
								seatsAvailable = false;
							break;
						}
					}
					if(!seatFound || !seatsAvailable)
					{
						seatsAvailable = false;
						break;
					}
				}
			}
		}
		else
		{
			addBusesToDate(bookingDetailsJSON.get("date").toString());
		}
		
		if(date == null || seatsAvailable)
		{
			for(Object seat : (JSONArray)bookingDetailsJSON.get("seats"))
			{
//				String str = "{"
//						+ "update : \"SeatReservationsByDate\","
//						+ "updates : [ {"
//						+ "q : { date : \"" + bookingDetailsJSON.get("date").toString() + "\","
//						+ "\"buses.busId\" : \"" + bookingDetailsJSON.get("busId").toString() + "\","
//						+ "\"buses.$.seats.seatNumber\" : \"" + seat.toString() + "\"},"
//						+ "u : { $set : { \"buses.$.seats.0.seatStatus\" : \"unavailable\" } }"
//					+ "} ] }";
				
				String str = "{"
						+ "update : \"SeatReservationsByDate\","
						+ "updates : [ {"
							+ "q : { date : \"" + bookingDetailsJSON.get("date").toString() + "\" },"
							+ "u : { "
								+ "$set : { \"buses.$[i].seats.$[j].seatStatus\" : \"unavailable\" }"
							+ "},"
							+ "arrayFilters : ["								
								+ "{ \"i.busId\" : \"" + bookingDetailsJSON.get("busId").toString() + "\" }"
								+ "{ \"j.seatNumber\" : \"" + seat.toString() + "\" }"
							+ "]"
						+ "} ]"
					+ "}";
			
				// 
				//BasicQuery query = new BasicQuery(str);
				System.out.println(template.executeCommand(str));
				
				response.put("message", "Booking successful");
			}
		}
		else
		{
			response.put("message", "Booking unsuccessful. Provided seats are unavailable.");
		}
		
		response.put("busId", bookingDetailsJSON.get("busId").toString());
		response.put("seatsBooked", bookingDetailsJSON.get("seats"));
		response.put("price", getBusJSONById(bookingDetailsJSON.get("busId").toString(), null).getDouble("price") * seatsCount);
		response.put("passengerDetails", (JSONArray)bookingDetailsJSON.get("passengerDetails"));
		/* "db.SeatReservationsByDate.updateOne("
				+ "{ \"date\" : \"" + bookingDetailsJSON.get("date") + "\","
				+ "\"buses.busId\" : \"" + bookingDetailsJSON.get("busId") + "\","
				+ "\"buses.$.seats.seatNumber\" : \"" + seat.getSeatNumber() + "\"},"
				+ "{ \"$set\" : { \"buses.$.seats.$.seatStatus\" : \"unavailable\" }"
			+ ");" */
		return response;
	}
}
