 const COMMON_TRIMS = {
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
  "1.0L", "1.2L", "1.4L", "1.6L", "1.8L", "2.0L", 
  "2.4L", "2.5L", "3.0L V6", "3.5L V6", "4.0L V8", "5.0L V8", "Electric"
];

export function getCommonTrims(brand: string): string[] {
  const formattedBrand = brand.trim().toLowerCase();
  const brandKey = Object.keys(COMMON_TRIMS).find(
    (key) => key.toLowerCase() === formattedBrand
  );
  return COMMON_TRIMS[brandKey] || [];
}