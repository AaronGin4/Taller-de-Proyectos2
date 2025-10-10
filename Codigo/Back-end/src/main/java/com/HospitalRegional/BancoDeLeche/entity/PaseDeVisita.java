package com.HospitalRegional.BancoDeLeche.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "Pase_de_Visita")
@Data
@NoArgsConstructor
@AllArgsConstructor

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class PaseDeVisita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Pase_Visita")
    private Integer idPaseVisita;

    @Column(name = "Fecha_Dia")
    private LocalDate fechaDia;

    @Column(name = "Llamada_Telefono")
    private String llamadaTelefono;

    @Column(name = "Peso_Dia_Anterior")
    private Float pesoDiaAnterior;

    @Column(name = "Peso_del_Dia")
    private Float pesoDelDia;

    @Column(name = "Delta_Peso")
    private Float deltaPeso;

    @Column(name = "Requerimientos_Kcal", nullable = true)
    private Float requerimientosKcal;

    @Column(name = "Nro_de_Tomas_de_Leche")
    private Integer nroDeTomasDeLeche;

    @Column(name = "Cantidad_ml_Por_Toma_de_Leche")
    private Float cantidadMlPorTomaDeLeche;

    @Column(name = "Tipo_Leche_Requerida")
    private String tipoLecheRequerida;

    @Column(name = "Contenido_Energetico")
    private String contenidoEnergetico;

    @Column(name = "Via_Administracion")
    private String viaAdministracion;

    @Column(name = "Calostroterapia")
    private String calostroterapia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Id_Paciente")
    private Paciente paciente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "Id_Cuna")
    private Cuna cuna;

    public Integer getIdPaseVisita() {
        return idPaseVisita;
    }

    public void setIdPaseVisita(Integer idPaseVisita) {
        this.idPaseVisita = idPaseVisita;
    }

    public LocalDate getFechaDia() {
        return fechaDia;
    }

    public void setFechaDia(LocalDate fechaDia) {
        this.fechaDia = fechaDia;
    }

    public String getLlamadaTelefono() {
        return llamadaTelefono;
    }

    public void setLlamadaTelefono(String llamadaTelefono) {
        this.llamadaTelefono = llamadaTelefono;
    }

    public Float getPesoDiaAnterior() {
        return pesoDiaAnterior;
    }

    public void setPesoDiaAnterior(Float pesoDiaAnterior) {
        this.pesoDiaAnterior = pesoDiaAnterior;
    }

    public Float getPesoDelDia() {
        return pesoDelDia;
    }

    public void setPesoDelDia(Float pesoDelDia) {
        this.pesoDelDia = pesoDelDia;
    }

    public Float getDeltaPeso() {
        return deltaPeso;
    }

    public void setDeltaPeso(Float deltaPeso) {
        this.deltaPeso = deltaPeso;
    }

    public Float getRequerimientosKcal() {
        return requerimientosKcal;
    }

    public void setRequerimientosKcal(Float requerimientosKcal) {
        this.requerimientosKcal = requerimientosKcal;
    }

    public Integer getNroDeTomasDeLeche() {
        return nroDeTomasDeLeche;
    }

    public void setNroDeTomasDeLeche(Integer nroDeTomasDeLeche) {
        this.nroDeTomasDeLeche = nroDeTomasDeLeche;
    }

    public Float getCantidadMlPorTomaDeLeche() {
        return cantidadMlPorTomaDeLeche;
    }

    public void setCantidadMlPorTomaDeLeche(Float cantidadMlPorTomaDeLeche) {
        this.cantidadMlPorTomaDeLeche = cantidadMlPorTomaDeLeche;
    }

    public String getTipoLecheRequerida() {
        return tipoLecheRequerida;
    }

    public void setTipoLecheRequerida(String tipoLecheRequerida) {
        this.tipoLecheRequerida = tipoLecheRequerida;
    }

    public String getContenidoEnergetico() {
        return contenidoEnergetico;
    }

    public void setContenidoEnergetico(String contenidoEnergetico) {
        this.contenidoEnergetico = contenidoEnergetico;
    }

    public String getViaAdministracion() {
        return viaAdministracion;
    }

    public void setViaAdministracion(String viaAdministracion) {
        this.viaAdministracion = viaAdministracion;
    }

    public String getCalostroterapia() {
        return calostroterapia;
    }

    public void setCalostroterapia(String calostroterapia) {
        this.calostroterapia = calostroterapia;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }

    public Cuna getCuna() {
        return cuna;
    }

    public void setCuna(Cuna cuna) {
        this.cuna = cuna;
    }
}
