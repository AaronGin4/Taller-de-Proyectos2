package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.Usuarios;
import com.HospitalRegional.BancoDeLeche.service.UsuariosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuariosService usuariosService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuarios loginRequest) {
        Optional<Usuarios> usuario = usuariosService.autenticarUsuario(loginRequest.getUsuario(), loginRequest.getContrasena());

        if (usuario.isPresent()) {
            return ResponseEntity.ok().body(usuario.get()); // Devuelve el objeto con permisos
        } else {
            return ResponseEntity.status(401).body("{\"message\": \"Credenciales inválidas\"}");
        }
    }
}