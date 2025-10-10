package com.HospitalRegional.BancoDeLeche.repository;

import com.HospitalRegional.BancoDeLeche.entity.Paciente;
import com.HospitalRegional.BancoDeLeche.entity.PaseDeVisita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List
import java.util.Optional;

@Repository
public interface PaseDeVisitaRepository extends JpaRepository<PaseDeVisita, Integer> {

    // Método para encontrar pases de visita por el ID del Paciente asociado
    List<PaseDeVisita> findByPaciente_IdPaciente(String idPaciente);
    Optional<PaseDeVisita> findTopByPacienteOrderByIdPaseVisitaDesc(Paciente paciente);

    @Query("SELECT p FROM PaseDeVisita p WHERE p.paciente.idPaciente = :pacienteId ORDER BY p.idPaseVisita DESC LIMIT 1")
    Optional<PaseDeVisita> findUltimoByPacienteId(String pacienteId);
}