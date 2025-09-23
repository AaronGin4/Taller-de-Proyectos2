package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.Cuna;
import com.HospitalRegional.BancoDeLeche.service.CunaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/cunas")
public class CunaController {

    private final CunaService cunaService;

    public CunaController(CunaService cunaService) {
        this.cunaService = cunaService;
    }

    @GetMapping
    public List<Cuna> getAllCunas() {
        return cunaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cuna> getCunaById(@PathVariable String id) {
        Optional<Cuna> cuna = cunaService.findById(id);
        return cuna.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cuna createCuna(@RequestBody Cuna cuna) {
        return cunaService.save(cuna);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cuna> updateCuna(@PathVariable String id, @RequestBody Cuna cuna) {
        if (cunaService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cunaService.save(cuna));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Cuna> updateEstadoCuna(@PathVariable String id, @RequestParam String estado) {
        Cuna cunaActualizada = cunaService.actualizarEstadoCuna(id, estado);
        if (cunaActualizada == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cunaActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuna(@PathVariable String id) {
        if (cunaService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        cunaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}