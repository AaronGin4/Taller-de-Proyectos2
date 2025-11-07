package com.HospitalRegional.BancoDeLeche.entity;

import org.hibernate.annotations.CacheConcurrencyStrategy;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDate;
@Entity
@Table(name = "Donadora")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Donadora {

    @Id
    @Column(name = "Id_Donadora", length = 20)
    private String idDonadora;

    @Column(name = "Nombre_Donadora", length = 100)
    private String nombreDonadora;

    @Column(name = "Apellido_Paterno_Donadora", length = 100)
    private String apellidoPaternoDonadora;

    @Column(name = "Apellido_Materno_Donadora", length = 100)
    private String apellidoMaternoDonadora;

    @Column(name = "Fecha_Nacimiento_Donadora")
    private LocalDate fechaNacimientoDonadora;

    @Column(name = "Telefono_Donadora", length = 9)
    private String telefonoDonadora;

    @Column(name = "Talla_Donadora")
    private Float tallaDonadora;

    @Column(name = "Departamento", length = 50)
    private String departamento;

    @Column(name = "Provincia", length = 50)
    private String provincia;

    @Column(name = "Distrito", length = 50)
    private String distrito;

    @Column(name = "Direccion_Actual_Donadora", length = 200)
    private String direccionActualDonadora;

    @Column(name = "Centro_Salud_Control_Procedencia", length = 100)
    private String centroSaludControlProcedencia;

    @Column(name = "Numero_Controles")
    private Integer numeroControles;

    @Column(name = "Ocupacion", length = 50)
    private String ocupacion;

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

    @Column(name = "Consentimiento_Donadora")
    private String consentimientoDonadora;

    public String getIdDonadora() {
        return idDonadora;
    }

    public void setIdDonadora(String idDonadora) {
        this.idDonadora = idDonadora;
    }

    public String getNombreDonadora() {
        return nombreDonadora;
    }

    public void setNombreDonadora(String nombreDonadora) {
        this.nombreDonadora = nombreDonadora;
    }

    public String getApellidoPaternoDonadora() {
        return apellidoPaternoDonadora;
    }

    public void setApellidoPaternoDonadora(String apellidoPaternoDonadora) {
        this.apellidoPaternoDonadora = apellidoPaternoDonadora;
    }

    public String getApellidoMaternoDonadora() {
        return apellidoMaternoDonadora;
    }

    public void setApellidoMaternoDonadora(String apellidoMaternoDonadora) {
        this.apellidoMaternoDonadora = apellidoMaternoDonadora;
    }

    public LocalDate getFechaNacimientoDonadora() {
        return fechaNacimientoDonadora;
    }

    public void setFechaNacimientoDonadora(LocalDate fechaNacimientoDonadora) {
        this.fechaNacimientoDonadora = fechaNacimientoDonadora;
    }

    public String getTelefonoDonadora() {
        return telefonoDonadora;
    }

    public void setTelefonoDonadora(String telefonoDonadora) {
        this.telefonoDonadora = telefonoDonadora;
    }

    public Float getTallaDonadora() {
        return tallaDonadora;
    }

    public void setTallaDonadora(Float tallaDonadora) {
        this.tallaDonadora = tallaDonadora;
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

    public String getDireccionActualDonadora() {
        return direccionActualDonadora;
    }

    public void setDireccionActualDonadora(String direccionActualDonadora) {
        this.direccionActualDonadora = direccionActualDonadora;
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

    public String getConsentimientoDonadora() {
        return consentimientoDonadora;
    }

    public void setConsentimientoDonadora(String consentimientoDonadora) {
        this.consentimientoDonadora = consentimientoDonadora;
    }
}
