package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.RegistroLecheCruda;
import com.HospitalRegional.BancoDeLeche.entity.RegistroLecheCrudaDonadora;
import com.HospitalRegional.BancoDeLeche.repository.DonadoraRepository;
import com.HospitalRegional.BancoDeLeche.repository.RegistroLecheCrudaDonadoraRepository;
import com.HospitalRegional.BancoDeLeche.service.RegistroLecheCrudaDonadoraService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/registroLecheCrudaDonadoras")
public class RegistroLecheCrudaDonadoraController {

    private final RegistroLecheCrudaDonadoraService registroLecheCrudaDonadoraService;
    private final DonadoraRepository donadoraRepository;
    private final RegistroLecheCrudaDonadoraRepository registroLecheCrudaDonadoraRepository;

    public RegistroLecheCrudaDonadoraController(RegistroLecheCrudaDonadoraService registroLecheCrudaDonadoraService,
                                                DonadoraRepository donadoraRepository,
                                                RegistroLecheCrudaDonadoraRepository registroLecheCrudaDonadoraRepository) {
        this.registroLecheCrudaDonadoraService = registroLecheCrudaDonadoraService;
        this.donadoraRepository = donadoraRepository;
        this.registroLecheCrudaDonadoraRepository = registroLecheCrudaDonadoraRepository;
    }
    @PostMapping
    public ResponseEntity<List<RegistroLecheCrudaDonadora>> createRegistro(
            @RequestBody List<RegistroLecheCrudaDonadora> registros) { // Cambio clave aquí

        List<RegistroLecheCrudaDonadora> nuevosRegistros = registros.stream()
                .map(registroLecheCrudaDonadoraService::save)
                .collect(Collectors.toList());

        return ResponseEntity.ok(nuevosRegistros);
    }
    @GetMapping
    public List<RegistroLecheCrudaDonadora> getAllRegistrosLecheCrudaDonadoras() {
        return registroLecheCrudaDonadoraService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegistroLecheCrudaDonadora> getRegistroById(@PathVariable Long id) {
        Optional<RegistroLecheCrudaDonadora> registro = registroLecheCrudaDonadoraService.findById(id);
        return registro.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/porDonadora/{idDonadora}")
    public ResponseEntity<List<RegistroLecheCrudaDonadora>> getRegistrosPorDonadora(@PathVariable String idDonadora) {
        List<RegistroLecheCrudaDonadora> registros = registroLecheCrudaDonadoraRepository.findByDonadoraIdDonadora(idDonadora);
        if (registros.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(registros);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegistroLecheCrudaDonadora> updateRegistro(@PathVariable Long id,
                                                                     @RequestBody RegistroLecheCrudaDonadora registro) {
        if (registroLecheCrudaDonadoraService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        registro.setIdLecheCruda(id); // importante asegurarse que el ID se establezca
        return ResponseEntity.ok(registroLecheCrudaDonadoraService.save(registro));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistro(@PathVariable Long id) {
        if (registroLecheCrudaDonadoraService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        registroLecheCrudaDonadoraService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}