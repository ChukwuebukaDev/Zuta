import { Car } from "@/types/car/cars.types";
export const mockCars: Car[] = [
  {
    id: crypto.randomUUID(),
    slug: "2022-mercedes-c300",
    brand: "Mercedes-Benz",
    model: "C300",
    year: 2022,
    bodyType: "sedan",

    transmission: "automatic",
    fuelType: "petrol",
    drivetrain: "rwd",
    mileage: 12000,

    condition: "new",
    accidentHistory: false,
    serviceHistory: true,

    price: 32000000,
    currency: "NGN",
    negotiable: true,

    thumbnail:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVuenxlbnwwfHwwfHx8MA%3D%3D",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVuenxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1584936684506-c3a7086e8212?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVuenxlbnwwfHwwfHx8MA%3D%3D",
      "https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmVuenxlbnwwfHwwfHx8MA%3D%3D",
    ],

    status: "available",
    featured: true,
    views: 124,

    sellerId: "seller_001",

    createdAt: new Date(),
    updatedAt: new Date(),
  },

  {
    id: crypto.randomUUID(),
    slug: "2021-toyota-camry",
    brand: "Toyota",
    model: "Camry",
    year: 2021,
    bodyType: "sedan",

    transmission: "automatic",
    fuelType: "petrol",
    drivetrain: "fwd",
    mileage: 25000,

    condition: "nigeria-used",
    accidentHistory: false,
    serviceHistory: true,

    price: 18000000,
    currency: "NGN",
    negotiable: false,

    thumbnail:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8fDA%3D",
    images: [
      "https://images.unsplash.com/photo-1624578571415-09e9b1991929?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1657872737697-737a2d123ef2?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1664287721774-13da4b108b18?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dG95b3RhJTIwY2Ftcnl8ZW58MHx8MHx8fDA%3D",
    ],

    status: "available",
    featured: false,
    views: 89,

    sellerId: "seller_002",

    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    slug: "2022-honda-crv",
    brand: "Honda",
    model: "CR-V",
    year: 2022,
    bodyType: "suv",

    transmission: "automatic",
    fuelType: "petrol",
    drivetrain: "awd",
    mileage: 15000,

    condition: "foreign-used",
    accidentHistory: false,
    serviceHistory: true,

    price: 25000000,
    currency: "NGN",
    negotiable: false,

    thumbnail:
      "https://images.unsplash.com/photo-1708148246994-b7b3c818090d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aG9uZGElMjBjcnZ8ZW58MHx8MHx8fDA%3D",
    images: [
      "https://images.unsplash.com/photo-1623597780975-38ccd5030c83?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG9uZGElMjBjcnZ8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1718603494523-ed04bd2115ae?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8aG9uZGElMjBjcnZ8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1662981535849-b65888e3ec45?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGhvbmRhJTIwY3J2fGVufDB8fDB8fHww",
    ],

    status: "available",
    featured: false,
    views: 109,

    sellerId: "seller_003",

    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    slug: "2024-tesla-model-3",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    bodyType: "sedan",

    transmission: "automatic",
    fuelType: "electric",
    drivetrain: "fwd",
    mileage: 1000,

    condition: "foreign-used",
    accidentHistory: false,
    serviceHistory: false,

    price: 45000000,
    currency: "NGN",
    negotiable: true,

    thumbnail:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
    images: [
      "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1638398417409-dd54452eccdf?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1700411881984-971bc29083bd?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
    ],

    status: "available",
    featured: false,
    views: 109,

    sellerId: "seller_004",

    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    slug: "2024-tesla-model-3",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    bodyType: "sedan",

    transmission: "automatic",
    fuelType: "electric",
    drivetrain: "fwd",
    mileage: 1000,

    condition: "foreign-used",
    accidentHistory: false,
    serviceHistory: false,

    price: 45000000,
    currency: "NGN",
    negotiable: true,

    thumbnail:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
    images: [
      "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1638398417409-dd54452eccdf?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1700411881984-971bc29083bd?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
    ],

    status: "available",
    featured: false,
    views: 109,

    sellerId: "seller_004",

    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: crypto.randomUUID(),
    slug: "2024-tesla-model-3",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    bodyType: "sedan",

    transmission: "automatic",
    fuelType: "electric",
    drivetrain: "fwd",
    mileage: 1000,

    condition: "foreign-used",
    accidentHistory: false,
    serviceHistory: false,

    price: 45000000,
    currency: "NGN",
    negotiable: true,

    thumbnail:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
    images: [
      "https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1638398417409-dd54452eccdf?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
      "https://images.unsplash.com/photo-1700411881984-971bc29083bd?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGVzbGElMjBtb2RlbCUyMDN8ZW58MHx8MHx8fDA%3D",
    ],

    status: "available",
    featured: false,
    views: 109,

    sellerId: "seller_004",

    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
