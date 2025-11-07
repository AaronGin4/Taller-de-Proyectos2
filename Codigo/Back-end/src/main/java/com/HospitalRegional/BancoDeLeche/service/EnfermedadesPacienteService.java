package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.EnfermedadesPaciente;
import com.HospitalRegional.BancoDeLeche.repository.EnfermedadesPacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnfermedadesPacienteService {

    private final EnfermedadesPacienteRepository enfermedadesPacienteRepository;

    @Autowired
    public EnfermedadesPacienteService(EnfermedadesPacienteRepository enfermedadesPacienteRepository) {
        this.enfermedadesPacienteRepository = enfermedadesPacienteRepository;
    }

    public List<EnfermedadesPaciente> obtenerTodasEnfermedadesPaciente() {
        return enfermedadesPacienteRepository.findAll();
    }

    public Optional<EnfermedadesPaciente> obtenerEnfermedadPacientePorId(String id) {
        return enfermedadesPacienteRepository.findById(id);
    }

    public EnfermedadesPaciente guardarEnfermedadPaciente(EnfermedadesPaciente enfermedadesPaciente) {
        return enfermedadesPacienteRepository.save(enfermedadesPaciente);
    }

    public void eliminarEnfermedadPaciente(String id) {
        enfermedadesPacienteRepository.deleteById(id);
    }

    public boolean existeEnfermedadPaciente(String id) {
        return enfermedadesPacienteRepository.existsById(id);
    }

    public List<EnfermedadesPaciente> obtenerEnfermedadesPorDiagnosticoPaciente(String idDiagnosticoPaciente) {
        return enfermedadesPacienteRepository.findByDiagnosticoPacienteIdDiagnosticoPaciente(idDiagnosticoPaciente);
    }
}