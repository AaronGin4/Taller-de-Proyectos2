package com.HospitalRegional.BancoDeLeche.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "Dispensacion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dispensacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Dispensacion")
    private Long idDispensacion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Id_Pase_Visita", referencedColumnName = "Id_Pase_Visita")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private PaseDeVisita paseDeVisita;

    @Column(name = "Id_Paciente", length = 20)
    private String idPaciente;

    @Column(name = "Toma_1", columnDefinition = "ENUM('Si','No')")
    private String toma1;

    @Column(name = "Toma_2", columnDefinition = "ENUM('Si','No')")
    private String toma2;

    @Column(name = "Toma_3", columnDefinition = "ENUM('Si','No')")
    private String toma3;

    @Column(name = "Toma_4", columnDefinition = "ENUM('Si','No')")
    private String toma4;

    @Column(name = "Toma_5", columnDefinition = "ENUM('Si','No')")
    private String toma5;

    @Column(name = "Toma_6", columnDefinition = "ENUM('Si','No')")
    private String toma6;

    @Column(name = "Toma_7", columnDefinition = "ENUM('Si','No')")
    private String toma7;

    @Column(name = "Toma_8", columnDefinition = "ENUM('Si','No')")
    private String toma8;

    @Column(name = "Toma_9", columnDefinition = "ENUM('Si','No')")
    private String toma9;

    @Column(name = "Toma_10", columnDefinition = "ENUM('Si','No')")
    private String toma10;

    @Column(name = "Toma_11", columnDefinition = "ENUM('Si','No')")
    private String toma11;

    @Column(name = "Toma_12", columnDefinition = "ENUM('Si','No')")
    private String toma12;

    public String getToma15() {
        return toma15;
    }

    public void setToma15(String toma15) {
        this.toma15 = toma15;
    }

    public String getToma14() {
        return toma14;
    }

    public void setToma14(String toma14) {
        this.toma14 = toma14;
    }

    public String getToma13() {
        return toma13;
    }

    public void setToma13(String toma13) {
        this.toma13 = toma13;
    }

    public String getToma16() {
        return toma16;
    }

    public void setToma16(String toma16) {
        this.toma16 = toma16;
    }

    @Column(name = "Toma_13", columnDefinition = "ENUM('Si','No')")
    private String toma13;
    @Column(name = "Toma_14", columnDefinition = "ENUM('Si','No')")
    private String toma14;
    @Column(name = "Toma_15", columnDefinition = "ENUM('Si','No')")
    private String toma15;
    @Column(name = "Toma_16", columnDefinition = "ENUM('Si','No')")
    private String toma16;

    @Column(name = "Leche_Pasteurizada", columnDefinition = "ENUM('Si','No')")
    private String lechePasteurizada;

    @Column(name = "LDM", columnDefinition = "ENUM('Si','No')")
    private String ldm;

    @Column(name = "Leche_autologa_formula", columnDefinition = "ENUM('Si','No')")
    private String lecheAutologaFormula;

    @Column(name = "Leche_Formula_termino", columnDefinition = "ENUM('Si','No')")
    private String lecheFormulaTermino;

    @Column(name = "Leche_autologa_pasteurizada", columnDefinition = "ENUM('Si','No')")
    private String lecheAutologaPasteurizada;

    @Column(name = "Leche_autologa", columnDefinition = "ENUM('Si','No')")
    private String lecheAutologa;

    @Column(name = "Leche_pasteurizada_formula", columnDefinition = "ENUM('Si','No')")
    private String lechePasteurizadaFormula;

    @Column(name = "Leche_Formula_pretermino", columnDefinition = "ENUM('Si','No')")
    private String lecheFormulaPretermino;

    @Column(name = "Fecha", columnDefinition = "DATE")
    private LocalDate fecha;

    public PaseDeVisita getPaseDeVisita() {
        return paseDeVisita;
    }

    public void setPaseDeVisita(PaseDeVisita paseDeVisita) {
        this.paseDeVisita = paseDeVisita;
    }

    public Long getIdDispensacion() {
        return idDispensacion;
    }

    public void setIdDispensacion(Long idDispensacion) {
        this.idDispensacion = idDispensacion;
    }

    public String getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(String idPaciente) {
        this.idPaciente = idPaciente;
    }

    public String getToma1() {
        return toma1;
    }

    public void setToma1(String toma1) {
        this.toma1 = toma1;
    }

    public String getToma2() {
        return toma2;
    }

    public void setToma2(String toma2) {
        this.toma2 = toma2;
    }

    public String getToma3() {
        return toma3;
    }

    public void setToma3(String toma3) {
        this.toma3 = toma3;
    }

    public String getToma4() {
        return toma4;
    }

    public void setToma4(String toma4) {
        this.toma4 = toma4;
    }

    public String getToma5() {
        return toma5;
    }

    public void setToma5(String toma5) {
        this.toma5 = toma5;
    }

    public String getToma6() {
        return toma6;
    }

    public void setToma6(String toma6) {
        this.toma6 = toma6;
    }

    public String getToma7() {
        return toma7;
    }

    public void setToma7(String toma7) {
        this.toma7 = toma7;
    }

    public String getLdm() {
        return ldm;
    }

    public void setLdm(String ldm) {
        this.ldm = ldm;
    }

    public String getLechePasteurizada() {
        return lechePasteurizada;
    }

    public void setLechePasteurizada(String lechePasteurizada) {
        this.lechePasteurizada = lechePasteurizada;
    }

    public String getToma12() {
        return toma12;
    }

    public void setToma12(String toma12) {
        this.toma12 = toma12;
    }

    public String getToma11() {
        return toma11;
    }

    public void setToma11(String toma11) {
        this.toma11 = toma11;
    }

    public String getToma10() {
        return toma10;
    }

    public void setToma10(String toma10) {
        this.toma10 = toma10;
    }

    public String getToma9() {
        return toma9;
    }

    public void setToma9(String toma9) {
        this.toma9 = toma9;
    }

    public String getToma8() {
        return toma8;
    }

    public void setToma8(String toma8) {
        this.toma8 = toma8;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public String getLecheFormulaPretermino() {
        return lecheFormulaPretermino;
    }

    public void setLecheFormulaPretermino(String lecheFormulaPretermino) {
        this.lecheFormulaPretermino = lecheFormulaPretermino;
    }

    public String getLechePasteurizadaFormula() {
        return lechePasteurizadaFormula;
    }

    public void setLechePasteurizadaFormula(String lechePasteurizadaFormula) {
        this.lechePasteurizadaFormula = lechePasteurizadaFormula;
    }

    public String getLecheAutologa() {
        return lecheAutologa;
    }

    public void setLecheAutologa(String lecheAutologa) {
        this.lecheAutologa = lecheAutologa;
    }

    public String getLecheAutologaPasteurizada() {
        return lecheAutologaPasteurizada;
    }

    public void setLecheAutologaPasteurizada(String lecheAutologaPasteurizada) {
        this.lecheAutologaPasteurizada = lecheAutologaPasteurizada;
    }

    public String getLecheFormulaTermino() {
        return lecheFormulaTermino;
    }

    public void setLecheFormulaTermino(String lecheFormulaTermino) {
        this.lecheFormulaTermino = lecheFormulaTermino;
    }

    public String getLecheAutologaFormula() {
        return lecheAutologaFormula;
    }

    public void setLecheAutologaFormula(String lecheAutologaFormula) {
        this.lecheAutologaFormula = lecheAutologaFormula;
    }
}
