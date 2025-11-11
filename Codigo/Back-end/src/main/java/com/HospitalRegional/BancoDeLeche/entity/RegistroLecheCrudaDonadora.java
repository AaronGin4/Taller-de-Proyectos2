package com.HospitalRegional.BancoDeLeche.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.GenericGenerator;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "Registro_Leche_Cruda_Donadora")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegistroLecheCrudaDonadora {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Id_Leche_Cruda")
    private Long idLecheCruda;

    @Column(name = "Cantidad", nullable = false)
    private Float cantidad;

    @Column(name = "Hora", nullable = false)
    private String hora;

    @Column(name = "Fecha", nullable = false)
    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name = "Id_Donadora", nullable = false)
    private Donadora donadora;


    public Long getIdLecheCruda() {
        return idLecheCruda;
    }

    public void setIdLecheCruda(Long idLecheCruda) {
        this.idLecheCruda = idLecheCruda;
    }

    public Float getCantidad() {
        return cantidad;
    }

    public void setCantidad(Float cantidad) {
        this.cantidad = cantidad;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Donadora getDonadora() {
        return donadora;
    }

    public void setDonadora(Donadora donadora) {
        this.donadora = donadora;
    }
}