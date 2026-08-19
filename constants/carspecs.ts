const COMMON_TRIMS: Record<string, string[]> = {
  Toyota: ["LE", "SE", "XLE", "XSE", "Limited", "Platinum", "TRD Pro", "GR"],
  Honda: ["LX", "EX", "EX-L", "Sport", "Touring", "Type R"],
  BMW: ["Base", "M Sport", "xDrive", "sDrive", "Competition", "CS"],
  Mercedes: ["Base", "AMG Line", "4MATIC", "AMG", "Maybach"],
  Lexus: ["Base", "F Sport", "Luxury", "Premium"],
  Ford: ["XL", "XLT", "Lariat", "King Ranch", "Platinum", "ST", "Raptor"],
  Hyundai: ["SE", "SEL", "Limited", "N Line", "Sport", "Ultimate"],
  Kia: ["LX", "EX", "SX", "GT-Line", "GT"],
  Nissan: ["S", "SV", "SL", "Platinum", "Nismo"],
};

export const DOOR_OPTIONS = [2, 3, 4, 5];

export const ENGINE_SIZES = [
  // Small displacement (0.6L - 1.5L)
  "0.6L", "0.7L", "0.8L", "0.9L", "1.0L", "1.1L", "1.2L", "1.3L", "1.4L", "1.5L",
  
  // Mid displacement (1.6L - 2.5L)
  "1.6L", "1.7L", "1.8L", "1.9L", "2.0L", "2.1L", "2.2L", "2.3L", "2.4L", "2.5L",
  
  // Large displacement (2.6L - 4.0L)
  "2.6L", "2.7L", "2.8L", "2.9L", "3.0L", "3.1L", "3.2L", "3.3L", "3.4L", "3.5L",
  "3.6L", "3.7L", "3.8L", "3.9L", "4.0L",
  
  // Very large displacement (4.1L - 6.0L+)
  "4.1L", "4.2L", "4.3L", "4.4L", "4.5L", "4.6L", "4.7L", "4.8L", "4.9L", "5.0L",
  "5.1L", "5.2L", "5.3L", "5.4L", "5.5L", "5.6L", "5.7L", "5.8L", "5.9L", "6.0L",
  "6.1L", "6.2L", "6.3L", "6.4L", "6.5L", "6.6L", "6.7L", "6.8L", "6.9L", "7.0L",
  
  // Classic/American V8 sizes
  "7.2L", "7.3L", "7.4L", "7.5L", "8.0L", "8.1L", "8.2L",
  
  // European V8/V12 sizes
  "4.4L V8", "4.8L V8", "5.2L V8", "5.5L V8", "6.0L V12", "6.5L V12",
  
  // Turbodiesel common sizes
  "1.5L TDI", "1.6L TDI", "1.9L TDI", "2.0L TDI", "2.5L TDI", "3.0L TDI",
  
  // High-performance
  "3.0L V6", "3.5L V6", "3.8L V6", "4.0L V6", "5.0L V8", "5.2L V10", 
  "5.5L V8", "6.2L V8", "6.3L V8", "6.4L V8", "6.6L V12",
  
  // Hybrid & Electric
  "Electric", "Hybrid", "Plug-in Hybrid",
  
  // Rotary (Wankel)
  "1.3L Rotary", "1.6L Rotary", "2.0L Rotary",
  
  // Diesel
  "1.5L Diesel", "1.6L Diesel", "1.9L Diesel", "2.0L Diesel", "2.2L Diesel",
  "2.5L Diesel", "3.0L Diesel", "3.2L Diesel", "3.5L Diesel", "4.0L Diesel",
  "4.5L Diesel", "5.0L Diesel", "6.0L Diesel"
];

