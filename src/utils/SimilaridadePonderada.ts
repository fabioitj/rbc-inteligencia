interface CasoMedicoModel {
    idade: number;
    genero: string;
    sintomas: string[];
    historicoMedico: string[];
    resultadosExames: Record<string, string | number>;
    diagnostico: string;
    pesos: Record<string, number>;
    [key: string]: any;
}

function calcularSimilaridadePonderada(caso1: CasoMedicoModel, caso2: CasoMedicoModel): number {
    let similaridadeTotal = 0;

    // Calcular a similaridade ponderada para cada atributo
    Object.keys(caso1.pesos).forEach(atributo => {
    const peso = caso1.pesos[atributo];
    const valorCaso1 = caso1[atributo];
    const valorCaso2 = caso2[atributo];

    if (Array.isArray(valorCaso1) && Array.isArray(valorCaso2)) {
        // Atributos que são arrays (como sintomas e histórico médico) podem ser tratados de forma especial
        const intersecao = valorCaso1.filter(item => valorCaso2.includes(item)).length;
        const similaridadeAtributo = intersecao / Math.max(valorCaso1.length, valorCaso2.length);
        similaridadeTotal += peso * similaridadeAtributo;
    } else if (typeof valorCaso1 === 'object' && typeof valorCaso2 === 'object') {
        // Atributos que são objetos (como resultados de exames) podem ser comparados diretamente
        let similaridadeAtributo = 0;
        Object.keys(valorCaso1).forEach(chave => {
        if (valorCaso2[chave] && valorCaso1[chave] === valorCaso2[chave]) {
            similaridadeAtributo += 1;
        }
        });
        similaridadeAtributo /= Object.keys(valorCaso1).length; // Normalizar entre 0 e 1
        similaridadeTotal += peso * similaridadeAtributo;
    } else {
        // Atributos simples (como idade e gênero) podem ser comparados diretamente
        const similaridadeAtributo = valorCaso1 === valorCaso2 ? 1 : 0;
        similaridadeTotal += peso * similaridadeAtributo;
    }
    });

    return similaridadeTotal;
}

export {
    CasoMedicoModel,
    calcularSimilaridadePonderada
}