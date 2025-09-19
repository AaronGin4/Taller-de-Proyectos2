package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.Usuarios;
import com.HospitalRegional.BancoDeLeche.service.UsuariosService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuariosController {

    private final UsuariosService usuariosService;

    public UsuariosController(UsuariosService usuariosService) {
        this.usuariosService = usuariosService;
    }

    @GetMapping
    public List<Usuarios> getAllUsuarios() {
        return usuariosService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuarios> getUsuarioById(@PathVariable String id) {
        Optional<Usuarios> usuario = usuariosService.findById(id);
        return usuario.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Usuarios createUsuario(@RequestBody Usuarios usuario) {
        return usuariosService.save(usuario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuarios> updateUsuario(@PathVariable String id, @RequestBody Usuarios usuario) {
        if (usuariosService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuariosService.save(usuario));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable String id) {
        if (usuariosService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        usuariosService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
