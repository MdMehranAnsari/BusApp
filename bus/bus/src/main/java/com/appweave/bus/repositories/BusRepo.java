package com.appweave.bus.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.appweave.bus.pojos.dbpojos.Bus;

@Repository
public interface BusRepo extends MongoRepository<Bus,String> {

}