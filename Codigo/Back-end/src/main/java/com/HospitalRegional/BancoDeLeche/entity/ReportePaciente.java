package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Reporte_Paciente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReportePaciente {

    @Id
    @Column(name = "Id_Reporte_Paciente", length = 20)
    private String idReportePaciente;

    @Column(name = "Leche_Autologa")
    private Float lecheAutologa;

    @Column(name = "LDM")
    private Float ldm;

    @Column(name = "Leche_Pasteurizada")
    private Float lechePasteurizada;

    @Column(name = "Leche_Formula")
    private Float lecheFormula;

    @Column(name = "Fecha")
    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "Id_Paciente")
    private Paciente paciente;

    public String getIdReportePaciente() {
        return idReportePaciente;
    }

    public void setIdReportePaciente(String idReportePaciente) {
        this.idReportePaciente = idReportePaciente;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Float getLecheFormula() {
        return lecheFormula;
    }

    public void setLecheFormula(Float lecheFormula) {
        this.lecheFormula = lecheFormula;
    }

    public Float getLechePasteurizada() {
        return lechePasteurizada;
    }

    public void setLechePasteurizada(Float lechePasteurizada) {
        this.lechePasteurizada = lechePasteurizada;
    }

    public Float getLdm() {
        return ldm;
    }

    public void setLdm(Float ldm) {
        this.ldm = ldm;
    }

    public Float getLecheAutologa() {
        return lecheAutologa;
    }

    public void setLecheAutologa(Float lecheAutologa) {
        this.lecheAutologa = lecheAutologa;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}