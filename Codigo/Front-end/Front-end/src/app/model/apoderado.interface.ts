export interface Apoderado {
    idApoderado: string;
    parentesco: null | string;
    nombreApoderado: null | string;
    apellidoPaternoApoderado: null | string;
    apellidoMaternoApoderado: null | string;
    madre: { idMadre: string};
}       