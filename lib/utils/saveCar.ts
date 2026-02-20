export const getSavedCars = (): string[] => {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem("savedCars");
  return saved ? JSON.parse(saved) : [];
};

export const saveCar = (slug: string) => {
  const saved = getSavedCars();

  if (!saved.includes(slug)) {
    const updated = [...saved, slug];
    localStorage.setItem("savedCars", JSON.stringify(updated));
  }
};

export const removeSavedCar = (slug: string) => {
  const saved = getSavedCars();
  const updated = saved.filter((s) => s !== slug);
  localStorage.setItem("savedCars", JSON.stringify(updated));
};

export const isCarSaved = (slug: string) => {
  const saved = getSavedCars();
  return saved.includes(slug);
};