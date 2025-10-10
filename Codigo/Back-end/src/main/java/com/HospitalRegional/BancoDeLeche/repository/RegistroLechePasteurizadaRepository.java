package com.HospitalRegional.BancoDeLeche.repository;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLechePasteurizada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroLechePasteurizadaRepository extends JpaRepository<RegistroLechePasteurizada, String> {
}
