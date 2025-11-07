package com.HospitalRegional.BancoDeLeche.repository;

import com.HospitalRegional.BancoDeLeche.entity.Donadora;
import com.HospitalRegional.BancoDeLeche.entity.Donadora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DonadoraRepository extends JpaRepository<Donadora, String> {
}
