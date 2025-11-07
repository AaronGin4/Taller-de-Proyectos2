package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.Enfermedad;
import com.HospitalRegional.BancoDeLeche.repository.EnfermedadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnfermedadService {

    @Autowired
    private EnfermedadRepository enfermedadRepository;

    public List<Enfermedad> findAll() {
        return enfermedadRepository.findAll();
    }

    public Optional<Enfermedad> findById(String id) {
        return enfermedadRepository.findById(id);
    }

    public Enfermedad save(Enfermedad enfermedad) {
        return enfermedadRepository.save(enfermedad);
    }

    public void deleteById(String id) {
        enfermedadRepository.deleteById(id);
    }

    public Enfermedad actualizar(String id, Enfermedad detallesEnfermedad) {
        return enfermedadRepository.findById(id)
                .map(enfermedad -> {
                    enfermedad.setNombreEnfermedad(detallesEnfermedad.getNombreEnfermedad());
                    enfermedad.setCategoriaEnfermedad(detallesEnfermedad.getCategoriaEnfermedad());
                    return enfermedadRepository.save(enfermedad);
                }).orElseThrow(() -> new RuntimeException("Enfermedad no encontrada con id: " + id));
    }
}
