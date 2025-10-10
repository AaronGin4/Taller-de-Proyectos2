package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.Paciente;
import com.HospitalRegional.BancoDeLeche.service.PacienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    @Autowired
    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    // ... (endpoints existentes para createPaciente, getPacienteById, getAllPacientes, updatePaciente, deletePaciente) ...

    // Nuevo Endpoint para obtener pacientes por estado "Paciente en atención "
    // GET /api/pacientes/estado/en-atencion
    @GetMapping("/estado/en-atencion")
    public ResponseEntity<List<Paciente>> getPacientesEnAtencion() {
        String estadoBuscado = "Paciente en atención "; // Definimos el estado específico
        List<Paciente> pacientesEnAtencion = pacienteService.findPacientesByEstado(estadoBuscado);

        if (pacientesEnAtencion.isEmpty()) {
            // Si la lista está vacía, podrías retornar 404 Not Found o 200 OK con lista vacía
            // Retornar 200 OK con lista vacía es común para búsquedas sin resultados.
            return ResponseEntity.ok(pacientesEnAtencion); // Retorna 200 OK con una lista vacía
            // Alternativamente podrías retornar: return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(pacientesEnAtencion); // Retorna 200 OK con la lista de pacientes
        }
    }

    @PatchMapping("/{id}/area")
    public ResponseEntity<Paciente> updateArea(
            @PathVariable String id,
            @RequestBody Map<String, String> areaUpdate) {

        String nuevaArea = areaUpdate.get("area");
        Paciente pacienteActualizado = pacienteService.actualizarArea(id, nuevaArea);
        return ResponseEntity.ok(pacienteActualizado);
    }
    // Métodos existentes (sin cambios):

    @PostMapping
    public ResponseEntity<Paciente> createPaciente(@RequestBody Paciente paciente) {
        Paciente savedPaciente = pacienteService.savePaciente(paciente);
        return new ResponseEntity<>(savedPaciente, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Paciente> getPacienteById(@PathVariable String id) {
        Optional<Paciente> paciente = pacienteService.getPacienteById(id);
        return paciente.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Paciente>> getAllPacientes() {
        List<Paciente> pacientes = pacienteService.getAllPacientes();
        return ResponseEntity.ok(pacientes);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Paciente> updatePaciente(@PathVariable String id, @RequestBody Paciente pacienteDetails) {
        Optional<Paciente> optionalPaciente = pacienteService.getPacienteById(id);

        if (optionalPaciente.isPresent()) {
            Paciente existingPaciente = optionalPaciente.get();

            existingPaciente.setNombrePaciente(pacienteDetails.getNombrePaciente());
            existingPaciente.setApellidoPaternoPaciente(pacienteDetails.getApellidoPaternoPaciente());
            existingPaciente.setApellidoMaternoPaciente(pacienteDetails.getApellidoMaternoPaciente());
            existingPaciente.setFechaNacimientoPaciente(pacienteDetails.getFechaNacimientoPaciente());
            existingPaciente.setGeneroPaciente(pacienteDetails.getGeneroPaciente());
            existingPaciente.setPesoNacimientoPaciente(pacienteDetails.getPesoNacimientoPaciente());
            existingPaciente.setDetallePesoNacimientoPaciente(pacienteDetails.getDetallePesoNacimientoPaciente());
            existingPaciente.setEdadGestacionalPaciente(pacienteDetails.getEdadGestacionalPaciente());
            existingPaciente.setDetalleEdadGestacionalPaciente(pacienteDetails.getDetalleEdadGestacionalPaciente());
            existingPaciente.setArea(pacienteDetails.getArea());
            existingPaciente.setEstado(pacienteDetails.getEstado());
            existingPaciente.setFechaIngreso(pacienteDetails.getFechaIngreso());
            existingPaciente.setFechaSalida(pacienteDetails.getFechaSalida()); // <-- AGREGA ESTA LÍNEA
            existingPaciente.setCuna(pacienteDetails.getCuna());
            existingPaciente.setDiagnosticoPaciente(pacienteDetails.getDiagnosticoPaciente());
            existingPaciente.setDniMadre(pacienteDetails.getDniMadre());

            Paciente updatedPaciente = pacienteService.savePaciente(existingPaciente);
            return ResponseEntity.ok(updatedPaciente);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaciente(@PathVariable String id) {
        Optional<Paciente> optionalPaciente = pacienteService.getPacienteById(id);

        if (optionalPaciente.isPresent()) {
            pacienteService.deletePaciente(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
