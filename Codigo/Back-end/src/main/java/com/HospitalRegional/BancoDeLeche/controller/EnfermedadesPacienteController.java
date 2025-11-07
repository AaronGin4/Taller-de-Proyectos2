package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.EnfermedadesPaciente;
import com.HospitalRegional.BancoDeLeche.service.EnfermedadesPacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/enfermedades-paciente")
public class EnfermedadesPacienteController {

    private final EnfermedadesPacienteService enfermedadesPacienteService;

    @Autowired
    public EnfermedadesPacienteController(EnfermedadesPacienteService enfermedadesPacienteService) {
        this.enfermedadesPacienteService = enfermedadesPacienteService;
    }

    @GetMapping
    public ResponseEntity<List<EnfermedadesPaciente>> obtenerTodas() {
        List<EnfermedadesPaciente> enfermedades = enfermedadesPacienteService.obtenerTodasEnfermedadesPaciente();
        return new ResponseEntity<>(enfermedades, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnfermedadesPaciente> obtenerPorId(@PathVariable String id) {
        Optional<EnfermedadesPaciente> enfermedad = enfermedadesPacienteService.obtenerEnfermedadPacientePorId(id);
        return enfermedad.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<EnfermedadesPaciente> crear(@RequestBody EnfermedadesPaciente enfermedadesPaciente) {
        EnfermedadesPaciente nuevaEnfermedad = enfermedadesPacienteService.guardarEnfermedadPaciente(enfermedadesPaciente);
        return new ResponseEntity<>(nuevaEnfermedad, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnfermedadesPaciente> actualizar(
            @PathVariable String id,
            @RequestBody EnfermedadesPaciente enfermedadesPaciente) {

        if (!enfermedadesPacienteService.existeEnfermedadPaciente(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        enfermedadesPaciente.setIdEnfermedadPaciente(id);
        EnfermedadesPaciente actualizada = enfermedadesPacienteService.guardarEnfermedadPaciente(enfermedadesPaciente);
        return new ResponseEntity<>(actualizada, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable String id) {
        if (!enfermedadesPacienteService.existeEnfermedadPaciente(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        enfermedadesPacienteService.eliminarEnfermedadPaciente(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/where/{idDiagnosticoPaciente}")
    public ResponseEntity<List<EnfermedadesPaciente>> obtenerPorDiagnosticoPaciente(
            @PathVariable String idDiagnosticoPaciente) {

        List<EnfermedadesPaciente> enfermedades = enfermedadesPacienteService
                .obtenerEnfermedadesPorDiagnosticoPaciente(idDiagnosticoPaciente);

        if (enfermedades.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(enfermedades, HttpStatus.OK);
    }
}