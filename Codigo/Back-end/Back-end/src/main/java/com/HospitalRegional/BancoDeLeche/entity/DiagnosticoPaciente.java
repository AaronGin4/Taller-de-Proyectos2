package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "diagnostico_paciente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosticoPaciente {

    @Id
    @Column(name = "Id_Diagnostico_Paciente", length = 20)
    private String idDiagnosticoPaciente;

    @Column(name = "Observacion_Enfermedad")
    private String observacionEnfermedad;

    public String getIdDiagnosticoPaciente() {
        return idDiagnosticoPaciente;
    }

    public void setIdDiagnosticoPaciente(String idDiagnosticoPaciente) {
        this.idDiagnosticoPaciente = idDiagnosticoPaciente;
    }

    public String getObservacionEnfermedad() {
        return observacionEnfermedad;
    }

    public void setObservacionEnfermedad(String observacionEnfermedad) {
        this.observacionEnfermedad = observacionEnfermedad;
    }
}
