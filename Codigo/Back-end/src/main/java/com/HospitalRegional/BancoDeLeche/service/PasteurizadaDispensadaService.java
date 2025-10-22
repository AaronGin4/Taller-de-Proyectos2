package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.PasteurizadaDispensada;
import com.HospitalRegional.BancoDeLeche.repository.PasteurizadaDispensadaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PasteurizadaDispensadaService {

    @Autowired
    private PasteurizadaDispensadaRepository repository;

    public List<PasteurizadaDispensada> findAll() {
        return repository.findAll();
    }

    public Optional<PasteurizadaDispensada> findById(Long id) {
        return repository.findById(String.valueOf(id));
    }

    public List<PasteurizadaDispensada> findByIdPaciente(String idPaciente) {
        return repository.findByPaciente_IdPaciente(idPaciente);
    }

    public PasteurizadaDispensada save(PasteurizadaDispensada pd) {
        return repository.save(pd);
    }

    public void deleteById(Long id) {
        repository.deleteById(String.valueOf(id));
    }
}
