package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.PaseDeVisita;
import com.HospitalRegional.BancoDeLeche.repository.PaseDeVisitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PaseDeVisitaService {

    @Autowired
    private PaseDeVisitaRepository paseDeVisitaRepository;

    public List<PaseDeVisita> findPasesDeVisitaByPacienteId(String idPaciente) {
        return paseDeVisitaRepository.findByPaciente_IdPaciente(idPaciente);
    }

    public PaseDeVisita savePaseDeVisita(PaseDeVisita paseDeVisita) {
        return paseDeVisitaRepository.save(paseDeVisita);
    }

    public Optional<PaseDeVisita> getPaseDeVisitaById(Integer id) {
        return paseDeVisitaRepository.findById(id);
    }

    public List<PaseDeVisita> getAllPasesDeVisita() {
        return paseDeVisitaRepository.findAll();
    }

    public void deletePaseDeVisita(Integer id) {
        paseDeVisitaRepository.deleteById(id);
    }
    public Optional<PaseDeVisita> findUltimoPaseByPacienteId(String pacienteId) {
        return paseDeVisitaRepository.findUltimoByPacienteId(pacienteId);
    }

}