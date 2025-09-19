package com.HospitalRegional.BancoDeLeche.service;

import com.HospitalRegional.BancoDeLeche.entity.Usuarios;
import com.HospitalRegional.BancoDeLeche.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuariosService {

    @Autowired
    private UsuariosRepository usuariosRepository;

    public List<Usuarios> findAll() {
        return usuariosRepository.findAll();
    }

    public Optional<Usuarios> findById(String id) {
        return usuariosRepository.findById(id);
    }

    public Usuarios save(Usuarios usuario) {
        return usuariosRepository.save(usuario);
    }

    public void deleteById(String id) {
        usuariosRepository.deleteById(id);
    }

    public Optional<Usuarios> autenticarUsuario(String usuario, String contrasena) {
        Optional<Usuarios> usuarioEncontrado = usuariosRepository.findByUsuario(usuario);
        if (usuarioEncontrado.isPresent() && usuarioEncontrado.get().getContrasena().equals(contrasena)) {
            return usuarioEncontrado;
        }
        return Optional.empty();
    }
}
