package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Enfermedades_Paciente")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnfermedadesPaciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Enfermedad_Paciente", length = 20)
    private String idEnfermedadPaciente;

    @ManyToOne
    @JoinColumn(name = "Id_Diagnostico_Paciente")
    private DiagnosticoPaciente diagnosticoPaciente;

    @ManyToOne
    @JoinColumn(name = "Id_Enfermedad")
    private Enfermedad enfermedad;

    public String getIdEnfermedadPaciente() {
        return idEnfermedadPaciente;
    }

    public void setIdEnfermedadPaciente(String idEnfermedadPaciente) {
        this.idEnfermedadPaciente = idEnfermedadPaciente;
    }

    public DiagnosticoPaciente getDiagnosticoPaciente() {
        return diagnosticoPaciente;
    }

    public void setDiagnosticoPaciente(DiagnosticoPaciente diagnosticoPaciente) {
        this.diagnosticoPaciente = diagnosticoPaciente;
    }

    public Enfermedad getEnfermedad() {
        return enfermedad;
    }

    public void setEnfermedad(Enfermedad enfermedad) {
        this.enfermedad = enfermedad;
    }
}