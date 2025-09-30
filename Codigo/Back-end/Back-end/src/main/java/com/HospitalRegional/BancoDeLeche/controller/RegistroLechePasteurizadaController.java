package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLechePasteurizada;
import com.HospitalRegional.BancoDeLeche.service.RegistroLechePasteurizadaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin
@RequestMapping("/registroLechePasteurizada")
public class RegistroLechePasteurizadaController {

    private final RegistroLechePasteurizadaService registroLechePasteurizadaService;

    public RegistroLechePasteurizadaController(RegistroLechePasteurizadaService registroLechePasteurizadaService) {
        this.registroLechePasteurizadaService = registroLechePasteurizadaService;
    }

    @GetMapping
    public List<RegistroLechePasteurizada> getAllRegistros() {
        return registroLechePasteurizadaService.findAll();
    }

    @GetMapping("/{codigoLeche}") // URL: /leche-pasteurizada/{codigoLeche}
    public ResponseEntity<RegistroLechePasteurizada> getRegistroById(@PathVariable String codigoLeche) {
        Optional<RegistroLechePasteurizada> registro = registroLechePasteurizadaService.findById(codigoLeche);
        return registro.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public RegistroLechePasteurizada createRegistro(@RequestBody RegistroLechePasteurizada registroLechePasteurizada) {
        return registroLechePasteurizadaService.save(registroLechePasteurizada);
    }

    @PutMapping("/{codigoLeche}")
    public ResponseEntity<RegistroLechePasteurizada> updateRegistro(@PathVariable String codigoLeche, @RequestBody RegistroLechePasteurizada registroLechePasteurizada) {
        if (!registroLechePasteurizadaService.findById(codigoLeche).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(registroLechePasteurizadaService.save(registroLechePasteurizada));
    }

    @DeleteMapping("/{codigoLeche}")
    public ResponseEntity<Void> deleteRegistro(@PathVariable String codigoLeche) {
        if (!registroLechePasteurizadaService.findById(codigoLeche).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        registroLechePasteurizadaService.deleteById(codigoLeche);
        return ResponseEntity.noContent().build();
    }
}
