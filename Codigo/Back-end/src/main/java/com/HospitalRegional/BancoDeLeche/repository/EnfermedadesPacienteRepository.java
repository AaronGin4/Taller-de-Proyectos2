package com.HospitalRegional.BancoDeLeche.repository;

import com.HospitalRegional.BancoDeLeche.entity.EnfermedadesPaciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnfermedadesPacienteRepository extends JpaRepository<EnfermedadesPaciente, String> {
    List<EnfermedadesPaciente> findByDiagnosticoPacienteIdDiagnosticoPaciente(String idDiagnosticoPaciente);
}