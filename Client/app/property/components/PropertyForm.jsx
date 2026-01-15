"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { propertyTypes } from "../constants/propertyTypes";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizePhone(value = "") {
  return value.replace(/[^\d+]/g, "");
}

function isValidPhone(value = "") {
  const v = normalizePhone(value);
  if (!v) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 9; // min phone number length
}

function validateForm(formData) {
  const errors = {};

  const title = (formData.propertyTitle || "").trim();
  const address = (formData.address || "").trim();
  const type = (formData.propertyType || "").trim();
  const agentName = (formData.agentName || "").trim();
  const phone = (formData.agentPhone || "").trim();
  const email = (formData.agentEmail || "").trim();

  // Required: property basics
  if (!title) errors.propertyTitle = "Property title is required.";
  else if (title.length < 6)
    errors.propertyTitle = "Title should be at least 6 characters.";

  if (!address) errors.address = "Address is required.";
  else if (address.length < 6)
    errors.address = "Address should be more specific.";

  // Price
  const priceRaw = formData.price;
  const cleanedPrice = String(priceRaw ?? "").replace(/[,\s]/g, "");
  const priceNum = Number(cleanedPrice);
  if (priceRaw === "" || priceRaw === null || priceRaw === undefined) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(priceNum) || priceNum <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  // Type
  if (!type) errors.propertyType = "Please select a property type.";

  // Bedroom, bathroom, size
  const beds = formData.bedrooms === "" ? null : Number(formData.bedrooms);
  const baths = formData.bathrooms === "" ? null : Number(formData.bathrooms);
  const size = formData.size === "" ? null : Number(formData.size);

  if (beds !== null && (Number.isNaN(beds) || beds < 0))
    errors.bedrooms = "Must be 0 or more.";
  if (baths !== null && (Number.isNaN(baths) || baths < 0))
    errors.bathrooms = "Must be 0 or more.";
  if (size !== null && (Number.isNaN(size) || size < 0))
    errors.size = "Must be 0 or more.";

  // Agent required
  if (!agentName) errors.agentName = "Agent name is required.";

  // Require at least one contact method
  const hasPhone = phone.length > 0;
  const hasEmail = email.length > 0;

  if (!hasPhone && !hasEmail) {
    errors.agentContact = "Add at least a phone number or an email.";
  }

  if (hasEmail && !emailRegex.test(email)) {
    errors.agentEmail = "Please enter a valid email address.";
  }

  if (hasPhone && !isValidPhone(phone)) {
    errors.agentPhone = "Phone number looks too short.";
  }

  return errors;
}

function fieldClass(hasError) {
  return [
    "form-input-focus w-full h-10 rounded-md border bg-white px-4 py-2 text-gray-900",
    hasError ? "border-red-300 ring-1 ring-red-200" : "border-gray-300",
  ].join(" ");
}

function ErrorText({ children }) {
  if (!children) return null;
  return <p className="mt-1 text-sm text-red-600">{children}</p>;
}

function FileInput({ label, onChange, onClear, accept, file }) {
  const inputId = `${label.replace(/\s+/g, "-").toLowerCase()}-input`;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <div className="mb-2 text-sm font-medium text-gray-700">
        {label} <span className="text-xs text-gray-500">(optional)</span>
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Choose file
        </label>

        <input
          id={inputId}
          type="file"
          accept={accept}
          onChange={onChange}
          className="hidden"
        />

        <span className="text-sm text-gray-500">
          {file?.name || "No file chosen"}
        </span>
      </div>

      <button
        type="button"
        onClick={onClear}
        className="mt-3 text-sm text-gray-600 hover:text-gray-900"
      >
        Clear
      </button>
    </div>
  );
}

