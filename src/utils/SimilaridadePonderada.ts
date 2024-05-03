interface WeightModel {
    platform: number;
    gamemode: number;
    mapname: number;
    roundnumber: number;
    objectivelocation: number;
    endroundreason: number;
    roundduration: number;
    clearencelevel: number;
    skillrank: number;
    role: number;
    haswon: number;
    operator: number;
    nbkills: number;
    isdead: number;
    [key: string]: any;
  }

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
    weights: WeightModel;
    [key: string]: any;
}

const mapCorrelation: {[key: string]: any} = {
    "BANK": { "BANK": 1, "CHALET": 0.6, "CLUB_HOUSE": 0.8, "CONSULATE": 0.7, "HEREFORD_BASE": 0.5, "HOUSE": 0.4, "KAFE_DOSTOYEVSKY": 0.6, "OREGON": 0.5, "PLANE": 0.3, "KANAL": 0.4 },
    "CHALET": { "CHALET": 1, "BANK": 0.6, "CLUB_HOUSE": 0.7, "CONSULATE": 0.6, "HEREFORD_BASE": 0.4, "HOUSE": 0.3, "KAFE_DOSTOYEVSKY": 0.5, "OREGON": 0.4, "PLANE": 0.2, "KANAL": 0.3 },
    "CLUB_HOUSE": { "CLUB_HOUSE": 1, "BANK": 0.8, "CHALET": 0.7, "CONSULATE": 0.8, "HEREFORD_BASE": 0.6, "HOUSE": 0.5, "KAFE_DOSTOYEVSKY": 0.7, "OREGON": 0.5, "PLANE": 0.4, "KANAL": 0.5 },
    "CONSULATE": { "CONSULATE": 1, "BANK": 0.7, "CHALET": 0.6, "CLUB_HOUSE": 0.8, "HEREFORD_BASE": 0.4, "HOUSE": 0.3, "KAFE_DOSTOYEVSKY": 0.6, "OREGON": 0.3, "PLANE": 0.2, "KANAL": 0.3 },
    "HEREFORD_BASE": { "HEREFORD_BASE": 1, "BANK": 0.5, "CHALET": 0.4, "CLUB_HOUSE": 0.6, "CONSULATE": 0.4, "HOUSE": 0.2, "KAFE_DOSTOYEVSKY": 0.4, "OREGON": 0.2, "PLANE": 0.1, "KANAL": 0.2 },
    "HOUSE": { "HOUSE": 1, "BANK": 0.4, "CHALET": 0.3, "CLUB_HOUSE": 0.5, "CONSULATE": 0.3, "HEREFORD_BASE": 0.2, "KAFE_DOSTOYEVSKY": 0.3, "OREGON": 0.1, "PLANE": 0.1, "KANAL": 0.1 },
    "KAFE_DOSTOYEVSKY": { "KAFE_DOSTOYEVSKY": 1, "BANK": 0.6, "CHALET": 0.5, "CLUB_HOUSE": 0.7, "CONSULATE": 0.6, "HEREFORD_BASE": 0.4, "HOUSE": 0.3, "OREGON": 0.4, "PLANE": 0.2, "KANAL": 0.3 },
    "OREGON": { "OREGON": 1, "BANK": 0.5, "CHALET": 0.4, "CLUB_HOUSE": 0.5, "CONSULATE": 0.3, "HEREFORD_BASE": 0.2, "HOUSE": 0.1, "KAFE_DOSTOYEVSKY": 0.4, "PLANE": 0.1, "KANAL": 0.2 },
    "PLANE": { "PLANE": 1, "BANK": 0.3, "CHALET": 0.2, "CLUB_HOUSE": 0.4, "CONSULATE": 0.2, "HEREFORD_BASE": 0.1, "HOUSE": 0.1, "KAFE_DOSTOYEVSKY": 0.2, "OREGON": 0.1, "KANAL": 0.1 },
    "KANAL": { "KANAL": 1, "BANK": 0.4, "CHALET": 0.3, "CLUB_HOUSE": 0.5, "CONSULATE": 0.3, "HEREFORD_BASE": 0.2, "HOUSE": 0.1, "KAFE_DOSTOYEVSKY": 0.3, "OREGON": 0.2, "PLANE": 0.1 }
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

function calculateSimilarity(baseMatch: MatchModel, itMatch: MatchModel): number {
    let totalSimilarity = 0;

    Object.keys(baseMatch).forEach(attribute => {
        const baseMatchValue = baseMatch[attribute];
        if (attribute !== "weights" && baseMatchValue) {
            const weight = itMatch.weights[attribute];
            const itMatchValue = itMatch[attribute];
    
            let similarityAttribute = 0;
    
            if (attribute === "mapname") {
                similarityAttribute = mapCorrelation[baseMatchValue]?.[itMatchValue] || 0;
            } else if (attribute === "operator") {
                similarityAttribute = getOperatorCorrelation(baseMatchValue, itMatchValue);
            } else {
                similarityAttribute = baseMatchValue === itMatchValue ? 1 : 0;
            }
    
            totalSimilarity += weight * similarityAttribute;
        }
    });

    return totalSimilarity;
}

export {
    MatchModel,
    calculateSimilarity
}