// Categorized engine codes
export const ENGINE_CODES_BY_MANUFACTURER: Record<string, string[]> = {
  TOYOTA: [
    "1NZ-FE", "2NZ-FE", "1ZZ-FE", "2ZZ-GE", "1ZR-FE", "2ZR-FE", 
    "1GR-FE", "2GR-FE", "1UR-FE", "2UR-GSE", "2JZ-GE", "2JZ-GTE",
    "1JZ-GE", "3S-GE", "3S-GTE", "1UZ-FE", "2UZ-FE", "3UZ-FE"
  ],
  HONDA: [
    "D16A", "D16Y", "B16A", "B16B", "B18C", "B20B", 
    "F20C", "H22A", "K20A", "K20C", "K24A", "K24Z",
    "J30A", "J32A", "J35A", "J35Y", "L15A", "L15B"
  ],
  NISSAN: [
    "SR20DE", "SR20DET", "RB20DET", "RB25DET", "RB26DETT",
    "VQ30DE", "VQ35DE", "VQ37VHR", "VQ40DE",
    "VK45DE", "VK50VE", "VK56DE", "VR38DETT",
    "KA24DE", "MR16DDT", "QR25DE"
  ],
  MAZDA: [
    "BP-ZE", "BP-4W", "FS-DE", "KL-DE", "KL-ZE",
    "L3-VE", "L3-VDT", "13B-MSP", "13B-REW", "20B-REW",
    "SKYACTIV-G 2.0", "SKYACTIV-G 2.5"
  ],
  SUBARU: [
    "EJ20", "EJ25", "EJ205", "EJ207", "EJ251", "EJ253", "EJ255", "EJ257",
    "EZ30", "EZ36", "FA20", "FA20F", "FA24", "FB20", "FB25"
  ],
  MITSUBISHI: [
    "4G15", "4G18", "4G63", "4G64", "4G69",
    "4B10", "4B11", "4B12",
    "6A12", "6A13", "6G72", "6G74", "6G75"
  ],
  VW_AUDI: [
    "EA111", "EA113", "EA211", "EA888",
    "1.8T", "2.0 TSI", "2.0 TFSI", "3.0 TFSI", "4.0 TFSI",
    "1.9 TDI", "2.0 TDI", "3.0 TDI", "4.0 TDI",
    "VR6 2.8", "VR6 3.2", "VR6 3.6"
  ],
  BMW: [
    "M20", "M30", "M42", "M44", "M50", "M52", "M54",
    "M60", "M62", "M70", "M73",
    "N20", "N52", "N54", "N55", "N57", "N62", "N63", "N74",
    "B38", "B48", "B58",
    "S14", "S38", "S50", "S52", "S54", "S62", "S65", "S85"
  ],
  MERCEDES: [
    "M111", "M112", "M113", "M116", "M117", "M119", "M120",
    "M156", "M157", "M159", "M176", "M177", "M178",
    "M270", "M274", "M275", "M276", "M278",
    "OM602", "OM603", "OM605", "OM606",
    "OM611", "OM612", "OM613", "OM642", "OM646", "OM651", "OM654"
  ],
  FORD: [
    "Zetec 1.8", "Zetec 2.0",
    "Duratec 2.0", "Duratec 2.3", "Duratec 2.5",
    "EcoBoost 1.0", "EcoBoost 1.5", "EcoBoost 2.0", "EcoBoost 2.3",
    "EcoBoost 3.5",
    "Coyote 5.0", "Voodoo 5.2", "Predator 5.2",
    "Power Stroke 6.7"
  ],
  GM_CHEVROLET: [
    "LS1", "LS2", "LS3", "LS6", "LS7", "LS9", "LSA",
    "LT1", "LT2", "LT4",
    "Small Block 5.7", "Small Block 6.2",
    "EcoTec 1.4", "EcoTec 2.0", "EcoTec 2.4",
    "3.6 V6", "5.3 V8", "6.2 V8",
    "Duramax 6.6"
  ],
  HYUNDAI_KIA: [
    "Alpha 1.6", "Beta 2.0",
    "Theta 2.0", "Theta 2.4",
    "Gamma 1.6",
    "Lambda 3.3", "Lambda 3.8",
    "Tau 4.6", "Tau 5.0",
    "Smartstream 2.5"
  ],
  PORSCHE: [
    "M96", "M97", "MA1", "9A1",
    "3.4 Boxer", "3.6 Boxer", "3.8 Boxer", "4.0 Boxer",
    "2.5 Turbo", "4.8 V8"
  ],
  JAGUAR_LAND_ROVER: [
    "AJ-V6", "AJ-V8", "AJ-133", "AJ-126",
    "Ingenium 2.0", "Ingenium 3.0",
    "5.0 V8", "3.0 Diesel"
  ],
  VOLVO: [
    "B4204T", "B5234T", "B5244T", "B5254T",
    "D4204T", "D5244T",
    "T4", "T5", "T6", "T8",
    "2.0 Drive-E"
  ],
  RENAULT_NISSAN: [
    "K4M", "K7M", "K9K",
    "F4R", "F9Q",
    "M9R", "M9T",
    "1.2 TCE", "1.6 TCE", "2.0 TCE",
    "1.5 dCi", "1.6 dCi", "2.0 dCi"
  ]
};

// export const ALL_ENGINE_CODES = Object.values(ENGINE_CODES_BY_MANUFACTURER).flat();

export function getCommonTrims(brand: string): string[] {
  const formattedBrand = brand.trim().toLowerCase();

  const brandKey = Object.keys(COMMON_TRIMS).find(
    key => key.toLowerCase() === formattedBrand
  );

  if (!brandKey) return [];

  return COMMON_TRIMS[brandKey];
}

export function getEngineCode(brand: string): string[] {
  const formattedBrand = brand.trim().toLowerCase();

  const brandKey = Object.keys(ENGINE_CODES_BY_MANUFACTURER).find(
    key => key.toLowerCase() === formattedBrand
  );

  if (!brandKey) return [];

  return ENGINE_CODES_BY_MANUFACTURER[brandKey];
}