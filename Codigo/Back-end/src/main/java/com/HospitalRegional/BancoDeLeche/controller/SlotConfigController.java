package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.SlotConfig;
import com.HospitalRegional.BancoDeLeche.service.SlotConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/slot-config")
public class SlotConfigController {

    private final SlotConfigService service;

    @Autowired
    public SlotConfigController(SlotConfigService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<SlotConfig> saveConfig(@RequestBody SlotConfig config) {
        return ResponseEntity.ok(service.save(config));
    }

    @GetMapping("/{patientId}/{fecha}")
    public ResponseEntity<String> getConfig(
            @PathVariable String patientId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        Optional<SlotConfig> config = service.findByPatientIdAndFecha(patientId, fecha);
        return config.map(c -> ResponseEntity.ok(c.getConfigData()))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{patientId}/{fecha}")
    public ResponseEntity<Void> deleteConfig(
            @PathVariable String patientId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {

        service.deleteByPatientIdAndFecha(patientId, fecha);
        return ResponseEntity.noContent().build();
    }
}