function MultiFileInput({ label, onChange, files }) {
  const inputId = `${label.replace(/\s+/g, "-").toLowerCase()}-input`;

  return (
    <div>
      <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>

      <div className="flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Choose files
        </label>

        <input
          id={inputId}
          type="file"
          accept="image/*"
          multiple
          onChange={onChange}
          className="hidden"
        />

        <span className="text-sm text-gray-500">
          {files?.length
            ? `${files.length} file${files.length > 1 ? "s" : ""} selected`
            : "No files chosen"}
        </span>
      </div>
    </div>
  );
}

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
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({}); // {field: true}

  const propertyTypeRef = useRef(null);
  const propertyTypeButtonRef = useRef(null);

  // refs to scroll to first error
  const fieldRefs = useRef({});

  const selectedPropertyType = useMemo(() => {
    const current = propertyTypes.find(
      (t) => t.value === formData.propertyType
    );
    return current || null; // IMPORTANT: don't default to first option
  }, [formData.propertyType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        propertyTypeRef.current &&
        !propertyTypeRef.current.contains(event.target)
      ) {
        setIsPropertyTypeOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markTouched = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateAndSet = (nextTouchedAll = false) => {
    const nextErrors = validateForm(formData);
    setErrors(nextErrors);

    if (nextTouchedAll) {
      // mark all fields we validate as touched so messages show
      setTouched((prev) => ({
        ...prev,
        propertyTitle: true,
        address: true,
        price: true,
        propertyType: true,
        bedrooms: true,
        bathrooms: true,
        size: true,
        agentName: true,
        agentPhone: true,
        agentEmail: true,
        agentContact: true,
      }));
    }

    return nextErrors;
  };

  const scrollToFirstError = (nextErrors) => {
    const order = [
      "propertyTitle",
      "address",
      "price",
      "propertyType",
      "bedrooms",
      "bathrooms",
      "size",
      "agentName",
      "agentContact",
      "agentPhone",
      "agentEmail",
    ];

    const firstKey = order.find((k) => nextErrors[k]);
    if (!firstKey) return;

    const node = fieldRefs.current[firstKey];
    if (node?.scrollIntoView) {
      node.scrollIntoView({ behavior: "smooth", block: "center" });
      node.focus?.();
    }
  };

  const handlePropertyTypeToggle = () => {
    setIsPropertyTypeOpen((v) => !v);
    setTimeout(() => propertyTypeButtonRef.current?.focus(), 0);
  };

  const handleSelectType = (value) => {
    onPropertyTypeSelect(value);
    markTouched("propertyType");
    setIsPropertyTypeOpen(false);

    // revalidate on selection if user has started interacting
    if (Object.keys(touched).length > 0) {
      const next = validateForm({ ...formData, propertyType: value });
      setErrors(next);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nextErrors = validateAndSet(true);
    if (Object.keys(nextErrors).length > 0) {
      scrollToFirstError(nextErrors);
      return;
    }

    onSubmit?.(e);
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create Listing</h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the basics first — you can fine-tune photos and captions
          later.
        </p>
      </div>

      {/* Optional summary */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Please fix the highlighted fields below.
        </div>
      )}

      <form className="space-y-10" onSubmit={handleSubmit} noValidate>
        {/* Listing Details Section */}
        <section>
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xl font-medium text-gray-900">
              Listing Details
            </h2>
            <span className="text-xs text-gray-500">* required</span>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="propertyTitle"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <input
                ref={(n) => (fieldRefs.current.propertyTitle = n)}
                type="text"
                id="propertyTitle"
                name="propertyTitle"
                value={formData.propertyTitle}
                onChange={onInputChange}
                onBlur={() => {
                  markTouched("propertyTitle");
                  validateAndSet(false);
                }}
                className={fieldClass(
                  touched.propertyTitle && errors.propertyTitle
                )}
                placeholder="e.g., Beautiful 3BR Villa in Phnom Penh"
                aria-invalid={Boolean(
                  touched.propertyTitle && errors.propertyTitle
                )}
              />
              <ErrorText>
                {touched.propertyTitle ? errors.propertyTitle : ""}
              </ErrorText>
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Address <span className="text-red-500">*</span>
              </label>
              <input
                ref={(n) => (fieldRefs.current.address = n)}
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={onInputChange}
                onBlur={() => {
                  markTouched("address");
                  validateAndSet(false);
                }}
                className={fieldClass(touched.address && errors.address)}
                placeholder="Full address"
                aria-invalid={Boolean(touched.address && errors.address)}
              />
              <ErrorText>{touched.address ? errors.address : ""}</ErrorText>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Price (USD) <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    ref={(n) => (fieldRefs.current.price = n)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={onInputChange}
                    onBlur={() => {
                      markTouched("price");
                      validateAndSet(false);
                    }}
                    className={[
                      fieldClass(touched.price && errors.price),
                      "pl-7 text-right tabular-nums",
                    ].join(" ")}
                    placeholder="0"
                    min="0"
                    step="1"
                    aria-invalid={Boolean(touched.price && errors.price)}
                  />
                </div>

                <ErrorText>{touched.price ? errors.price : ""}</ErrorText>
              </div>

              {/* Property Type */}
              <div>
                <label
                  htmlFor="propertyType"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Property Type <span className="text-red-500">*</span>
                </label>

                <div className="relative" ref={propertyTypeRef}>
                  <button
                    ref={(n) => {
                      propertyTypeButtonRef.current = n;
                      fieldRefs.current.propertyType = n;
                    }}
                    type="button"
                    id="propertyType"
                    onClick={handlePropertyTypeToggle}
                    onBlur={() => {
                      markTouched("propertyType");
                      validateAndSet(false);
                    }}
                    className={[
                      "form-input-focus flex h-10 w-full items-center justify-between rounded-md border bg-white px-4 py-2 text-left text-gray-900",
                      touched.propertyType && errors.propertyType
                        ? "border-red-300 ring-1 ring-red-200"
                        : "border-gray-300",
                    ].join(" ")}
                    aria-haspopup="listbox"
                    aria-expanded={isPropertyTypeOpen}
                  >
                    <span
                      className={selectedPropertyType ? "" : "text-gray-400"}
                    >
                      {selectedPropertyType
                        ? selectedPropertyType.label
                        : "Select a type…"}
                    </span>
                    <span className="ml-2 text-gray-500">▾</span>
                  </button>

                  {isPropertyTypeOpen && (
                    <div
                      className="absolute z-10 mt-2 w-full rounded-md border border-gray-200 bg-white shadow-lg"
                      role="listbox"
                      aria-label="Property type"
                    >
                      {propertyTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => handleSelectType(type.value)}
                          className={[
                            "w-full px-4 py-2 text-left text-sm hover:bg-gray-50",
                            formData.propertyType === type.value
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-900",
                          ].join(" ")}
                          role="option"
                          aria-selected={formData.propertyType === type.value}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  )}

                  <ErrorText>
                    {touched.propertyType ? errors.propertyType : ""}
                  </ErrorText>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="bedrooms"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Bedrooms{" "}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <input
                  ref={(n) => (fieldRefs.current.bedrooms = n)}
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={onInputChange}
                  onBlur={() => {
                    markTouched("bedrooms");
                    validateAndSet(false);
                  }}
                  className={fieldClass(touched.bedrooms && errors.bedrooms)}
                  placeholder="0"
                  min="0"
                  step="1"
                />
                <ErrorText>{touched.bedrooms ? errors.bedrooms : ""}</ErrorText>
              </div>

              <div>
                <label
                  htmlFor="bathrooms"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Bathrooms{" "}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <input
                  ref={(n) => (fieldRefs.current.bathrooms = n)}
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={onInputChange}
                  onBlur={() => {
                    markTouched("bathrooms");
                    validateAndSet(false);
                  }}
                  className={fieldClass(touched.bathrooms && errors.bathrooms)}
                  placeholder="0"
                  min="0"
                  step="1"
                />
                <ErrorText>
                  {touched.bathrooms ? errors.bathrooms : ""}
                </ErrorText>
              </div>

              <div>
                <label
                  htmlFor="size"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Size (sqm){" "}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <input
                  ref={(n) => (fieldRefs.current.size = n)}
                  type="number"
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={onInputChange}
                  onBlur={() => {
                    markTouched("size");
                    validateAndSet(false);
                  }}
                  className={fieldClass(touched.size && errors.size)}
                  placeholder="0"
                  min="0"
                  step="1"
                />
                <ErrorText>{touched.size ? errors.size : ""}</ErrorText>
              </div>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description{" "}
                <span className="text-xs text-gray-500">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                rows={4}
                placeholder="Highlight the best features, nearby landmarks, and what makes it special."
              />
              <p className="mt-1 text-xs text-gray-500">
                Tip: 2–3 sentences works great for social captions.
              </p>
            </div>
          </div>
        </section>

        {/* Agent Details Section */}
        <section className="border-t pt-8">
          <h2 className="mb-4 text-xl font-medium text-gray-900">
            Agent Details
          </h2>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="agentName"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Agent Name <span className="text-red-500">*</span>
              </label>
              <input
                ref={(n) => (fieldRefs.current.agentName = n)}
                type="text"
                id="agentName"
                name="agentName"
                value={formData.agentName}
                onChange={onInputChange}
                onBlur={() => {
                  markTouched("agentName");
                  validateAndSet(false);
                }}
                className={fieldClass(touched.agentName && errors.agentName)}
                placeholder="e.g., Alex Brave"
              />
              <ErrorText>{touched.agentName ? errors.agentName : ""}</ErrorText>
            </div>

            {/* Contact requirement note */}
            <div
              ref={(n) => (fieldRefs.current.agentContact = n)}
              className={[
                "rounded-md border p-3 text-sm",
                touched.agentContact && errors.agentContact
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-gray-200 bg-gray-50 text-gray-700",
              ].join(" ")}
            >
              Add at least <span className="font-medium">one</span>: phone or
              email.
              <ErrorText>
                {touched.agentContact ? errors.agentContact : ""}
              </ErrorText>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="agentPhone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone{" "}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <input
                  ref={(n) => (fieldRefs.current.agentPhone = n)}
                  type="tel"
                  id="agentPhone"
                  name="agentPhone"
                  value={formData.agentPhone}
                  onChange={onInputChange}
                  onBlur={() => {
                    markTouched("agentPhone");
                    markTouched("agentContact");
                    validateAndSet(false);
                  }}
                  className={fieldClass(
                    touched.agentPhone && errors.agentPhone
                  )}
                  placeholder="+855..."
                />
                <ErrorText>
                  {touched.agentPhone ? errors.agentPhone : ""}
                </ErrorText>
              </div>

              <div>
                <label
                  htmlFor="agentEmail"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Email{" "}
                  <span className="text-xs text-gray-500">(optional)</span>
                </label>
                <input
                  ref={(n) => (fieldRefs.current.agentEmail = n)}
                  type="email"
                  id="agentEmail"
                  name="agentEmail"
                  value={formData.agentEmail}
                  onChange={onInputChange}
                  onBlur={() => {
                    markTouched("agentEmail");
                    markTouched("agentContact");
                    validateAndSet(false);
                  }}
                  className={fieldClass(
                    touched.agentEmail && errors.agentEmail
                  )}
                  placeholder="agent@example.com"
                />
                <ErrorText>
                  {touched.agentEmail ? errors.agentEmail : ""}
                </ErrorText>
              </div>
            </div>

            {/* Media: agent photo + qr remain as you already have */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FileInput
                label="Agent Photo"
                accept="image/*"
                file={formData.agentPhoto}
                onChange={onAgentPhotoChange}
                onClear={onClearAgentPhoto}
              />

              <FileInput
                label="Agent QR Code"
                accept="image/*"
                file={formData.agentQrCode}
                onChange={onAgentQrChange}
                onClear={onClearAgentQr}
              />
            </div>
          </div>
        </section>

        {/* Property Images Section */}
        <section className="border-t pt-8">
          <h2 className="mb-2 text-xl font-medium text-gray-900">
            Property Images
          </h2>
          <p className="mb-4 text-sm text-gray-600">
            Best results with 4–8 photos. The first image usually works best as
            the “featured” photo.
          </p>

          <div className="space-y-4">
            <MultiFileInput
              label="Property Images"
              files={images}
              onChange={onImageChange}
            />

            {images?.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative overflow-hidden rounded-lg border border-gray-200"
                  >
                    <img
                      src={img.preview}
                      alt={`Uploaded ${idx + 1}`}
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveImage(idx)}
                      className="absolute top-2 right-2 rounded-md bg-white/90 px-2 py-1 text-xs text-gray-700 shadow hover:bg-white"
                    >
                      Remove
                    </button>
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 rounded-md bg-blue-600 px-2 py-1 text-xs text-white shadow">
                        Featured
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="flex items-center justify-end border-t pt-6">
          <button
            type="submit"
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}
