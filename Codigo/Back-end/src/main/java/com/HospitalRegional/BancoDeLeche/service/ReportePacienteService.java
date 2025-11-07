package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.ReportePaciente;
import com.HospitalRegional.BancoDeLeche.repository.ReportePacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReportePacienteService {

    @Autowired
    private ReportePacienteRepository reportePacienteRepository;

    public List<ReportePaciente> findAll() {
        return reportePacienteRepository.findAll();
    }

    public Optional<ReportePaciente> findById(String id) {
        return reportePacienteRepository.findById(id);
    }

    public ReportePaciente save(ReportePaciente reportePaciente) {
        return reportePacienteRepository.save(reportePaciente);
    }
    public List<ReportePaciente> findByPacienteId(String idPaciente) {
        return reportePacienteRepository.findByPaciente_IdPaciente(idPaciente);
    }

    public void deleteById(String id) {
        reportePacienteRepository.deleteById(id);
    }
}