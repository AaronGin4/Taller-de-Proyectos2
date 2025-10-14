export interface PaseDeVisita {
  idPaseVisita?: number; // Añadir campo opcional
  fechaDia: string; // Cambiar Date a string (el backend usa LocalDate)
  llamadaTelefono: string;
  pesoDiaAnterior: number;
  pesoDelDia: number;
  deltaPeso: number;
  requerimientosKcal?: number | null;
  nroDeTomasDeLeche: number;
  cantidadMlPorTomaDeLeche: number; 
  tipoLecheRequerida: string;
  contenidoEnergetico: string;
  viaAdministracion: string;
  calostroterapia: string;
  paciente: Paciente; 
  cuna: Cuna;
}
export interface Paciente {
  idPaciente: string;
  area: string;
  pesoNacimientoPaciente?: number;
  fechaNacimientoPaciente?: Date;
}

  
  export interface Cuna {
    idCuna: string;
}
  