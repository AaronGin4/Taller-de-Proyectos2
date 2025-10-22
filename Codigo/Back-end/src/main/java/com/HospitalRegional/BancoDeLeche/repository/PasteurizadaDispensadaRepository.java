package com.HospitalRegional.BancoDeLeche.repository;
import com.HospitalRegional.BancoDeLeche.entity.PasteurizadaDispensada;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PasteurizadaDispensadaRepository extends JpaRepository<PasteurizadaDispensada, String> {
    List<PasteurizadaDispensada> findByPaciente_IdPaciente(String idPaciente);
}
