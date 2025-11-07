package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "enfermedad")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Enfermedad {

    @Id
    @Column(name = "Id_Enfermedad", length = 30)
    private String idEnfermedad;

    @Column(name = "Nombre_Enfermedad", length = 30)
    private String nombreEnfermedad;

    @Column(name = "Categoria_Enfermedad" ,length = 20)
    private  String categoriaEnfermedad;

    public String getIdEnfermedad() {
        return idEnfermedad;
    }

    public void setIdEnfermedad(String idEnfermedad) {
        this.idEnfermedad = idEnfermedad;
    }

    public String getNombreEnfermedad() {
        return nombreEnfermedad;
    }

    public void setNombreEnfermedad(String nombreEnfermedad) {
        this.nombreEnfermedad = nombreEnfermedad;
    }

    public String getCategoriaEnfermedad() {
        return categoriaEnfermedad;
    }

    public void setCategoriaEnfermedad(String categoriaEnfermedad) {
        this.categoriaEnfermedad = categoriaEnfermedad;
    }
}
