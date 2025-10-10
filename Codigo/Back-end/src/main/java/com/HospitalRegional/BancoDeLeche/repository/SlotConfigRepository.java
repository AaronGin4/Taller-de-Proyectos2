package com.HospitalRegional.BancoDeLeche.repository;

import com.HospitalRegional.BancoDeLeche.entity.SlotConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.Optional;

public interface SlotConfigRepository extends JpaRepository<SlotConfig, Long> {
    Optional<SlotConfig> findByPatientIdAndFecha(String patientId, LocalDate fecha);

    void deleteByPatientIdAndFecha(String patientId, LocalDate fecha);
}