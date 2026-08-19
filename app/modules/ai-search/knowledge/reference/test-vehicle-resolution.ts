import {
  resolveVehicleIntelligence,
} from "./vehicles/vehicle-intelligence"

const result =
  resolveVehicleIntelligence({
    brand: "Toyota",
    model: "Corolla",
    year: 2008,
    engineCode: "2ZR-FE",
  });


console.dir(result, {
  depth: null,
});