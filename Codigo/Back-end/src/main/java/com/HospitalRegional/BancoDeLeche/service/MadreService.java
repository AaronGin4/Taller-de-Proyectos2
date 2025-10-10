package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.Madre;
import com.HospitalRegional.BancoDeLeche.repository.MadreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MadreService {

    @Autowired
    private MadreRepository madreRepository;

    public List<Madre> findAll() {
        return madreRepository.findAll();
    }

    public Optional<Madre> findById(String id) {
        return madreRepository.findById(id);
    }

    public Madre save(Madre madre) {
        return madreRepository.save(madre);
    }

    public void deleteById(String id) {
        madreRepository.deleteById(id);
    }
}
