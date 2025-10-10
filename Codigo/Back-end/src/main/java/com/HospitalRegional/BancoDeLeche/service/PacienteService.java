package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.Paciente;
import com.HospitalRegional.BancoDeLeche.repository.PacienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PacienteService {

    @Autowired
    private PacienteRepository pacienteRepository;



    public List<Paciente> findPacientesByEstado(String estado) {
        return pacienteRepository.findByEstado(estado);
    }


    public Paciente savePaciente(Paciente paciente) {
        return pacienteRepository.save(paciente);
    }

    public Optional<Paciente> getPacienteById(String id) {
        return pacienteRepository.findById(id);
    }

    public List<Paciente> getAllPacientes() {
        return pacienteRepository.findAll();
    }

    public void deletePaciente(String id) {
        pacienteRepository.deleteById(id);
    }
    public Paciente actualizarArea(String idPaciente, String nuevaArea) {
        Optional<Paciente> optionalPaciente = pacienteRepository.findById(idPaciente);
        if (optionalPaciente.isPresent()) {
            Paciente paciente = optionalPaciente.get();
            paciente.setArea(nuevaArea);
            return pacienteRepository.save(paciente);
        } else {
            throw new RuntimeException("Paciente no encontrado con ID: " + idPaciente);
        }
    }

}