// models/registro-leche.ts
export interface RegistroLeche {
  idRegistro: string;
  cantidad: number;
  hora: string;
  fecha: string;
  donadora: {
      idDonadora: string;
  };
}