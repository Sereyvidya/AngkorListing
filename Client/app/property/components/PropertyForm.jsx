"use client";

import { useEffect, useRef, useState } from "react";
import { propertyTypes } from "../constants/propertyTypes";

export default function PropertyForm({
  formData,
  images,
  onInputChange,
  onImageChange,
  onAgentPhotoChange,
  onAgentQrChange,
  onClearAgentPhoto,
  onClearAgentQr,
  onRemoveImage,
  onSubmit,
  onPropertyTypeSelect,
}) {
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);

  const propertyTypeRef = useRef(null);
  const propertyTypeButtonRef = useRef(null);

  const selectedPropertyType =
    propertyTypes.find((type) => type.value === formData.propertyType) ||
    propertyTypes[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        propertyTypeRef.current &&
        !propertyTypeRef.current.contains(event.target)
      ) {
        setIsPropertyTypeOpen(false);
      }
    };

    if (isPropertyTypeOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPropertyTypeOpen]);

  const handlePropertyTypeToggle = () => {
    setIsPropertyTypeOpen((v) => !v);
    // Ensure button receives focus to show focus styles
    setTimeout(() => {
      propertyTypeButtonRef.current?.focus();
    }, 0);
  };

  const handleSelectType = (value) => {
    onPropertyTypeSelect(value);
    setIsPropertyTypeOpen(false);
  };

  return (
    <div className="max-w-4xl rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-8 text-3xl font-semibold text-gray-900">
        New Property Listing
      </h1>

      <form className="space-y-8" onSubmit={onSubmit}>
        {/* Property Details Section */}
        <section>
          <h2 className="mb-4 text-xl font-medium text-gray-900">
            Property Details
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="propertyTitle"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Property Title
              </label>
              <input
                type="text"
                id="propertyTitle"
                name="propertyTitle"
                value={formData.propertyTitle}
                onChange={onInputChange}
                className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                placeholder="e.g., Beautiful 3BR Villa in Phnom Penh"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={onInputChange}
                className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                placeholder="Full address"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Price (USD)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={onInputChange}
                  className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                  placeholder="0"
                />
              </div>

              <div>
                <label
                  htmlFor="propertyType"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Property Type
                </label>

                <div className="relative" ref={propertyTypeRef}>
                  <button
                    type="button"
                    id="propertyType"
                    ref={propertyTypeButtonRef}
                    onClick={handlePropertyTypeToggle}
                    className="form-input-focus flex h-10.5 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-left text-gray-900"
                    aria-haspopup="listbox"
                    aria-expanded={isPropertyTypeOpen}
                  >
                    <span
                      className={
                        formData.propertyType === ""
                          ? "text-gray-400"
                          : "text-gray-900"
                      }
                    >
                      {selectedPropertyType.label}
                    </span>

                    <svg
                      className={`h-4 w-4 transition-transform ${
                        isPropertyTypeOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isPropertyTypeOpen && (
                    <div
                      className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg"
                      role="listbox"
                      aria-label="Property type"
                    >
                      {propertyTypes
                        .filter((type) => type.value !== "")
                        .map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => handleSelectType(type.value)}
                            className={`w-full px-4 py-2 text-left text-black first:rounded-t-md last:rounded-b-md hover:bg-gray-100 ${
                              formData.propertyType === type.value
                                ? "bg-gray-100 font-medium"
                                : ""
                            }`}
                            role="option"
                            aria-selected={formData.propertyType === type.value}
                          >
                            {type.label}
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={onInputChange}
                  className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label
                  htmlFor="bathrooms"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={onInputChange}
                  className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label
                  htmlFor="size"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Size (sq m)
                </label>
                <input
                  type="number"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={onInputChange}
                  className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows={5}
                className="form-input-focus resize-vertical w-full rounded-md border border-zinc-300 bg-white px-4 py-2 text-black"
                placeholder="Describe the property..."
              />
            </div>
          </div>
        </section>

        {/* Agent Section */}
        <section>
          <h2 className="mb-4 text-xl font-medium text-gray-900">
            Agent Information
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="agentName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Agent Name
              </label>
              <input
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={onInputChange}
                className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                placeholder="Agent name"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="agentPhone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="agentPhone"
                  name="agentPhone"
                  value={formData.agentPhone}
                  onChange={onInputChange}
                  className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                  placeholder="+855 12 345 678"
                />
              </div>

              <div>
                <label
                  htmlFor="agentEmail"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="agentEmail"
                  name="agentEmail"
                  value={formData.agentEmail}
                  onChange={onInputChange}
                  className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                  placeholder="agent@email.com"
                />
              </div>
            </div>
            {/* Agent Media */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Agent Profile Photo */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 text-sm font-medium text-gray-700">
                  Agent Profile Photo
                </div>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {formData.agentPhoto?.preview ? (
                    <img
                      src={formData.agentPhoto.preview}
                      alt="Agent profile preview"
                      className="h-20 w-20 rounded-full border border-gray-300 bg-white object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-white text-xs text-gray-500">
                      Photo
                    </div>
                  )}

                  {/* Upload */}
                  <div className="min-w-0 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAgentPhotoChange}
                      className="w-full cursor-pointer text-sm text-gray-700 file:mr-0 file:w-full file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:text-gray-700 hover:file:bg-gray-100"
                    />

                    {formData.agentPhoto?.preview && (
                      <button
                        type="button"
                        onClick={onClearAgentPhoto}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Agent QR Code */}
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-3 text-sm font-medium text-gray-700">
                  Agent QR Code
                </div>

                <div className="flex items-center gap-4">
                  {/* Preview */}
                  {formData.agentQrCode?.preview ? (
                    <img
                      src={formData.agentQrCode.preview}
                      alt="Agent QR code preview"
                      className="h-20 w-20 rounded-md border border-gray-300 bg-white object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-white text-xs text-gray-500">
                      QR
                    </div>
                  )}

                  {/* Upload */}
                  <div className="min-w-0 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onAgentQrChange}
                      className="w-full cursor-pointer text-sm text-gray-700 file:mr-0 file:w-full file:rounded-md file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:text-gray-700 hover:file:bg-gray-100"
                    />

                    {formData.agentQrCode?.preview && (
                      <button
                        type="button"
                        onClick={onClearAgentQr}
                        className="mt-2 text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Media Section */}
        <section>
          <h2 className="mb-4 text-xl font-medium text-gray-900">Media</h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="images"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Upload Images
              </label>
              <input
                type="file"
                id="images"
                name="images"
                accept="image/*"
                multiple
                onChange={onImageChange}
                className="form-input-focus w-full cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-4 file:py-1 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {images.map((image, index) => (
                  <div key={index} className="group relative">
                    <img
                      src={image.preview}
                      alt={image.name ? image.name : `Preview ${index + 1}`}
                      className="h-32 w-full rounded-md border border-gray-300 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(index)}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-8 py-3 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
          >
            Create Listing
          </button>
        </div>
      </form>
    </div>
  );
}
