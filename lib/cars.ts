
export async function getAllBrands() {
  const res = await fetch(
    "https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json",
    { next: { revalidate: 86400 } } // cache 24h
  );
  const data = await res.json();
  return data.Results as { Make_ID: number; Make_Name: string }[];
}

export async function getModelsForBrand(make: string) {
  if (!make) return [];
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${make}?format=json`,
    { next: { revalidate: 86400 } }
  );
  const data = await res.json();
  return data.Results as { Make_Name: string; Model_Name: string }[];
}