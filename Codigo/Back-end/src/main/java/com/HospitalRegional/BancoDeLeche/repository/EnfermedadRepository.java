package com.HospitalRegional.BancoDeLeche.repository;
import com.HospitalRegional.BancoDeLeche.entity.Enfermedad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnfermedadRepository extends JpaRepository<Enfermedad, String> {
}