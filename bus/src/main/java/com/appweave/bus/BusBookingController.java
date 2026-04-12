package com.appweave.bus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.appweave.bus.services.BusService;

@Controller
public class BusBookingController {
	
	@Autowired
	BusService busService;
	
	@GetMapping("/")
	public String showHomePage() 
	{		
		return "index";
	}
	
	@GetMapping("/bookings/search")
	public String showBusesList(@RequestParam String departureCity, @RequestParam String arrivalCity, @RequestParam String date, @RequestParam(required=false) String seatType, @RequestParam(required=false) String isAC, @RequestParam(required=false) String departureSlot, Model model)
	{
		date = date.replace("-", "");
		model.addAttribute("busesList", busService.getBusesListJSON(departureCity, arrivalCity, date, seatType, isAC, departureSlot));
		return "busesListPage";
	}
	
	@GetMapping("/bookings/search/{busId}")
	public String showSeatSelectionPage(@PathVariable String busId, @RequestParam String date, @RequestParam String departureCity, @RequestParam String arrivalCity, Model model)
	{
		model.addAttribute("currentBus", busService.getBusJSONById(busId, date).toString());
		model.addAttribute("departureCity", departureCity);
		model.addAttribute("arrivalCity", arrivalCity);
		
		return "seatSelectionPage";
	}
	
	@GetMapping("/bookings/confirmation")
	public String showPassengerDetails(@RequestParam String busId, @RequestParam String seatsString, @RequestParam String date, @RequestParam String departureCity, @RequestParam String arrivalCity, Model model)
	{
		model.addAttribute("currentBus", busService.getBusJSONById(busId, date).toString());
		model.addAttribute("seatsString", seatsString);
		model.addAttribute("departureCity", departureCity);
		model.addAttribute("arrivalCity", arrivalCity);
		
		System.out.println(seatsString);
		
		return "paymentConfirmation";
	}
}
