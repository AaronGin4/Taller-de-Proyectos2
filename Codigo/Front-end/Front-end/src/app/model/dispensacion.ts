export interface Dispensacion {
  [key: string]: any;
  idDispensacion?: number;
paseDeVisita: {
    idPaseVisita: number; 
  };
  idPaciente?: string;
toma1?: 'Si' | 'No';
  toma2?: 'Si' | 'No';
  toma3?: 'Si' | 'No';
  toma4?: 'Si' | 'No';
  toma5?: 'Si' | 'No';
  toma6?: 'Si' | 'No';
  toma7?: 'Si' | 'No';
  toma8?: 'Si' | 'No';
  toma9?: 'Si' | 'No';
  toma10?: 'Si' | 'No';
  toma11?: 'Si' | 'No';
  toma12?: 'Si' | 'No';
  toma13?: 'Si' | 'No';
  toma14?: 'Si' | 'No';
  toma15?: 'Si' | 'No';
  toma16?: 'Si' | 'No';
  lechePasteurizada?: string;
  ldm?: string;
  lecheAutologaFormula?: string;
  lecheFormulaTermino?: string;
  lecheAutologaPasteurizada?: string;
  lecheAutologa?: string;
  lechePasteurizadaFormula?: string;
  lecheFormulaPretermino?: string;
  fecha?: string;
    nroToma?: number; 
}
export interface DispensacionUpdate {
  tipoLecheDispensacion?: string;
  cantidadDispensacion?: string;
  dispensada: String;
  horaToma?: string;
  toma: number; }

export interface Paciente {
    idPaciente: string;
    nombrePaciente: string;
    apellidoPaternoPaciente: string;
    apellidoMaternoPaciente: string;
    numeroPreFactura: string;
    cuna: Cuna;
    telefonoPaciente: string;
  }
export interface Cuna {
    idCuna: string;
  }
 export interface MilkTypeSelection {
    pasteurizada: boolean;
    autologaPasteurizada: boolean;
    lmd: boolean;
    autologa: boolean;
    autologaFormula: boolean;
    pasteurizadaFormula: boolean;
    formulaTermino1: boolean;
    formulaPretermino2: boolean;
    _locked: MilkTypeLockState;
  }
export interface MilkTypeLockState {
  pasteurizada: boolean;
  autologaPasteurizada: boolean;
  lmd: boolean;
  autologa: boolean;
  autologaFormula: boolean;
  pasteurizadaFormula: boolean;
  formulaTermino1: boolean;
  formulaPretermino2: boolean;
}

  export interface PaseDeVisita {
    idPaseVisita: number;
    nroDeTomasDeLeche: number;
    contenidoEnergetico: string; 
    tipoLecheRequerida: string[]; 
    cantidadMlPorTomaDeLeche: number; 
    calostroterapia: string;
    fechaDia: string;
    paciente: Paciente; 
  cuna: Cuna; 
  }
    export interface RegistroLechePasteurizada {
  codigoLeche: string;
  cantidadLeche: number;
  tipoLeche: TipoLeche;
  kcal: number;
  aDornix: number;
  crema: number;
  grasa: number;
  contenidoEnergetico: string;
}

export enum TipoLeche {
  Transicion = 'Transicion',
  Madura = 'Madura',
  Calostro = 'Calostro'
}