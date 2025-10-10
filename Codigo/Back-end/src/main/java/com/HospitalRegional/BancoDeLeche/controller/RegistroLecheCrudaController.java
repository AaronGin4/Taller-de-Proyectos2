package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLecheCruda;
import com.HospitalRegional.BancoDeLeche.entity.RegistroLechePasteurizada;
import com.HospitalRegional.BancoDeLeche.repository.RegistroLechePasteurizadaRepository;
import com.HospitalRegional.BancoDeLeche.service.RegistroLecheCrudaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/registroLecheCruda")
public class RegistroLecheCrudaController {

    private final RegistroLecheCrudaService registroLecheCrudaService;
    private final RegistroLechePasteurizadaRepository repository;

    public RegistroLecheCrudaController(RegistroLecheCrudaService registroLecheCrudaService, RegistroLechePasteurizadaRepository repository) {
        this.registroLecheCrudaService = registroLecheCrudaService;
        this.repository = repository;
    }

    @GetMapping
    public List<RegistroLecheCruda> getAllRegistrosLecheCruda() {
        return registroLecheCrudaService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroLecheCruda> getRegistroLecheCrudaById(@PathVariable String id) {
        Optional<RegistroLecheCruda> registroLecheCruda = registroLecheCrudaService.findById(id);
        return registroLecheCruda.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public RegistroLecheCruda createRegistroLecheCruda(@RequestBody RegistroLecheCruda registroLecheCruda) {
        return registroLecheCrudaService.save(registroLecheCruda);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroLecheCruda> updateRegistroLecheCruda(@PathVariable String id, @RequestBody RegistroLecheCruda registroLecheCruda) {
        if (!registroLecheCrudaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(registroLecheCrudaService.save(registroLecheCruda));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistroLecheCruda(@PathVariable String id) {
        if (!registroLecheCrudaService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        registroLecheCrudaService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
