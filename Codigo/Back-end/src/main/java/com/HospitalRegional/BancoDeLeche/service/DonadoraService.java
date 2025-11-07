package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.Donadora;
import com.HospitalRegional.BancoDeLeche.repository.DonadoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DonadoraService {

    @Autowired
    private DonadoraRepository donadoraRepository;

    public List<Donadora> findAll() {
        return donadoraRepository.findAll();
    }

    public Optional<Donadora> findById(String id) {
        return donadoraRepository.findById(id);
    }

    public Donadora save(Donadora donadora) {
        return donadoraRepository.save(donadora);
    }

    public void deleteById(String id) {
        donadoraRepository.deleteById(id);
    }
}