package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.SlotConfig;
import com.HospitalRegional.BancoDeLeche.repository.SlotConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class SlotConfigService {

    private final SlotConfigRepository repository;

    @Autowired
    public SlotConfigService(SlotConfigRepository repository) {
        this.repository = repository;
    }

    public Optional<SlotConfig> findByPatientIdAndFecha(String patientId, LocalDate fecha) {
        return repository.findByPatientIdAndFecha(patientId, fecha);
    }

    public void deleteByPatientIdAndFecha(String patientId, LocalDate fecha) {
        repository.deleteByPatientIdAndFecha(patientId, fecha);
    }
    public SlotConfig save(SlotConfig config) {
        Optional<SlotConfig> existingConfig = repository.findByPatientIdAndFecha(
                config.getPatientId(),
                config.getFecha()
        );

        if (existingConfig.isPresent()) {
            // Actualizar registro existente
            SlotConfig toUpdate = existingConfig.get();
            toUpdate.setConfigData(config.getConfigData());
            return repository.save(toUpdate);
        } else {
            // Crear nuevo registro
            return repository.save(config);
        }
    }
}