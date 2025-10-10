package com.HospitalRegional.BancoDeLeche.repository;

import com.HospitalRegional.BancoDeLeche.entity.Paciente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Importar List si aún no está

@Repository
public interface PacienteRepository extends JpaRepository<Paciente, String> {
    List<Paciente> findByEstado(String estado);
}