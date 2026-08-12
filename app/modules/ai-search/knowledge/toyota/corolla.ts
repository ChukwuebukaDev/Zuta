import { CarKnowledgeAttributes } from "@/app/modules/ai-search/types/schema";

export const corollaKnowledge:CarKnowledgeAttributes = {
    scores: {
            reliability:98,
            fuelEfficiency:92,
            maintenanceCost:97,
            resaleValue:96,
            comfort:78,
            performance:65,
            cargoSpace:74,
            safety:89,
            rideQuality:82,
            groundClearance:58,
            partsAvailability:100,
    },
    idealFor:["Daily commuting","Family use","Budget-friendly transportation"],
    pros:[
        "Excellent reliability and low maintenance costs","High fuel efficiency", "Good resale value", "Wide availability of parts"],
    cons:[
        "Limited performance and acceleration",
        "Basic interior design",
        "ground clearance may be low for rough terrains"
    ],
    commonIssues:[
        "Transmission problems",
        "Air conditioning issues"
    ],
    notes: "A solid choice for daily commuting,family use and ride-hailing."
}