package com.HospitalRegional.BancoDeLeche.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuarios {

    @Id
    @Column(name = "Id_Usuario", length = 20)
    private String idUsuario;

    @Column(name = "Profesion", length = 30)
    private String profesion;

    @Column(name = "Nombres", length = 50)
    private String nombres;

    @Column(name = "Apellidos", length = 50)
    private String apellidos;

    @Column(name = "Usuario", length = 10)
    private String usuario;

    @Column(name = "Contrasena")
    private String contrasena;

    @Enumerated(EnumType.STRING)
    @Column(name = "Acceso_HC")
    private Acceso accesoHC;

    @Enumerated(EnumType.STRING)
    @Column(name = "Acceso_PV")
    private Acceso accesoPV;

    @Enumerated(EnumType.STRING)
    @Column(name = "Acceso_Almacen")
    private Acceso accesoAlmacen;

    @Enumerated(EnumType.STRING)
    @Column(name = "Acceso_Reportes")
    private Acceso accesoReportes;

    @Enumerated(EnumType.STRING)
    @Column(name = "Acceso_Donantes")
    private Acceso accesoDonantes;

    @Enumerated(EnumType.STRING)
    @Column(name = "Administrador")
    private Acceso administrador;


    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Acceso getAccesoDonantes() {
        return accesoDonantes;
    }

    public void setAccesoDonantes(Acceso accesoDonantes) {
        this.accesoDonantes = accesoDonantes;
    }

    public Acceso getAccesoReportes() {
        return accesoReportes;
    }

    public void setAccesoReportes(Acceso accesoReportes) {
        this.accesoReportes = accesoReportes;
    }

    public Acceso getAccesoAlmacen() {
        return accesoAlmacen;
    }

    public void setAccesoAlmacen(Acceso accesoAlmacen) {
        this.accesoAlmacen = accesoAlmacen;
    }

    public Acceso getAccesoPV() {
        return accesoPV;
    }

    public void setAccesoPV(Acceso accesoPV) {
        this.accesoPV = accesoPV;
    }

    public Acceso getAccesoHC() {
        return accesoHC;
    }

    public void setAccesoHC(Acceso accesoHC) {
        this.accesoHC = accesoHC;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getApellidos() {
        return apellidos;
    }

    public void setApellidos(String apellidos) {
        this.apellidos = apellidos;
    }

    public String getNombres() {
        return nombres;
    }

    public void setNombres(String nombres) {
        this.nombres = nombres;
    }

    public Acceso getAdministrador() {
        return administrador;
    }

    public void setAdministrador(Acceso administrador) {
        this.administrador = administrador;
    }

    public String getProfesion() {
        return profesion;
    }

    public void setProfesion(String profesion) {
        this.profesion = profesion;
    }

    public enum Acceso {
        Si, No
    }
}
