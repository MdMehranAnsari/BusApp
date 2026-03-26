package com.appweave.bus;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.appweave.bus.pojos.BusAPIRequestItems;
import com.appweave.bus.services.BusService;

@RestController
public class BusAPIController {

	@Autowired
	BusService busService;
	
	@GetMapping("/api/buses/{busId}")
	public String showBus(@PathVariable String busId, @RequestParam(required=false) String date)
	{
		return busService.getBusJSONById(busId, date).toString();
	}
	
	@GetMapping("/api/buses")
	public String showBusesList(@RequestParam String departureCity, @RequestParam String arrivalCity, @RequestParam String date, @RequestParam(required=false) String seatType, @RequestParam(required=false) String isAC, @RequestParam(required=false) String departureSlot)
	{
		date = date.replace("-", "");
		return busService.getBusesListJSON(departureCity, arrivalCity, date, seatType, isAC, departureSlot).toString();
	}
	
	@PostMapping("/api/bookings")
	public String bookBus(@RequestBody String bookingDetails)
	{
		
		return busService.bookBus(bookingDetails).toString();
	}
}