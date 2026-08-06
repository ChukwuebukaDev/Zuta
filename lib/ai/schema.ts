import { Type } from "@google/genai";

export const SEARCH_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  additionalProperties: false,

  properties: {
    brand: {
      type: Type.STRING,
      nullable: true,
    },

    model: {
      type: Type.STRING,
      nullable: true,
    },

    minPrice: {
      type: Type.NUMBER,
      nullable: true,
    },

    maxPrice: {
      type: Type.NUMBER,
      nullable: true,
    },

    minYear: {
      type: Type.INTEGER,
      nullable: true,
    },

    maxYear: {
      type: Type.INTEGER,
      nullable: true,
    },

    maxMileage: {
      type: Type.INTEGER,
      nullable: true,
    },

    bodyType: {
      type: Type.STRING,
      enum: [
        "SEDAN",
        "SUV",
        "HATCHBACK",
        "COUPE",
        "TRUCK",
      ],
      nullable: true,
    },

    fuelType: {
      type: Type.STRING,
      enum: [
        "PETROL",
        "DIESEL",
        "HYBRID",
        "ELECTRIC",
      ],
      nullable: true,
    },

    transmission: {
      type: Type.STRING,
      enum: [
        "AUTOMATIC",
        "MANUAL",
      ],
      nullable: true,
    },

    condition: {
      type: Type.STRING,
      enum: [
        "NEW",
        "FOREIGN_USED",
        "LOCAL_USED",
      ],
      nullable: true,
    },

    color: {
      type: Type.STRING,
      nullable: true,
    },

    intent: {
      type: Type.STRING,
      enum: [
        "GENERAL",
        "RIDESHARE",
        "FAMILY",
        "LUXURY",
        "SPORTS",
        "COMMERCIAL",
        "FIRST_CAR",
      ],
      nullable: true,
    },

    reasoning: {
      type: Type.STRING,
      nullable: true,
    },
  },
} as const;