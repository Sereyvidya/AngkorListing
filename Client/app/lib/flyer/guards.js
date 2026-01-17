export function hasMinimumFlyerData({ formData, images }) {
  return Boolean(
    formData.propertyTitle?.trim() ||
    formData.address?.trim() ||
    images?.length > 0
  );
}
