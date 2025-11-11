package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLecheCrudaDonadora;
import com.HospitalRegional.BancoDeLeche.repository.RegistroLecheCrudaDonadoraRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroLecheCrudaDonadoraService {

    @Autowired
    private RegistroLecheCrudaDonadoraRepository registroLecheCrudaDonadoraRepository;

    public List<RegistroLecheCrudaDonadora> findAll() {
        return registroLecheCrudaDonadoraRepository.findAll();
    }

    public Optional<RegistroLecheCrudaDonadora> findById(Long id) {
        return registroLecheCrudaDonadoraRepository.findById(id);
    }

    public RegistroLecheCrudaDonadora save(RegistroLecheCrudaDonadora registro) {
        return registroLecheCrudaDonadoraRepository.save(registro);
    }

    public void deleteById(Long id) {
        registroLecheCrudaDonadoraRepository.deleteById(id);
    }
}