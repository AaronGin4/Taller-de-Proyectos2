-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-09-2025 a las 02:42:54
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bancodelechedb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apoderado`
--

CREATE TABLE `apoderado` (
  `Id_Apoderado` varchar(15) NOT NULL,
  `Parentesco` varchar(15) DEFAULT NULL,
  `Nombre_Apoderado` varchar(100) DEFAULT NULL,
  `Apellido_Paterno_Apoderado` varchar(100) DEFAULT NULL,
  `Apellido_Materno_Apoderado` varchar(100) DEFAULT NULL,
  `Id_Madre` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuna`
--

CREATE TABLE `cuna` (
  `Id_Cuna` varchar(6) NOT NULL,
  `Estado_Cuna` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `datos_extra`
--

CREATE TABLE `datos_extra` (
  `id_datos_extra` int(11) NOT NULL,
  `num_pre_inscripciones` bigint(20) DEFAULT NULL,
  `higiene_manos` bigint(20) DEFAULT NULL,
  `higiene_mamas` bigint(20) DEFAULT NULL,
  `tecnica_extraccion_leche_materna_intrahospitalaria` bigint(20) DEFAULT NULL,
  `tecnica_extraccion_leche_materna_extrahospitalaria` bigint(20) DEFAULT NULL,
  `lavado_mamas` bigint(20) DEFAULT NULL,
  `calostro` double DEFAULT NULL,
  `transicion` double DEFAULT NULL,
  `madura` double DEFAULT NULL,
  `tasa_descarte` double DEFAULT NULL,
  `cantidad_antonio_lorena` double DEFAULT NULL,
  `cantidad_otros` double DEFAULT NULL,
  `numero-donantes` bigint(20) DEFAULT NULL,
  `numero-donantes-externos` bigint(20) DEFAULT NULL,
  `calostro_al` double DEFAULT NULL,
  `transicion_al` double DEFAULT NULL,
  `madura_al` double DEFAULT NULL,
  `tasa_descarte_al` double DEFAULT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico_paciente`
--

CREATE TABLE `diagnostico_paciente` (
  `Id_Diagnostico_Paciente` varchar(20) NOT NULL,
  `Observacion_Enfermedad` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dispensacion`
--

CREATE TABLE `dispensacion` (
  `Id_Dispensacion` int(11) NOT NULL,
  `Id_Pase_Visita` int(11) DEFAULT NULL,
  `Id_Paciente` varchar(20) DEFAULT NULL,
  `Toma_1` enum('Si','No') DEFAULT NULL,
  `Toma_2` enum('Si','No') DEFAULT NULL,
  `Toma_3` enum('Si','No') DEFAULT NULL,
  `Toma_4` enum('Si','No') DEFAULT NULL,
  `Toma_5` enum('Si','No') DEFAULT NULL,
  `Toma_6` enum('Si','No') DEFAULT NULL,
  `Toma_7` enum('Si','No') DEFAULT NULL,
  `Toma_8` enum('Si','No') DEFAULT NULL,
  `Toma_9` enum('Si','No') DEFAULT NULL,
  `Toma_10` enum('Si','No') DEFAULT NULL,
  `Toma_11` enum('Si','No') DEFAULT NULL,
  `Toma_12` enum('Si','No') DEFAULT NULL,
  `Leche_Pasteurizada` enum('Si','No') DEFAULT NULL,
  `LDM` enum('Si','No') DEFAULT NULL,
  `Leche_autologa_formula` enum('Si','No') DEFAULT NULL,
  `Leche_Formula_termino` enum('Si','No') DEFAULT NULL,
  `Leche_autologa_pasteurizada` enum('Si','No') DEFAULT NULL,
  `Leche_autologa` enum('Si','No') DEFAULT NULL,
  `Leche_pasteurizada_formula` enum('Si','No') DEFAULT NULL,
  `Leche_Formula_pretermino` enum('Si','No') DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Toma_13` enum('Si','No') DEFAULT 'No',
  `Toma_14` enum('Si','No') DEFAULT 'No',
  `Toma_15` enum('Si','No') DEFAULT 'No',
  `Toma_16` enum('Si','No') DEFAULT 'No'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `donadora`
--

CREATE TABLE `donadora` (
  `Id_Donadora` varchar(20) NOT NULL,
  `Nombre_Donadora` varchar(100) DEFAULT NULL,
  `Apellido_Paterno_Donadora` varchar(100) DEFAULT NULL,
  `Apellido_Materno_Donadora` varchar(100) DEFAULT NULL,
  `Fecha_Nacimiento_Donadora` date DEFAULT NULL,
  `Telefono_Donadora` varchar(9) DEFAULT NULL,
  `Talla_Donadora` float DEFAULT NULL,
  `Departamento` varchar(50) DEFAULT NULL,
  `Provincia` varchar(50) DEFAULT NULL,
  `Distrito` varchar(50) DEFAULT NULL,
  `Direccion_Actual_Donadora` varchar(200) DEFAULT NULL,
  `Centro_Salud_Control_Procedencia` varchar(100) DEFAULT NULL,
  `Numero_Controles` int(11) DEFAULT NULL,
  `Ocupacion` varchar(50) DEFAULT NULL,
  `Transfusion_Sangre_Madre` varchar(2) DEFAULT NULL,
  `Consumo_Cigarros` varchar(2) DEFAULT NULL,
  `Consumo_Drogas` varchar(2) DEFAULT NULL,
  `Consumo_Medicamentos` varchar(2) DEFAULT NULL,
  `Enfermedades` varchar(15) DEFAULT NULL,
  `Prueba_Serologicos` varchar(15) DEFAULT NULL,
  `Prueba_Sifilis` varchar(15) DEFAULT NULL,
  `Prueba_Hepatitis` varchar(15) DEFAULT NULL,
  `Prueba_VIH` varchar(15) DEFAULT NULL,
  `Examen_Hemoglobina` varchar(15) DEFAULT NULL,
  `Enfermedad_Actual` text DEFAULT NULL,
  `Donar_Leche` varchar(2) DEFAULT NULL,
  `Apta_Para_Donar` varchar(10) DEFAULT NULL,
  `Consentimiento_Donadora` longblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enfermedad`
--

CREATE TABLE `enfermedad` (
  `Id_Enfermedad` varchar(30) NOT NULL,
  `Nombre_Enfermedad` varchar(30) DEFAULT NULL,
  `Categoria_Enfermedad` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `enfermedades_paciente`
--

CREATE TABLE `enfermedades_paciente` (
  `Id_Enfermedad_Paciente` int(11) NOT NULL,
  `Id_Diagnostico_Paciente` varchar(20) DEFAULT NULL,
  `Id_Enfermedad` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `madre`
--

CREATE TABLE `madre` (
  `Id_Madre` varchar(20) NOT NULL,
  `Nombre_Madre` varchar(100) DEFAULT NULL,
  `Apellido_Paterno_Madre` varchar(100) DEFAULT NULL,
  `Apellido_Materno_Madre` varchar(100) DEFAULT NULL,
  `Fecha_Nacimiento_Madre` date DEFAULT NULL,
  `Telefono_Madre` varchar(9) DEFAULT NULL,
  `Talla_Madre` float DEFAULT NULL,
  `Departamento` varchar(50) DEFAULT NULL,
  `Provincia` varchar(50) DEFAULT NULL,
  `Distrito` varchar(50) DEFAULT NULL,
  `Direccion_Actual_Madre` varchar(200) DEFAULT NULL,
  `Centro_Salud_Control_Procedencia` varchar(100) DEFAULT NULL,
  `Numero_Controles` int(11) DEFAULT NULL,
  `Ocupacion` varchar(50) DEFAULT NULL,
  `Peso_Inicial_Madre_Gestante` float DEFAULT NULL,
  `Peso_Final_Madre_Gestante` float DEFAULT NULL,
  `Transfusion_Sangre_Madre` varchar(2) DEFAULT NULL,
  `Consumo_Cigarros` varchar(2) DEFAULT NULL,
  `Consumo_Drogas` varchar(2) DEFAULT NULL,
  `Consumo_Medicamentos` varchar(2) DEFAULT NULL,
  `Enfermedades` varchar(15) DEFAULT NULL,
  `Prueba_Serologicos` varchar(15) DEFAULT NULL,
  `Prueba_Sifilis` varchar(15) DEFAULT NULL,
  `Prueba_Hepatitis` varchar(15) DEFAULT NULL,
  `Prueba_VIH` varchar(15) DEFAULT NULL,
  `Examen_Hemoglobina` varchar(15) DEFAULT NULL,
  `Enfermedad_Actual` text DEFAULT NULL,
  `Donar_Leche` varchar(2) DEFAULT NULL,
  `Apta_Para_Donar` varchar(10) DEFAULT NULL,
  `Menor_de_Edad` varchar(2) DEFAULT NULL,
  `Consentimiento_Madre` varchar(100) DEFAULT NULL,
  `Id_Paciente` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `Id_Paciente` varchar(20) NOT NULL,
  `Dni_Madre` varchar(8) DEFAULT NULL,
  `Nombre_Paciente` varchar(100) DEFAULT NULL,
  `Apellido_Paterno_Paciente` varchar(100) DEFAULT NULL,
  `Apellido_Materno_Paciente` varchar(100) DEFAULT NULL,
  `Fecha_Nacimiento_Paciente` date DEFAULT NULL,
  `Genero_Paciente` varchar(15) DEFAULT NULL,
  `Peso_Nacimiento_Paciente` float DEFAULT NULL,
  `Detalle_Peso_Nacimiento_Paciente` varchar(50) DEFAULT NULL,
  `Edad_Gestacional_Paciente` int(11) DEFAULT NULL,
  `Detalle_Edad_Gestacional_Paciente` varchar(50) DEFAULT NULL,
  `Area` varchar(20) DEFAULT NULL,
  `Estado` varchar(25) DEFAULT NULL,
  `Fecha_Ingreso` date DEFAULT NULL,
  `Fecha_Salida` date DEFAULT NULL,
  `Peso_Salida_Paciente` float DEFAULT NULL,
  `Talla_Nacimiento_Paciente` float DEFAULT NULL,
  `Talla_Salida_Paciente` float DEFAULT NULL,
  `Telefono_Paciente` varchar(9) DEFAULT NULL,
  `Numero_Pre_Factura` varchar(250) DEFAULT NULL,
  `Perimetro_Cefalico` float DEFAULT NULL,
  `Perimetro_Cefalico_Salida` float DEFAULT NULL,
  `Id_Cuna` varchar(6) DEFAULT NULL,
  `Id_Diagnostico_Paciente` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pase_de_visita`
--

CREATE TABLE `pase_de_visita` (
  `Id_Pase_Visita` int(11) NOT NULL,
  `Fecha_Dia` date DEFAULT NULL,
  `Llamada_Telefono` varchar(2) DEFAULT NULL,
  `Peso_Dia_Anterior` float DEFAULT NULL,
  `Peso_del_Dia` float DEFAULT NULL,
  `Delta_Peso` float DEFAULT NULL,
  `Requerimientos_Kcal` float DEFAULT NULL,
  `Nro_de_Tomas_de_Leche` int(11) DEFAULT NULL,
  `Cantidad_ml_Por_Toma_de_Leche` float DEFAULT NULL,
  `Tipo_Leche_Requerida` varchar(15) DEFAULT NULL,
  `Contenido_Energetico` varchar(15) DEFAULT NULL,
  `Via_Administracion` varchar(15) DEFAULT NULL,
  `Calostroterapia` varchar(2) DEFAULT NULL,
  `Id_Paciente` varchar(20) DEFAULT NULL,
  `Id_Cuna` varchar(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pasteurizada_dispensada`
--

CREATE TABLE `pasteurizada_dispensada` (
  `Id_Pasteurizada_Dispensada` int(11) NOT NULL,
  `Codigo_Leche` varchar(20) DEFAULT NULL,
  `Tipo_Leche` varchar(15) DEFAULT NULL,
  `Kcal` float DEFAULT NULL,
  `Crema` float DEFAULT NULL,
  `Grasa` float DEFAULT NULL,
  `a_dornix` float DEFAULT NULL,
  `Contenido_Energetico` varchar(20) DEFAULT NULL,
  `Cantidad_Dispensada` float DEFAULT NULL,
  `Id_Paciente` varchar(20) NOT NULL,
  `Fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_formula`
--

CREATE TABLE `registro_formula` (
  `Codigo_leche_formula` varchar(20) NOT NULL,
  `Tipo_leche` varchar(11) NOT NULL,
  `Cantidad_formula` float NOT NULL,
  `Kcal` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_leche_cruda`
--

CREATE TABLE `registro_leche_cruda` (
  `Id_Leche_Cruda` int(11) NOT NULL,
  `Cantidad` float DEFAULT NULL,
  `Hora` datetime DEFAULT NULL,
  `Id_Madre` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_leche_cruda_donadora`
--

CREATE TABLE `registro_leche_cruda_donadora` (
  `Id_Leche_Cruda` int(11) NOT NULL,
  `Cantidad` float DEFAULT NULL,
  `Hora` varchar(20) DEFAULT NULL,
  `Id_Donadora` varchar(20) NOT NULL,
  `Fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_leche_pasteurizada`
--

CREATE TABLE `registro_leche_pasteurizada` (
  `Codigo_Leche` varchar(20) NOT NULL,
  `Tipo_Leche` varchar(15) DEFAULT NULL,
  `Cantidad_Leche` float DEFAULT NULL,
  `Kcal` float DEFAULT NULL,
  `Crema` float DEFAULT NULL,
  `Grasa` float DEFAULT NULL,
  `a_dornix` float DEFAULT NULL,
  `Contenido_Energetico` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte_paciente`
--

CREATE TABLE `reporte_paciente` (
  `Id_Reporte_Paciente` varchar(20) NOT NULL,
  `Leche_Autologa` float DEFAULT NULL,
  `LDM` float DEFAULT NULL,
  `Leche_Pasteurizada` float DEFAULT NULL,
  `Leche_Formula` float DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Id_Paciente` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `slot_config`
--

CREATE TABLE `slot_config` (
  `id` bigint(20) NOT NULL,
  `patient_id` varchar(20) NOT NULL,
  `fecha` date NOT NULL,
  `config_data` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `Id_Usuario` varchar(20) NOT NULL,
  `Profesion` varchar(30) DEFAULT NULL,
  `Nombres` varchar(50) DEFAULT NULL,
  `Apellidos` varchar(50) DEFAULT NULL,
  `Usuario` varchar(10) DEFAULT NULL,
  `Contrasena` varchar(255) DEFAULT NULL,
  `Acceso_HC` enum('Si','No') DEFAULT NULL,
  `Acceso_PV` enum('Si','No') DEFAULT NULL,
  `Acceso_Almacen` enum('Si','No') DEFAULT NULL,
  `Acceso_Reportes` enum('Si','No') DEFAULT NULL,
  `Acceso_Donantes` enum('Si','No') DEFAULT NULL,
  `Administrador` enum('Si','No') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `apoderado`
--
ALTER TABLE `apoderado`
  ADD PRIMARY KEY (`Id_Apoderado`),
  ADD KEY `Id_Madre` (`Id_Madre`);

--
-- Indices de la tabla `cuna`
--
ALTER TABLE `cuna`
  ADD PRIMARY KEY (`Id_Cuna`);

--
-- Indices de la tabla `datos_extra`
--
ALTER TABLE `datos_extra`
  ADD PRIMARY KEY (`id_datos_extra`);

--
-- Indices de la tabla `diagnostico_paciente`
--
ALTER TABLE `diagnostico_paciente`
  ADD PRIMARY KEY (`Id_Diagnostico_Paciente`);

--
-- Indices de la tabla `dispensacion`
--
ALTER TABLE `dispensacion`
  ADD PRIMARY KEY (`Id_Dispensacion`),
  ADD KEY `fk_dispensacion_pase` (`Id_Pase_Visita`),
  ADD KEY `fk_dispensacion_paciente` (`Id_Paciente`);

--
-- Indices de la tabla `donadora`
--
ALTER TABLE `donadora`
  ADD PRIMARY KEY (`Id_Donadora`);

--
-- Indices de la tabla `enfermedad`
--
ALTER TABLE `enfermedad`
  ADD PRIMARY KEY (`Id_Enfermedad`);

--
-- Indices de la tabla `enfermedades_paciente`
--
ALTER TABLE `enfermedades_paciente`
  ADD PRIMARY KEY (`Id_Enfermedad_Paciente`),
  ADD KEY `Id_Diagnostico_Paciente` (`Id_Diagnostico_Paciente`),
  ADD KEY `Id_Enfermedad` (`Id_Enfermedad`);

--
-- Indices de la tabla `madre`
--
ALTER TABLE `madre`
  ADD PRIMARY KEY (`Id_Madre`),
  ADD KEY `Id_Paciente` (`Id_Paciente`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`Id_Paciente`),
  ADD KEY `Id_Cuna` (`Id_Cuna`),
  ADD KEY `Id_Diagnostico_Paciente` (`Id_Diagnostico_Paciente`);

--
-- Indices de la tabla `pase_de_visita`
--
ALTER TABLE `pase_de_visita`
  ADD PRIMARY KEY (`Id_Pase_Visita`),
  ADD KEY `Id_Paciente` (`Id_Paciente`),
  ADD KEY `Id_Cuna` (`Id_Cuna`);

--
-- Indices de la tabla `pasteurizada_dispensada`
--
ALTER TABLE `pasteurizada_dispensada`
  ADD PRIMARY KEY (`Id_Pasteurizada_Dispensada`),
  ADD KEY `Id_Paciente` (`Id_Paciente`);

--
-- Indices de la tabla `registro_formula`
--
ALTER TABLE `registro_formula`
  ADD PRIMARY KEY (`Codigo_leche_formula`);

--
-- Indices de la tabla `registro_leche_cruda`
--
ALTER TABLE `registro_leche_cruda`
  ADD PRIMARY KEY (`Id_Leche_Cruda`),
  ADD KEY `Id_Madre` (`Id_Madre`);

--
-- Indices de la tabla `registro_leche_cruda_donadora`
--
ALTER TABLE `registro_leche_cruda_donadora`
  ADD PRIMARY KEY (`Id_Leche_Cruda`),
  ADD KEY `Id_Donadora` (`Id_Donadora`);

--
-- Indices de la tabla `registro_leche_pasteurizada`
--
ALTER TABLE `registro_leche_pasteurizada`
  ADD PRIMARY KEY (`Codigo_Leche`);

--
-- Indices de la tabla `reporte_paciente`
--
ALTER TABLE `reporte_paciente`
  ADD PRIMARY KEY (`Id_Reporte_Paciente`),
  ADD KEY `Id_Paciente` (`Id_Paciente`);

--
-- Indices de la tabla `slot_config`
--
ALTER TABLE `slot_config`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_patient_date` (`patient_id`,`fecha`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`Id_Usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `datos_extra`
--
ALTER TABLE `datos_extra`
  MODIFY `id_datos_extra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `dispensacion`
--
ALTER TABLE `dispensacion`
  MODIFY `Id_Dispensacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=226;

--
-- AUTO_INCREMENT de la tabla `enfermedades_paciente`
--
ALTER TABLE `enfermedades_paciente`
  MODIFY `Id_Enfermedad_Paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- AUTO_INCREMENT de la tabla `pase_de_visita`
--
ALTER TABLE `pase_de_visita`
  MODIFY `Id_Pase_Visita` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=291;

--
-- AUTO_INCREMENT de la tabla `pasteurizada_dispensada`
--
ALTER TABLE `pasteurizada_dispensada`
  MODIFY `Id_Pasteurizada_Dispensada` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `registro_leche_cruda`
--
ALTER TABLE `registro_leche_cruda`
  MODIFY `Id_Leche_Cruda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `registro_leche_cruda_donadora`
--
ALTER TABLE `registro_leche_cruda_donadora`
  MODIFY `Id_Leche_Cruda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `slot_config`
--
ALTER TABLE `slot_config`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=220;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `apoderado`
--
ALTER TABLE `apoderado`
  ADD CONSTRAINT `apoderado_ibfk_1` FOREIGN KEY (`Id_Madre`) REFERENCES `madre` (`Id_Madre`);

--
-- Filtros para la tabla `dispensacion`
--
ALTER TABLE `dispensacion`
  ADD CONSTRAINT `fk_dispensacion_paciente` FOREIGN KEY (`Id_Paciente`) REFERENCES `paciente` (`Id_Paciente`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dispensacion_pase` FOREIGN KEY (`Id_Pase_Visita`) REFERENCES `pase_de_visita` (`Id_Pase_Visita`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `enfermedades_paciente`
--
ALTER TABLE `enfermedades_paciente`
  ADD CONSTRAINT `enfermedades_paciente_ibfk_1` FOREIGN KEY (`Id_Diagnostico_Paciente`) REFERENCES `diagnostico_paciente` (`Id_Diagnostico_Paciente`),
  ADD CONSTRAINT `enfermedades_paciente_ibfk_2` FOREIGN KEY (`Id_Enfermedad`) REFERENCES `enfermedad` (`Id_Enfermedad`);

--
-- Filtros para la tabla `madre`
--
ALTER TABLE `madre`
  ADD CONSTRAINT `madre_ibfk_1` FOREIGN KEY (`Id_Paciente`) REFERENCES `paciente` (`Id_Paciente`);

--
-- Filtros para la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD CONSTRAINT `paciente_ibfk_1` FOREIGN KEY (`Id_Cuna`) REFERENCES `cuna` (`Id_Cuna`),
  ADD CONSTRAINT `paciente_ibfk_2` FOREIGN KEY (`Id_Diagnostico_Paciente`) REFERENCES `diagnostico_paciente` (`Id_Diagnostico_Paciente`);

--
-- Filtros para la tabla `pase_de_visita`
--
ALTER TABLE `pase_de_visita`
  ADD CONSTRAINT `pase_de_visita_ibfk_1` FOREIGN KEY (`Id_Paciente`) REFERENCES `paciente` (`Id_Paciente`),
  ADD CONSTRAINT `pase_de_visita_ibfk_2` FOREIGN KEY (`Id_Cuna`) REFERENCES `cuna` (`Id_Cuna`);

--
-- Filtros para la tabla `registro_leche_cruda`
--
ALTER TABLE `registro_leche_cruda`
  ADD CONSTRAINT `registro_leche_cruda_ibfk_1` FOREIGN KEY (`Id_Madre`) REFERENCES `madre` (`Id_Madre`);

--
-- Filtros para la tabla `registro_leche_cruda_donadora`
--
ALTER TABLE `registro_leche_cruda_donadora`
  ADD CONSTRAINT `registro_leche_cruda_donadora_ibfk_1` FOREIGN KEY (`Id_Donadora`) REFERENCES `donadora` (`Id_Donadora`);

--
-- Filtros para la tabla `reporte_paciente`
--
ALTER TABLE `reporte_paciente`
  ADD CONSTRAINT `reporte_paciente_ibfk_1` FOREIGN KEY (`Id_Paciente`) REFERENCES `paciente` (`Id_Paciente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
