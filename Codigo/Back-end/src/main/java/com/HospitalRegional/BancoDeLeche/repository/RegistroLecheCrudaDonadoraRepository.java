package com.HospitalRegional.BancoDeLeche.repository;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLecheCrudaDonadora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistroLecheCrudaDonadoraRepository extends JpaRepository<RegistroLecheCrudaDonadora, Long> {
    List<RegistroLecheCrudaDonadora> findByDonadoraIdDonadora(String idDonadora);

}