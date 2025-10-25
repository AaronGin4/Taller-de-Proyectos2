export interface TiempoPacienteCuna {
    idTiempoPacienteCuna: string;
    fechaInicio:          Date;
    fechaFinal:           Date | null;
    cuna:                 Cuna;
    paciente:             Paciente;
}

export interface Cuna {
    idCuna:     string;
    estadoCuna: string;
}

export interface Paciente {
    idPaciente:                     string;
    nombrePaciente:                 string;
    apellidoPaternoPaciente:        string;
    apellidoMaternoPaciente:        string;
    fechaNacimientoPaciente:        Date;
    generoPaciente:                 string;
    pesoNacimientoPaciente:         number;
    detallePesoNacimientoPaciente:  string;
    edadGestacionalPaciente:        number;
    detalleEdadGestacionalPaciente: string;
    area:                           string;
    estado:                         string;
    diagnosticoPaciente:            DiagnosticoPaciente;
}

export interface DiagnosticoPaciente {
    idDiagnosticoPaciente: string;
    observacionEnfermedad: string;
}
