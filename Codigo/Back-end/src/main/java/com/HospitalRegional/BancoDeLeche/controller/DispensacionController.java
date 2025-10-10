package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.Dispensacion;
import com.HospitalRegional.BancoDeLeche.service.DispensacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/dispensacion")
public class DispensacionController {

    private final DispensacionService dispensacionService;

    public DispensacionController(DispensacionService dispensacionService) {
        this.dispensacionService = dispensacionService;
    }

    @GetMapping
    public List<Dispensacion> getAllDispensaciones() {
        return dispensacionService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dispensacion> getDispensacionById(@PathVariable Long id) {
        Optional<Dispensacion> dispensacion = dispensacionService.findById(id);
        return dispensacion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/paciente/{pacienteId}")
    public List<Dispensacion> getByPaciente(@PathVariable String pacienteId) {
        return dispensacionService.findByIdPaciente(pacienteId);
    }
    @PostMapping
    public ResponseEntity<Dispensacion> createDispensacion(
            @RequestBody Dispensacion dispensacion) {
        Dispensacion saved = dispensacionService.save(dispensacion);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dispensacion> updateDispensacion(
            @PathVariable Long id,
            @RequestBody Dispensacion dispensacion) {

        Optional<Dispensacion> existingDispensacion = dispensacionService.findById(id);
        if (existingDispensacion.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        if (dispensacion.getIdDispensacion() != null && !dispensacion.getIdDispensacion().equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        dispensacion.setIdDispensacion(id);
        Dispensacion updatedDispensacion = dispensacionService.save(dispensacion);

        return ResponseEntity.ok(updatedDispensacion);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDispensacion(@PathVariable Long id) {
        if (!dispensacionService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        dispensacionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}