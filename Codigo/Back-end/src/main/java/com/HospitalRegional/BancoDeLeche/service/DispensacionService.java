package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.Dispensacion;
import com.HospitalRegional.BancoDeLeche.entity.PaseDeVisita;
import com.HospitalRegional.BancoDeLeche.repository.DispensacionRepository;
import com.HospitalRegional.BancoDeLeche.repository.PaseDeVisitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DispensacionService {

    private final DispensacionRepository dispensacionRepository;
    private final PaseDeVisitaRepository paseDeVisitaRepository;

    @Autowired
    public DispensacionService(
            DispensacionRepository dispensacionRepository,
            PaseDeVisitaRepository paseDeVisitaRepository
    ) {
        this.dispensacionRepository = dispensacionRepository;
        this.paseDeVisitaRepository = paseDeVisitaRepository;
    }

    public List<Dispensacion> findAll() {
        return dispensacionRepository.findAll();
    }

    public Optional<Dispensacion> findById(Long id) {
        return dispensacionRepository.findById(id);
    }

    public Dispensacion save(Dispensacion dispensacion) {
        return dispensacionRepository.save(dispensacion);
    }

    public void deleteById(Long id) {
        dispensacionRepository.deleteById(id);
    }

    public List<Dispensacion> findByIdPaciente(String pacienteId) {
        return dispensacionRepository.findByIdPaciente(pacienteId);
    }

    public List<Dispensacion> saveAll(List<Dispensacion> dispensaciones) {
        return dispensacionRepository.saveAll(dispensaciones);
    }
}