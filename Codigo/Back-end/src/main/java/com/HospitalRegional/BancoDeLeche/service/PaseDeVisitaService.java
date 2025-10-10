package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.PaseDeVisita;
import com.HospitalRegional.BancoDeLeche.repository.PaseDeVisitaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Servicio para la lógica de negocio de PaseDeVisita
@Service
public class PaseDeVisitaService {

    // Inyección de dependencia del repositorio
    @Autowired
    private PaseDeVisitaRepository paseDeVisitaRepository;

    // Nuevo método para encontrar pases de visita por el ID del Paciente
    public List<PaseDeVisita> findPasesDeVisitaByPacienteId(String idPaciente) {
        return paseDeVisitaRepository.findByPaciente_IdPaciente(idPaciente);
    }

    // Guarda un nuevo pase de visita o actualiza uno existente
    public PaseDeVisita savePaseDeVisita(PaseDeVisita paseDeVisita) {
        // Aquí puedes agregar lógica de negocio antes de guardar
        return paseDeVisitaRepository.save(paseDeVisita);
    }

    // Obtiene un pase de visita por su ID
    public Optional<PaseDeVisita> getPaseDeVisitaById(Integer id) {
        return paseDeVisitaRepository.findById(id);
    }

    // Obtiene todos los pases de visita
    public List<PaseDeVisita> getAllPasesDeVisita() {
        return paseDeVisitaRepository.findAll();
    }

    // Elimina un pase de visita por su ID
    public void deletePaseDeVisita(Integer id) {
        // Aquí puedes agregar lógica de negocio antes de eliminar
        paseDeVisitaRepository.deleteById(id);
    }
    public Optional<PaseDeVisita> findUltimoPaseByPacienteId(String pacienteId) {
        return paseDeVisitaRepository.findUltimoByPacienteId(pacienteId);
    }
    // Puedes añadir aquí otros métodos de negocio si los necesitas
    // Ejemplo: List<PaseDeVisita> findPasesByFecha(LocalDate fecha);
}