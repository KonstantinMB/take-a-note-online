
export const softColors = [
  "#F2FCE2", // Soft Green
  "#FEF7CD", // Soft Yellow
  "#FEC6A1", // Soft Orange
  "#E5DEFF", // Soft Purple
  "#FFDEE2", // Soft Pink
  "#FDE1D3", // Soft Peach
  "#D3E4FD", // Soft Blue
  "#F1F0FB", // Soft Gray
];

export const getCategoryInfo = (categoryId: string | null, categories: any[]) => {
  if (!categoryId) return { name: "General", color: "#9b87f5" };
  
  const category = categories.find(c => c.id === categoryId);
  return {
    name: category?.name || "General",
    color: category?.color || "#9b87f5"
  };
};
