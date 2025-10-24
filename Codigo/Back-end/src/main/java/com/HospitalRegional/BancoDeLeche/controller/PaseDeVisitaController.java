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

    private final PaseDeVisitaService paseDeVisitaService;

    @Autowired
    public PaseDeVisitaController(PaseDeVisitaService paseDeVisitaService) {
        this.paseDeVisitaService = paseDeVisitaService;
    }

    @PostMapping
    public ResponseEntity<PaseDeVisita> createPaseDeVisita(@RequestBody PaseDeVisita paseDeVisita) {
        PaseDeVisita savedPaseDeVisita = paseDeVisitaService.savePaseDeVisita(paseDeVisita);
        return new ResponseEntity<>(savedPaseDeVisita, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaseDeVisita> getPaseDeVisitaById(@PathVariable Integer id) {
        Optional<PaseDeVisita> paseDeVisita = paseDeVisitaService.getPaseDeVisitaById(id);
        return paseDeVisita.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
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

    @GetMapping
    public ResponseEntity<List<PaseDeVisita>> getAllPasesDeVisita() {
        List<PaseDeVisita> pasesDeVisita = paseDeVisitaService.getAllPasesDeVisita();
        return ResponseEntity.ok(pasesDeVisita);
    }
    @PutMapping("/{id}")
    public ResponseEntity<PaseDeVisita> updatePaseDeVisita(@PathVariable Integer id, @RequestBody PaseDeVisita paseDeVisitaDetails) {
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

            PaseDeVisita updatedPaseDeVisita = paseDeVisitaService.savePaseDeVisita(existingPaseDeVisita);
            return ResponseEntity.ok(updatedPaseDeVisita);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaseDeVisita(@PathVariable Integer id) {
        Optional<PaseDeVisita> optionalPaseDeVisita = paseDeVisitaService.getPaseDeVisitaById(id);

        if (optionalPaseDeVisita.isPresent()) {
            paseDeVisitaService.deletePaseDeVisita(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/where/{pacienteId}")
    public ResponseEntity<List<PaseDeVisita>> getPasesDeVisitaByPacienteId(@PathVariable String pacienteId) {
        PaseDeVisitaService service = paseDeVisitaService;
        List<PaseDeVisita> pasesDeVisita = service.findPasesDeVisitaByPacienteId(pacienteId);
        if (pasesDeVisita.isEmpty()) {
            return ResponseEntity.ok(pasesDeVisita);
        } else {
            return ResponseEntity.ok(pasesDeVisita);
        }
    }
}