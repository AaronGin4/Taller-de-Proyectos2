export interface Madre
 {
    idMadre:                       string;
    nombreMadre:                   string;
    apellidoPaternoMadre:          string;
    apellidoMaternoMadre:          string;
    fechaNacimientoMadre:          Date;
    telefonoMadre:                 string;
    tallaMadre:                    number;
    departamento:                  string;
    provincia:                     string;
    distrito:                      string;
    direccionActualMadre:          string;
    centroSaludControlProcedencia: string;
    numeroControles:               number;
    ocupacion:                     string;
    pesoInicialMadreGestante:      number;
    pesoFinalMadreGestante:        number;
    transfusionSangreMadre:        string;
    consumoCigarros:               string;
    consumoDrogas:                 string;
    consumoMedicamentos:           string;
    enfermedades:                  string;
    pruebaSerologicos:             string;
    pruebaSifilis:                 string;
    pruebaHepatitis:               string;
    pruebaVIH:                     string;
    examenHemoglobina:             string;
    enfermedadActual:              string;
    donarLeche:                    string;
    aptaParaDonar:                 string;
    menorDeEdad:                   string;
    consentimientoMadre:           null;
    paciente:                      {
        idPaciente: string;
    };
}
