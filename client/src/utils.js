export const formatPrice = (price) => {
  return `₹${Number(price).toLocaleString('en-IN')}`;
};

export const parseGallery = (gallery) => {
  if (!gallery) return [];
  return gallery.split(',').filter(Boolean);
};
