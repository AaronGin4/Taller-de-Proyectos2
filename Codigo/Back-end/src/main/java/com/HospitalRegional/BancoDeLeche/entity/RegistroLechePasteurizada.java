package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Registro_Leche_Pasteurizada")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroLechePasteurizada {

    @Id
    @Column(name = "Codigo_Leche", length = 20)
    private String codigoLeche;

    @Column(name = "Tipo_Leche")
    private String tipoLeche;

    @Column(name = "Cantidad_Leche")
    private Float cantidadLeche;

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

    public Float getCantidadLeche() {
        return cantidadLeche;
    }

    public void setCantidadLeche(Float cantidadLeche) {
        this.cantidadLeche = cantidadLeche;
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
}
