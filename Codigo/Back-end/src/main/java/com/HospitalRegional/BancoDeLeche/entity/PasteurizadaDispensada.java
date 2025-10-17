package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Pasteurizada_Dispensada")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasteurizadaDispensada {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Pasteurizada_Dispensada")
    private Long idPasteurizadaDispensada;

    @Column(name = "Codigo_Leche")
    private String codigoLeche;

    @Column(name = "Tipo_Leche")
    private String tipoLeche;

    @Column(name = "Kcal")
    private Float kcal;

    @Column(name = "Crema")
    private Float crema;

    @Column(name = "Grasa")
    private Float grasa;

    @Column(name = "aDornix")
    private Float aDornix;

    @Column(name = "Contenido_Energetico")
    private String contenidoEnergetico;

    @Column(name = "Cantidad_Dispensada")
    private Float cantidadDispensada;

    @Column(name = "Fecha")
    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "Id_Paciente")
    private Paciente paciente;

    public Long getIdPasteurizadaDispensada() {
        return idPasteurizadaDispensada;
    }

    public void setIdPasteurizadaDispensada(Long idPasteurizadaDispensada) {
        this.idPasteurizadaDispensada = idPasteurizadaDispensada;
    }

    public String getCodigoLeche() {
        return codigoLeche;
    }

    public void setCodigoLeche(String codigoLeche) {
        this.codigoLeche = codigoLeche;
    }

    public String getTipoLeche() {
        return tipoLeche;
    }

    public void setTipoLeche(String tipoLeche) {
        this.tipoLeche = tipoLeche;
    }

    public Float getKcal() {
        return kcal;
    }

    public void setKcal(Float kcal) {
        this.kcal = kcal;
    }

    public Float getCrema() {
        return crema;
    }

    public void setCrema(Float crema) {
        this.crema = crema;
    }

    public Float getGrasa() {
        return grasa;
    }

    public void setGrasa(Float grasa) {
        this.grasa = grasa;
    }

    public Float getaDornix() {
        return aDornix;
    }

    public void setaDornix(Float aDornix) {
        this.aDornix = aDornix;
    }

    public String getContenidoEnergetico() {
        return contenidoEnergetico;
    }

    public void setContenidoEnergetico(String contenidoEnergetico) {
        this.contenidoEnergetico = contenidoEnergetico;
    }

    public Float getCantidadDispensada() {
        return cantidadDispensada;
    }

    public void setCantidadDispensada(Float cantidadDispensada) {
        this.cantidadDispensada = cantidadDispensada;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
}
