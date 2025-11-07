package com.HospitalRegional.BancoDeLeche.controller;
import com.HospitalRegional.BancoDeLeche.entity.Donadora;
import com.HospitalRegional.BancoDeLeche.entity.Madre;
import com.HospitalRegional.BancoDeLeche.service.DonadoraService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/donadoras")
public class DonadoraController {
    private final DonadoraService donadoraService;
    public DonadoraController(DonadoraService donadoraService) {
        this.donadoraService = donadoraService;
    }

    @GetMapping
    public List<Donadora> getAllDonadoras() {
        return donadoraService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Donadora> getDonadoraById(@PathVariable String id) {
        Optional<Donadora> donadora = donadoraService.findById(id);
        return donadora.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Donadora createDonadora(@RequestBody Donadora donadora) {
        return donadoraService.save(donadora);
    }



    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDonadora(@PathVariable String id) {
        if (donadoraService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        donadoraService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
