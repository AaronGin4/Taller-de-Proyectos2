package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "Registro_Leche_Cruda")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroLecheCruda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Leche_Cruda", length = 20)
    private String idLecheCruda;

    @Column(name = "Cantidad")
    private Float cantidad;

    @Column(name = "Hora")
    private LocalDateTime hora;

    @ManyToOne
    @JoinColumn(name = "Id_Madre", nullable = false)
    private Madre madre;

    public String getIdLecheCruda() {
        return idLecheCruda;
    }

    public void setIdLecheCruda(String idLecheCruda) {
        this.idLecheCruda = idLecheCruda;
    }

    public Madre getMadre() {
        return madre;
    }

    public void setMadre(Madre madre) {
        this.madre = madre;
    }

    public LocalDateTime getHora() {
        return hora;
    }

    public void setHora(LocalDateTime hora) {
        this.hora = hora;
    }

    public Float getCantidad() {
        return cantidad;
    }

    public void setCantidad(Float cantidad) {
        this.cantidad = cantidad;
    }
}
