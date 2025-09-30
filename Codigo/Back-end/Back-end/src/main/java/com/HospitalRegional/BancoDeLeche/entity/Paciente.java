package com.HospitalRegional.BancoDeLeche.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "paciente")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})

public class Paciente {
    @Id
    @Column(name = "Id_Paciente", length = 20)
    private String idPaciente;

    @Column(name = "Nombre_Paciente")
    private String nombrePaciente;

    @Column(name = "Apellido_Paterno_Paciente")
    private String apellidoPaternoPaciente;

    @Column(name = "Apellido_Materno_Paciente")
    private String apellidoMaternoPaciente;

    @Column(name = "Fecha_Nacimiento_Paciente")
    private LocalDate fechaNacimientoPaciente;

    @Column(name = "Genero_Paciente")
    private String generoPaciente;

    @Column(name = "Peso_Nacimiento_Paciente")
    private Float pesoNacimientoPaciente;

    @Column(name = "Detalle_Peso_Nacimiento_Paciente")
    private String detallePesoNacimientoPaciente;

    @Column(name = "Edad_Gestacional_Paciente")
    private Integer edadGestacionalPaciente;

    @Column(name = "Detalle_Edad_Gestacional_Paciente")
    private String detalleEdadGestacionalPaciente;

    @Column(name = "Area")
    private String area;

    @Column(name = "Estado")
    private String estado;

    @Column(name = "Fecha_Ingreso")
    private String fechaIngreso;

    @Column(name = "Fecha_Salida")
    private String fechaSalida;

    @Column(name ="Dni_Madre")
    private String dniMadre;

    @ManyToOne(fetch = FetchType.EAGER) // Cambiado de LAZY a EAGER
    @JoinColumn(name = "id_cuna")
    private Cuna cuna;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_diagnostico_paciente")
    private DiagnosticoPaciente diagnosticoPaciente;

    public String getFechaIngreso() {
        return fechaIngreso;
    }

    public String getFechaSalida() {
        return fechaSalida;
    }

    public void setFechaSalida(String fechaSalida) {
        this.fechaSalida = fechaSalida;
    }

    public String getDniMadre() {
        return dniMadre;
    }

    public void setDniMadre(String dniMadre) {
        this.dniMadre = dniMadre;
    }

    public void setFechaIngreso(String fechaIngreso) {
        this.fechaIngreso = fechaIngreso;
    }

    public String getIdPaciente() {
        return idPaciente;
    }

    public void setIdPaciente(String idPaciente) {
        this.idPaciente = idPaciente;
    }

    public Cuna getCuna() {
        return cuna;
    }

    public void setCuna(Cuna cuna) {
        this.cuna = cuna;
    }

    public DiagnosticoPaciente getDiagnosticoPaciente() {
        return diagnosticoPaciente;
    }

    public void setDiagnosticoPaciente(DiagnosticoPaciente diagnosticoPaciente) {
        this.diagnosticoPaciente = diagnosticoPaciente;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getDetalleEdadGestacionalPaciente() {
        return detalleEdadGestacionalPaciente;
    }

    public void setDetalleEdadGestacionalPaciente(String detalleEdadGestacionalPaciente) {
        this.detalleEdadGestacionalPaciente = detalleEdadGestacionalPaciente;
    }

    public Integer getEdadGestacionalPaciente() {
        return edadGestacionalPaciente;
    }

    public void setEdadGestacionalPaciente(Integer edadGestacionalPaciente) {
        this.edadGestacionalPaciente = edadGestacionalPaciente;
    }

    public String getDetallePesoNacimientoPaciente() {
        return detallePesoNacimientoPaciente;
    }

    public void setDetallePesoNacimientoPaciente(String detallePesoNacimientoPaciente) {
        this.detallePesoNacimientoPaciente = detallePesoNacimientoPaciente;
    }

    public Float getPesoNacimientoPaciente() {
        return pesoNacimientoPaciente;
    }

    public void setPesoNacimientoPaciente(Float pesoNacimientoPaciente) {
        this.pesoNacimientoPaciente = pesoNacimientoPaciente;
    }

    public String getGeneroPaciente() {
        return generoPaciente;
    }

    public void setGeneroPaciente(String generoPaciente) {
        this.generoPaciente = generoPaciente;
    }

    public LocalDate getFechaNacimientoPaciente() {
        return fechaNacimientoPaciente;
    }

    public void setFechaNacimientoPaciente(LocalDate fechaNacimientoPaciente) {
        this.fechaNacimientoPaciente = fechaNacimientoPaciente;
    }

    public String getApellidoMaternoPaciente() {
        return apellidoMaternoPaciente;
    }

    public void setApellidoMaternoPaciente(String apellidoMaternoPaciente) {
        this.apellidoMaternoPaciente = apellidoMaternoPaciente;
    }

    public String getApellidoPaternoPaciente() {
        return apellidoPaternoPaciente;
    }

    public void setApellidoPaternoPaciente(String apellidoPaternoPaciente) {
        this.apellidoPaternoPaciente = apellidoPaternoPaciente;
    }

    public String getNombrePaciente() {
        return nombrePaciente;
    }

    public void setNombrePaciente(String nombrePaciente) {
        this.nombrePaciente = nombrePaciente;
    }
}