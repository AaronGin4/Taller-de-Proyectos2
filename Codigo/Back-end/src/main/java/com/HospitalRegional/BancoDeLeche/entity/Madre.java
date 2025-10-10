package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "madre")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Madre {

    @Id
    @Column(name = "Id_Madre", length = 20, nullable = false)
    private String idMadre;

    @Column(name = "Nombre_Madre", length = 100)
    private String nombreMadre;

    @Column(name = "Apellido_Paterno_Madre", length = 100)
    private String apellidoPaternoMadre;

    @Column(name = "Apellido_Materno_Madre", length = 100)
    private String apellidoMaternoMadre;

    @Column(name = "Fecha_Nacimiento_Madre")
    private LocalDate fechaNacimientoMadre;

    @Column(name = "Telefono_Madre", length = 9)
    private String telefonoMadre;

    @Column(name = "Talla_Madre")
    private Float tallaMadre;

    @Column(name = "Departamento", length = 50)
    private String departamento;

    @Column(name = "Provincia", length = 50)
    private String provincia;

    @Column(name = "Distrito", length = 50)
    private String distrito;

    @Column(name = "Direccion_Actual_Madre", length = 200)
    private String direccionActualMadre;

    @Column(name = "Centro_Salud_Control_Procedencia", length = 100)
    private String centroSaludControlProcedencia;

    @Column(name = "Numero_Controles")
    private Integer numeroControles;

    @Column(name = "Ocupacion", length = 50)
    private String ocupacion;

    @Column(name = "Peso_Inicial_Madre_Gestante")
    private Float pesoInicialMadreGestante;

    @Column(name = "Peso_Final_Madre_Gestante")
    private Float pesoFinalMadreGestante;


    @Column(name = "Transfusion_Sangre_Madre")
    private String transfusionSangreMadre;

    @Column(name = "Consumo_Cigarros")
    private String consumoCigarros;

    @Column(name = "Consumo_Drogas")
    private String consumoDrogas;

    @Column(name = "Consumo_Medicamentos")
    private String consumoMedicamentos;

    @Column(name = "Enfermedades")
    private String enfermedades;

    @Column(name = "Prueba_Serologicos")
    private String pruebaSerologicos;

    @Column(name = "Prueba_Sifilis")
    private String pruebaSifilis;

    @Column(name = "Prueba_Hepatitis")
    private String pruebaHepatitis;

    @Column(name = "Prueba_VIH")
    private String pruebaVIH;

    @Column(name = "Examen_Hemoglobina")
    private String examenHemoglobina;

    @Column(name = "Enfermedad_Actual", columnDefinition = "TEXT")
    private String enfermedadActual;

    @Column(name = "Donar_Leche")
    private String donarLeche;

    @Column(name = "Apta_Para_Donar")
    private String aptaParaDonar;

    @Column(name = "Menor_de_Edad")
    private String menorDeEdad;

    @Column(name = "Consentimiento_Madre")
    private String consentimientoMadre;


    @ManyToOne
    @JoinColumn(name = "Id_Paciente")
    private Paciente paciente;

    public String getIdMadre() {
        return idMadre;
    }

    public void setIdMadre(String idMadre) {
        this.idMadre = idMadre;
    }

    public String getApellidoPaternoMadre() {
        return apellidoPaternoMadre;
    }

    public void setApellidoPaternoMadre(String apellidoPaternoMadre) {
        this.apellidoPaternoMadre = apellidoPaternoMadre;
    }

    public String getNombreMadre() {
        return nombreMadre;
    }

    public void setNombreMadre(String nombreMadre) {
        this.nombreMadre = nombreMadre;
    }

    public String getApellidoMaternoMadre() {
        return apellidoMaternoMadre;
    }

    public void setApellidoMaternoMadre(String apellidoMaternoMadre) {
        this.apellidoMaternoMadre = apellidoMaternoMadre;
    }

    public LocalDate getFechaNacimientoMadre() {
        return fechaNacimientoMadre;
    }

    public void setFechaNacimientoMadre(LocalDate fechaNacimientoMadre) {
        this.fechaNacimientoMadre = fechaNacimientoMadre;
    }

    public String getTelefonoMadre() {
        return telefonoMadre;
    }

    public void setTelefonoMadre(String telefonoMadre) {
        this.telefonoMadre = telefonoMadre;
    }

    public Float getTallaMadre() {
        return tallaMadre;
    }

    public void setTallaMadre(Float tallaMadre) {
        this.tallaMadre = tallaMadre;
    }

    public String getDepartamento() {
        return departamento;
    }

    public void setDepartamento(String departamento) {
        this.departamento = departamento;
    }

    public String getProvincia() {
        return provincia;
    }

    public void setProvincia(String provincia) {
        this.provincia = provincia;
    }

    public String getDistrito() {
        return distrito;
    }

    public void setDistrito(String distrito) {
        this.distrito = distrito;
    }

    public String getDireccionActualMadre() {
        return direccionActualMadre;
    }

    public void setDireccionActualMadre(String direccionActualMadre) {
        this.direccionActualMadre = direccionActualMadre;
    }

    public String getCentroSaludControlProcedencia() {
        return centroSaludControlProcedencia;
    }

    public void setCentroSaludControlProcedencia(String centroSaludControlProcedencia) {
        this.centroSaludControlProcedencia = centroSaludControlProcedencia;
    }

    public Integer getNumeroControles() {
        return numeroControles;
    }

    public void setNumeroControles(Integer numeroControles) {
        this.numeroControles = numeroControles;
    }

    public String getOcupacion() {
        return ocupacion;
    }

    public void setOcupacion(String ocupacion) {
        this.ocupacion = ocupacion;
    }

    public Float getPesoInicialMadreGestante() {
        return pesoInicialMadreGestante;
    }

    public void setPesoInicialMadreGestante(Float pesoInicialMadreGestante) {
        this.pesoInicialMadreGestante = pesoInicialMadreGestante;
    }

    public Float getPesoFinalMadreGestante() {
        return pesoFinalMadreGestante;
    }

    public void setPesoFinalMadreGestante(Float pesoFinalMadreGestante) {
        this.pesoFinalMadreGestante = pesoFinalMadreGestante;
    }

    public String getTransfusionSangreMadre() {
        return transfusionSangreMadre;
    }

    public void setTransfusionSangreMadre(String transfusionSangreMadre) {
        this.transfusionSangreMadre = transfusionSangreMadre;
    }

    public String getConsumoCigarros() {
        return consumoCigarros;
    }

    public void setConsumoCigarros(String consumoCigarros) {
        this.consumoCigarros = consumoCigarros;
    }

    public String getConsumoDrogas() {
        return consumoDrogas;
    }

    public void setConsumoDrogas(String consumoDrogas) {
        this.consumoDrogas = consumoDrogas;
    }

    public String getConsumoMedicamentos() {
        return consumoMedicamentos;
    }

    public void setConsumoMedicamentos(String consumoMedicamentos) {
        this.consumoMedicamentos = consumoMedicamentos;
    }

    public String getEnfermedades() {
        return enfermedades;
    }

    public void setEnfermedades(String enfermedades) {
        this.enfermedades = enfermedades;
    }

    public String getPruebaSerologicos() {
        return pruebaSerologicos;
    }

    public void setPruebaSerologicos(String pruebaSerologicos) {
        this.pruebaSerologicos = pruebaSerologicos;
    }

    public String getPruebaSifilis() {
        return pruebaSifilis;
    }

    public void setPruebaSifilis(String pruebaSifilis) {
        this.pruebaSifilis = pruebaSifilis;
    }

    public String getPruebaHepatitis() {
        return pruebaHepatitis;
    }

    public void setPruebaHepatitis(String pruebaHepatitis) {
        this.pruebaHepatitis = pruebaHepatitis;
    }

    public String getPruebaVIH() {
        return pruebaVIH;
    }

    public void setPruebaVIH(String pruebaVIH) {
        this.pruebaVIH = pruebaVIH;
    }

    public String getExamenHemoglobina() {
        return examenHemoglobina;
    }

    public void setExamenHemoglobina(String examenHemoglobina) {
        this.examenHemoglobina = examenHemoglobina;
    }

    public String getEnfermedadActual() {
        return enfermedadActual;
    }

    public void setEnfermedadActual(String enfermedadActual) {
        this.enfermedadActual = enfermedadActual;
    }

    public String getDonarLeche() {
        return donarLeche;
    }

    public void setDonarLeche(String donarLeche) {
        this.donarLeche = donarLeche;
    }

    public String getAptaParaDonar() {
        return aptaParaDonar;
    }

    public void setAptaParaDonar(String aptaParaDonar) {
        this.aptaParaDonar = aptaParaDonar;
    }

    public String getMenorDeEdad() {
        return menorDeEdad;
    }

    public void setMenorDeEdad(String menorDeEdad) {
        this.menorDeEdad = menorDeEdad;
    }

    public String getConsentimientoMadre() {
        return consentimientoMadre;
    }

    public void setConsentimientoMadre(String consentimientoMadre) {
        this.consentimientoMadre = consentimientoMadre;
    }

    public Paciente getPaciente() {
        return paciente;
    }

    public void setPaciente(Paciente paciente) {
        this.paciente = paciente;
    }
}