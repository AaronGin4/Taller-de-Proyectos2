package com.HospitalRegional.BancoDeLeche.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "cuna")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Cuna {


    @Id
    @Column(name = "Id_Cuna", length = 6, nullable = false)
    private String idCuna;

    @Column(name = "Estado_Cuna", nullable = false)
    private String estadoCuna;


    public String getIdCuna() {
        return idCuna;
    }

    public void setIdCuna(String idCuna) {
        this.idCuna = idCuna;
    }

    public String getEstadoCuna() {
        return estadoCuna;
    }

    public void setEstadoCuna(String estadoCuna) {
        this.estadoCuna = estadoCuna;
    }


}