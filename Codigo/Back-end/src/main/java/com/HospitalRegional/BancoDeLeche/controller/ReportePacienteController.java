package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.ReportePaciente;
import com.HospitalRegional.BancoDeLeche.service.ReportePacienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/reportePacientes")
public class ReportePacienteController {

    private final ReportePacienteService reportePacienteService;

    public ReportePacienteController(ReportePacienteService reportePacienteService) {
        this.reportePacienteService = reportePacienteService;
    }

    @GetMapping
    public List<ReportePaciente> getAllReportesPacientes() {
        return reportePacienteService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReportePaciente> getReportePacienteById(@PathVariable String id) {
        Optional<ReportePaciente> reportePaciente = reportePacienteService.findById(id);
        return reportePaciente.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ReportePaciente createReportePaciente(@RequestBody ReportePaciente reportePaciente) {
        return reportePacienteService.save(reportePaciente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ReportePaciente> updateReportePaciente(@PathVariable String id, @RequestBody ReportePaciente reportePaciente) {
        if (reportePacienteService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reportePacienteService.save(reportePaciente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReportePaciente(@PathVariable String id) {
        if (reportePacienteService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        reportePacienteService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paciente/{idPaciente}")
    public ResponseEntity<List<ReportePaciente>> getReportesByPacienteId(@PathVariable String idPaciente) {
        List<ReportePaciente> reportes = reportePacienteService.findByPacienteId(idPaciente);
        if (reportes.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reportes);
    }

}
