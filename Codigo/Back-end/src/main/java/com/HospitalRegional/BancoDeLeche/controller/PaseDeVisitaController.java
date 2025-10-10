package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.PaseDeVisita;
import com.HospitalRegional.BancoDeLeche.service.PaseDeVisitaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin
@RestController
@RequestMapping("/paseDeVisita")
public class PaseDeVisitaController {

    private final PaseDeVisitaService paseDeVisitaService; // Declaración correcta

    @Autowired
    public PaseDeVisitaController(PaseDeVisitaService paseDeVisitaService) {
        this.paseDeVisitaService = paseDeVisitaService;
    }

    // Endpoint para crear un nuevo pase de visita
    // POST /api/pases-de-visita
    @PostMapping
    public ResponseEntity<PaseDeVisita> createPaseDeVisita(@RequestBody PaseDeVisita paseDeVisita) {
        PaseDeVisita savedPaseDeVisita = paseDeVisitaService.savePaseDeVisita(paseDeVisita); // Llamada correcta
        return new ResponseEntity<>(savedPaseDeVisita, HttpStatus.CREATED);
    }

    // Endpoint para obtener un pase de visita por su ID
    // GET /api/pases-de-visita/{id}
    @GetMapping("/{id}")
    public ResponseEntity<PaseDeVisita> getPaseDeVisitaById(@PathVariable Integer id) {
        Optional<PaseDeVisita> paseDeVisita = paseDeVisitaService.getPaseDeVisitaById(id); // Llamada correcta
        return paseDeVisita.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    // Endpoint para obtener pases por paciente
    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<PaseDeVisita>> getByPacienteId(
            @PathVariable String pacienteId
    ) {
        List<PaseDeVisita> pases = paseDeVisitaService.findPasesDeVisitaByPacienteId(pacienteId);
        return ResponseEntity.ok(pases);
    }
    @GetMapping("/ultimo/{pacienteId}")
    public ResponseEntity<PaseDeVisita> getUltimoPaseByPacienteId(@PathVariable String pacienteId) {
        Optional<PaseDeVisita> pase = paseDeVisitaService.findUltimoPaseByPacienteId(pacienteId);
        return pase.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    // Endpoint para obtener todos los pases de visita
    // GET /api/pases-de-visita
    @GetMapping
    public ResponseEntity<List<PaseDeVisita>> getAllPasesDeVisita() {
        // CORREGIDO: Se usa paseDeVisitaService en lugar de paseDeDeVisitaService
        List<PaseDeVisita> pasesDeVisita = paseDeVisitaService.getAllPasesDeVisita();
        return ResponseEntity.ok(pasesDeVisita);
    }

    // Endpoint para actualizar un pase de visita existente
    // PUT /api/pases-de-visita/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PaseDeVisita> updatePaseDeVisita(@PathVariable Integer id, @RequestBody PaseDeVisita paseDeVisitaDetails) {
        // CORREGIDO: Se usa paseDeVisitaService en lugar de paseDeDeVisitaService
        Optional<PaseDeVisita> optionalPaseDeVisita = paseDeVisitaService.getPaseDeVisitaById(id);

        if (optionalPaseDeVisita.isPresent()) {
            PaseDeVisita existingPaseDeVisita = optionalPaseDeVisita.get();

            existingPaseDeVisita.setFechaDia(paseDeVisitaDetails.getFechaDia());
            existingPaseDeVisita.setLlamadaTelefono(paseDeVisitaDetails.getLlamadaTelefono());
            existingPaseDeVisita.setPesoDiaAnterior(paseDeVisitaDetails.getPesoDiaAnterior());
            existingPaseDeVisita.setPesoDelDia(paseDeVisitaDetails.getPesoDelDia());
            existingPaseDeVisita.setDeltaPeso(paseDeVisitaDetails.getDeltaPeso());
            existingPaseDeVisita.setRequerimientosKcal(paseDeVisitaDetails.getRequerimientosKcal());
            existingPaseDeVisita.setNroDeTomasDeLeche(paseDeVisitaDetails.getNroDeTomasDeLeche());
            existingPaseDeVisita.setCantidadMlPorTomaDeLeche(paseDeVisitaDetails.getCantidadMlPorTomaDeLeche());
            existingPaseDeVisita.setTipoLecheRequerida(paseDeVisitaDetails.getTipoLecheRequerida());
            existingPaseDeVisita.setContenidoEnergetico(paseDeVisitaDetails.getContenidoEnergetico());
            existingPaseDeVisita.setViaAdministracion(paseDeVisitaDetails.getViaAdministracion());
            existingPaseDeVisita.setCalostroterapia(paseDeVisitaDetails.getCalostroterapia());
            existingPaseDeVisita.setPaciente(paseDeVisitaDetails.getPaciente());
            existingPaseDeVisita.setCuna(paseDeVisitaDetails.getCuna());

            // CORREGIDO: Se usa paseDeVisitaService en lugar de paseDeDeVisitaService
            PaseDeVisita updatedPaseDeVisita = paseDeVisitaService.savePaseDeVisita(existingPaseDeVisita);
            return ResponseEntity.ok(updatedPaseDeVisita);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para eliminar un pase de visita por su ID
    // DELETE /api/pases-de-visita/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaseDeVisita(@PathVariable Integer id) {
        // CORREGIDO: Se usa paseDeVisitaService en lugar de paseDeDeVisitaService
        Optional<PaseDeVisita> optionalPaseDeVisita = paseDeVisitaService.getPaseDeVisitaById(id);

        if (optionalPaseDeVisita.isPresent()) {
            // CORREGIDO: Se usa paseDeVisitaService en lugar de paseDeDeVisitaService
            paseDeVisitaService.deletePaseDeVisita(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para obtener pases de visita por el ID del Paciente
    // GET /api/pases-de-visita/by-paciente/{pacienteId}
    @GetMapping("/where/{pacienteId}")
    public ResponseEntity<List<PaseDeVisita>> getPasesDeVisitaByPacienteId(@PathVariable String pacienteId) {
        PaseDeVisitaService service = paseDeVisitaService; // Puedes crear una variable local si quieres, pero no es necesario
        List<PaseDeVisita> pasesDeVisita = service.findPasesDeVisitaByPacienteId(pacienteId); // Llamada correcta usando la variable inyectada

        if (pasesDeVisita.isEmpty()) {
            return ResponseEntity.ok(pasesDeVisita);
        } else {
            return ResponseEntity.ok(pasesDeVisita);
        }
    }
}