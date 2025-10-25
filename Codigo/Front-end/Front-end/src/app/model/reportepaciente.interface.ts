export interface ReportePaciente {
    idReportePaciente: string;
    lecheAutologa:     number;
    ldm:               number;
    lechePasteurizada: number;
    lecheFormula:      number;
    paciente:          {idPaciente: string};
}

export interface HibernateLazyInitializer {
}
