package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.Cuna;
import com.HospitalRegional.BancoDeLeche.repository.CunaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CunaService {

    @Autowired
    private CunaRepository cunaRepository;

    public List<Cuna> findAll() {
        return cunaRepository.findAll();
    }

    public Optional<Cuna> findById(String id) {
        return cunaRepository.findById(id);
    }

    public Cuna save(Cuna cuna) {
        return cunaRepository.save(cuna);
    }

    public void deleteById(String id) {
        cunaRepository.deleteById(id);
    }

    public Cuna actualizarEstadoCuna(String id, String nuevoEstado) {
        Optional<Cuna> cuna = cunaRepository.findById(id);
        if (cuna.isPresent()) {
            Cuna cunaActualizada = cuna.get();
            cunaActualizada.setEstadoCuna(nuevoEstado);
            return cunaRepository.save(cunaActualizada);
        }
        return null;
    }
}