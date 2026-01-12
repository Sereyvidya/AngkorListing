import { create } from "zustand";

export const usePropertyStore = create((set) => ({
  formData: {
    propertyTitle: "",
    address: "",
    price: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    description: "",
    agentName: "",
    agentPhone: "",
    agentEmail: "",
    agentPhoto: null,
    agentQrCode: null,
  },
  images: [], // store previews/base64 strings, not File objects

  setFormData: (partial) =>
    set((state) => ({
      formData: { ...state.formData, ...partial },
    })),

  setImages: (images) => set({ images }),

  addImages: (newImages) =>
    set((state) => ({ images: [...state.images, ...newImages] })),

  removeImage: (index) =>
    set((state) => ({ images: state.images.filter((_, i) => i !== index) })),

  reset: () =>
    set({
      formData: {
        propertyTitle: "",
        address: "",
        price: "",
        propertyType: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
        description: "",
        agentName: "",
        agentPhone: "",
        agentEmail: "",
        agentPhoto: null,
        agentQrCode: null,
      },
      images: [],
    }),
}));
