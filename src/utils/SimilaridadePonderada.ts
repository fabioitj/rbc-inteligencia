interface MatchModel {
    platform: string;
    gamemode: string;
    mapname: string;
    roundnumber: number;
    objectivelocation: string;
    endroundreason: string;
    roundduration: number;
    clearencelevel: number;
    skillrank: string;
    role: string;
    haswon: number;
    operator: string;
    nbkills: number;
    isdead: number;
    [key: string]: any;
}

const mapCorrelation: {[key: string]: any} = {
    "BANK": { "CLUB_HOUSE": 0.8, "OREGON": 0.4, "CHALET": 0, "CONSULATE": 0, "HEREFORD_BASE": 0, "HOUSE": 0, "KAFE_DOSTOYEVSKY": 0, "PLANE": 0, "KANAL": 0 },
    "CHALET": { "BANK": 0, "CLUB_HOUSE": 0, "OREGON": 0, "CONSULATE": 0, "HEREFORD_BASE": 0, "HOUSE": 0, "KAFE_DOSTOYEVSKY": 0, "PLANE": 0, "KANAL": 0 },
    "CLUB_HOUSE": { "BANK": 0.8, "OREGON": 0.5, "CHALET": 0, "CONSULATE": 0, "HEREFORD_BASE": 0, "HOUSE": 0, "KAFE_DOSTOYEVSKY": 0, "PLANE": 0, "KANAL": 0 },
    "CONSULATE": { "BANK": 0, "CHALET": 0, "CLUB_HOUSE": 0, "OREGON": 0, "HEREFORD_BASE": 0, "HOUSE": 0, "KAFE_DOSTOYEVSKY": 0, "PLANE": 0, "KANAL": 0 },
    "HEREFORD_BASE": { "BANK": 0, "CHALET": 0, "CLUB_HOUSE": 0, "CONSULATE": 0, "OREGON": 0, "HOUSE": 0, "KAFE_DOSTOYEVSKY": 0, "PLANE": 0, "KANAL": 0 },
    "HOUSE": { "BANK": 0, "CHALET": 0, "CLUB_HOUSE": 0, "CONSULATE": 0, "HEREFORD_BASE": 0, "OREGON": 0, "KAFE_DOSTOYEVSKY": 0, "PLANE": 0, "KANAL": 0 },
    "KAFE_DOSTOYEVSKY": { "BANK": 0, "CHALET": 0, "CLUB_HOUSE": 0, "CONSULATE": 0, "HEREFORD_BASE": 0, "HOUSE": 0, "OREGON": 0, "PLANE": 0, "KANAL": 0 },
    "OREGON": { "BANK": 0.4, "CHALET": 0, "CLUB_HOUSE": 0.5, "CONSULATE": 0, "HEREFORD_BASE": 0, "HOUSE": 0, "KAFE_DOSTOYEVSKY": 0, "PLANE": 0, "KANAL": 0 },
    "PLANE": { "BANK": 0, "CHALET": 0, "CLUB_HOUSE": 0, "CONSULATE": 0, "HEREFORD_BASE": 0, "HOUSE": 0, "KAFE_DOSTOYEVSKY": 0, "OREGON": 0, "KANAL": 0 },
    "KANAL": { "BANK": 0, "CHALET": 0, "CLUB_HOUSE": 0, "CONSULATE": 0, "HEREFORD_BASE": 0, "HOUSE": 0, "KAFE_DOSTOYEVSKY": 0, "PLANE": 0, "OREGON": 0 }
};

const operatorCorrelation: {[key: string]: string[]} = {
    "JTF2": ["JTF2-FROST", "JTF2-BUCK"],
    "G.E.O.": ["G.E.O.-JACKAL", "G.E.O.-MIRA"],
    "GIGN": ["GIGN-ROOK", "GIGN-MONTAGNE", "GIGN-DOC", "GIGN-TWITCH"],
    "SWAT": ["SWAT-CASTLE", "SWAT-PULSE", "SWAT-ASH", "SWAT-THERMITE"],
    "SAS": ["SAS-SMOKE", "SAS-SLEDGE", "SAS-THATCHER", "SAS-MUTE"],
    "BOPE": ["BOPE-CAVEIRA", "BOPE-CAPITAO"],
    "SPETSNAZ": ["SPETSNAZ-FUZE", "SPETSNAZ-GLAZ", "SPETSNAZ-TACHANKA", "SPETSNAZ-KAPKAN"],
    "GSG9": ["GSG9-IQ", "GSG9-BLITZ", "GSG9-BANDIT", "GSG9-JAGER"],
    "SAT": ["SAT-ECHO", "SAT-HIBANA"],
    "NAVYSEAL": ["NAVYSEAL-VALKYRIE", "NAVYSEAL-BLACKBEARD"],
};

function getOperatorCorrelation(op1: string, op2: string): number {
    for (let org in operatorCorrelation) {
        if (operatorCorrelation[org].includes(op1) && operatorCorrelation[org].includes(op2) && op1 !== op2) {
            return 0.7;
        }
    }
    return op1 === op2 ? 1 : 0;
}

function calculateSimilarity(baseCase: MatchModel, itCase: MatchModel): number {
    let totalSimilarity = 0;

    Object.keys(baseCase.weights).forEach(attribute => {
        const weight = baseCase.weights[attribute];
        const baseCaseValue = baseCase[attribute];
        const itCaseValue = itCase[attribute];

        let similarityAttribute = 0;

        if (attribute === "mapname") {
            similarityAttribute = mapCorrelation[baseCaseValue]?.[itCaseValue] || 0;
        } else if (attribute === "operator") {
            similarityAttribute = getOperatorCorrelation(baseCaseValue, itCaseValue);
        } else {
            similarityAttribute = baseCaseValue === itCaseValue ? 1 : 0;
        }

        totalSimilarity += weight * similarityAttribute;
    });

    return totalSimilarity;
}

export {
    MatchModel,
    calculateSimilarity
}