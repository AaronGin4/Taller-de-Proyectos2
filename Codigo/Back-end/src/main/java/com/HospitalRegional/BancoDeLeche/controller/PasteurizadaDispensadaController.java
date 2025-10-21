package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.PasteurizadaDispensada;
import com.HospitalRegional.BancoDeLeche.service.PasteurizadaDispensadaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pasteurizada-dispensada")
public class PasteurizadaDispensadaController {

    @Autowired
    private PasteurizadaDispensadaService service;

    @GetMapping
    public List<PasteurizadaDispensada> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Optional<PasteurizadaDispensada> getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/paciente/{idPaciente}")
    public List<PasteurizadaDispensada> getByIdPaciente(@PathVariable String idPaciente) {
        return service.findByIdPaciente(idPaciente);
    }

    @PostMapping
    public PasteurizadaDispensada save(@RequestBody PasteurizadaDispensada pd) {
        return service.save(pd);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.deleteById(id);
    }
}
