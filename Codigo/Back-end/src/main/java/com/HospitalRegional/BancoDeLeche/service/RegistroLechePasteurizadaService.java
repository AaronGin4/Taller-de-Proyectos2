package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLechePasteurizada;
import com.HospitalRegional.BancoDeLeche.repository.RegistroLechePasteurizadaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroLechePasteurizadaService {

    private final RegistroLechePasteurizadaRepository registroLechePasteurizadaRepository;

    public RegistroLechePasteurizadaService(RegistroLechePasteurizadaRepository registroLechePasteurizadaRepository) {
        this.registroLechePasteurizadaRepository = registroLechePasteurizadaRepository;
    }
    public Optional<RegistroLechePasteurizada> findByCodigo(String codigoLeche) {
        return registroLechePasteurizadaRepository.findById(codigoLeche);
    }
    public List<RegistroLechePasteurizada> findAll() {
        return registroLechePasteurizadaRepository.findAll();
    }

    public Optional<RegistroLechePasteurizada> findById(String id) {
        return registroLechePasteurizadaRepository.findById(id);
    }

    public RegistroLechePasteurizada save(RegistroLechePasteurizada registroLechePasteurizada) {
        return registroLechePasteurizadaRepository.save(registroLechePasteurizada);
    }

    public void deleteById(String id) {
        registroLechePasteurizadaRepository.deleteById(id);
    }
}
