package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLecheCruda;
import com.HospitalRegional.BancoDeLeche.repository.RegistroLecheCrudaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroLecheCrudaService {

    @Autowired
    private RegistroLecheCrudaRepository registroLecheCrudaRepository;

    public List<RegistroLecheCruda> findAll() {
        return registroLecheCrudaRepository.findAll();
    }

    public Optional<RegistroLecheCruda> findById(String id) {
        return registroLecheCrudaRepository.findById(id);
    }

    public RegistroLecheCruda save(RegistroLecheCruda registroLecheCruda) {
        return registroLecheCrudaRepository.save(registroLecheCruda);
    }

    public void deleteById(String id) {
        registroLecheCrudaRepository.deleteById(id);
    }
}