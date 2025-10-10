package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.DiagnosticoPaciente;
import com.HospitalRegional.BancoDeLeche.repository.DiagnosticoPacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiagnosticoPacienteService {

    @Autowired
    private DiagnosticoPacienteRepository diagnosticoPacienteRepository;

    public List<DiagnosticoPaciente> findAll() {
        return diagnosticoPacienteRepository.findAll();
    }

    public Optional<DiagnosticoPaciente> findById(String id) {
        return diagnosticoPacienteRepository.findById(id);
    }

    public DiagnosticoPaciente save(DiagnosticoPaciente diagnosticoPaciente) {
        return diagnosticoPacienteRepository.save(diagnosticoPaciente);
    }

    public void deleteById(String id) {
        diagnosticoPacienteRepository.deleteById(id);
    }
}