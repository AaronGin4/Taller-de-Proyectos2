package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.Enfermedad;
import com.HospitalRegional.BancoDeLeche.service.EnfermedadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/enfermedades")
public class EnfermedadController {

    @Autowired
    private EnfermedadService enfermedadService;

    @GetMapping
    public List<Enfermedad> listarTodas() {
        return enfermedadService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Enfermedad> buscarPorId(@PathVariable String id) {
        Optional<Enfermedad> enfermedad = enfermedadService.findById(id);
        return enfermedad.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Enfermedad guardar(@RequestBody Enfermedad enfermedad) {
        return enfermedadService.save(enfermedad);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Enfermedad> actualizar(@PathVariable String id, @RequestBody Enfermedad detallesEnfermedad) {
        try {
            Enfermedad enfermedadActualizada = enfermedadService.actualizar(id, detallesEnfermedad);
            return ResponseEntity.ok(enfermedadActualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        enfermedadService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
