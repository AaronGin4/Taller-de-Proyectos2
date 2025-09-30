package com.HospitalRegional.BancoDeLeche.controller;

import com.HospitalRegional.BancoDeLeche.entity.Madre;
import com.HospitalRegional.BancoDeLeche.service.MadreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/madres")
public class MadreController {

    @Autowired
    private MadreService madreService;

    @GetMapping
    public List<Madre> getAllMadres() {
        return madreService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Madre> getMadreById(@PathVariable String id) {
        Optional<Madre> madre = madreService.findById(id);
        return madre.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Madre createMadre(@RequestBody Madre madre) {
        return madreService.save(madre);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Madre> updateMadre(@PathVariable String id, @RequestBody Madre madre) {
        if (!madreService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        madre.setIdMadre(id); // Asegura que el ID se mantenga
        return ResponseEntity.ok(madreService.save(madre));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMadre(@PathVariable String id) {
        if (!madreService.findById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        madreService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Value("${IMAGENES_MADRES_DIR:/imagenes_madres}")
    private String folderPath;

    @PostMapping("/{id}/subir-consentimiento")
    public ResponseEntity<Map<String, String>> subirConsentimiento(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {

        Optional<Madre> madreOptional = madreService.findById(id);
        if (!madreOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Files.createDirectories(Paths.get(folderPath));

            String fileName = id + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(folderPath, fileName);
            Files.write(filePath, file.getBytes());

            Madre madre = madreOptional.get();
            madre.setConsentimientoMadre(filePath.toString());
            madreService.save(madre);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Collections.singletonMap("message", "Imagen guardada con éxito"));

        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Collections.singletonMap("error", "Error al guardar la imagen"));
        }
    }

    @GetMapping("/{id}/consentimiento/{filename:.+}")
    public ResponseEntity<byte[]> getConsentimiento(
            @PathVariable String id,
            @PathVariable String filename) throws IOException {

        String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8);
        Path filePath = Paths.get(folderPath, decodedFilename);

        System.out.println("Buscando archivo en: " + filePath.toString());

        if (!Files.exists(filePath)) {
            System.out.println("Archivo NO encontrado");
            return ResponseEntity.notFound().build();
        }

        byte[] image = Files.readAllBytes(filePath);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG) // o IMAGE_PNG según el tipo real
                .body(image);
    }


}
