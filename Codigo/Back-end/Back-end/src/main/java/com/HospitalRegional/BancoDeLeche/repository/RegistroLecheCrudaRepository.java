package com.HospitalRegional.BancoDeLeche.repository;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLecheCruda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegistroLecheCrudaRepository extends JpaRepository<RegistroLecheCruda, String> {
}
