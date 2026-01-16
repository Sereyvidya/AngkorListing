"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { propertyTypes } from "../constants/propertyTypes";
import {
  User,
  Phone,
  Mail,
  Facebook,
  Send,
  Instagram,
  Music2,
  Home,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  Building2,
  Image as ImageIcon,
  Images,
} from "lucide-react";

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

function validateForm(formData, images = []) {
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

  // Property images
  if (!images || images.length < 1) {
    errors.images = "Please upload at least 1 property photo.";
  }

  // Agent required
  if (!agentName) errors.agentName = "Agent name is required.";

  // Phone & Email are required
  if (!phone) {
    errors.agentPhone = "Phone number is required.";
  } else if (!isValidPhone(phone)) {
    errors.agentPhone = "Phone number looks too short.";
  }

  if (!email) {
    errors.agentEmail = "Email is required.";
  } else if (!emailRegex.test(email)) {
    errors.agentEmail = "Please enter a valid email address.";
  }

  if (!emailRegex.test(email)) {
    errors.agentEmail = "Please enter a valid email address.";
  }

  if (!isValidPhone(phone)) {
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

function InputWithIcon({ icon: Icon, inputProps, hasError }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
        <Icon size={16} />
      </span>

      <input
        {...inputProps}
        className={[
          "form-input-focus h-10 w-full rounded-md border bg-white py-2 pr-4 pl-10 text-gray-900",
          hasError ? "border-red-300 ring-1 ring-red-200" : "border-gray-300",
        ].join(" ")}
      />
    </div>
  );
}

function FileInput({ icon: Icon, label, onChange, onClear, accept, file }) {
  const inputId = `${label.replace(/\s+/g, "-").toLowerCase()}-input`;

  return (
    <div>
      <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>

      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <label
            htmlFor={inputId}
            className="relative inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
              <Icon size={16} />
            </span>
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
    </div>
  );
}

function MultiFileInput({ icon: Icon, label, onChange, files }) {
  const inputId = `${label.replace(/\s+/g, "-").toLowerCase()}-input`;

  return (
    <div>
      <div className="mb-2 text-sm font-medium text-gray-700">
        {label} <span className="text-red-500">*</span>
      </div>

      <div className="flex items-center gap-3">
        <label
          htmlFor={inputId}
          className="relative inline-flex cursor-pointer items-center rounded-md border border-gray-300 bg-white px-4 py-2 pl-10 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
            <Icon size={16} />
          </span>
          Choose file
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
  onClearAgentPhoto,
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
    return current || null; // don't default to first option
  }, [formData.propertyType]);

  const validateAndSetWith = (
    nextFormData,
    nextImages,
    nextTouchedAll = false
  ) => {
    const nextErrors = validateForm(nextFormData, nextImages);
    setErrors(nextErrors);

    if (nextTouchedAll) {
      setTouched((prev) => ({ ...prev, images: true }));
    }

    return nextErrors;
  };

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
    const nextErrors = validateForm(formData, images);
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
        images: true,
        agentName: true,
        agentPhone: true,
        agentEmail: true,
        agentFacebook: true,
        agentTelegram: true,
        agentInstagram: true,
        agentTiktok: true,
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
      "images",
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
        <h1 className="text-2xl font-semibold text-gray-900">
          General Information
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Fill in the basics first — you can fine-tune photos and captions
          later.
        </p>
      </div>

      {/* Error summary */}
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
              <InputWithIcon
                icon={Home}
                hasError={touched.propertyTitle && errors.propertyTitle}
                inputProps={{
                  ref: (n) => (fieldRefs.current.propertyTitle = n),
                  type: "text",
                  id: "propertyTitle",
                  name: "propertyTitle",
                  value: formData.propertyTitle,
                  onChange: onInputChange,
                  onBlur: () => {
                    markTouched("propertyTitle");
                    validateAndSet(false);
                  },
                  placeholder: "Beautiful 3BR Villa in Phnom Penh",
                  "aria-invalid": Boolean(
                    touched.propertyTitle && errors.propertyTitle
                  ),
                }}
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
              <InputWithIcon
                icon={MapPin}
                hasError={touched.address && errors.address}
                inputProps={{
                  ref: (n) => (fieldRefs.current.address = n),
                  type: "text",
                  id: "address",
                  name: "address",
                  value: formData.address,
                  onChange: onInputChange,
                  onBlur: () => {
                    markTouched("address");
                    validateAndSet(false);
                  },
                  placeholder: "Full address",
                  "aria-invalid": Boolean(touched.address && errors.address),
                }}
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
                      "form-input-focus h-10 w-full rounded-md border bg-white py-2 pr-4 pl-10 text-right text-gray-900 tabular-nums",
                      touched.price && errors.price
                        ? "border-red-300 ring-1 ring-red-200"
                        : "border-gray-300",
                    ].join(" ")}
                    placeholder="0"
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
                      "form-input-focus relative flex h-10 w-full items-center justify-between rounded-md border bg-white py-2 pr-4 pl-10 text-left text-gray-900",
                      touched.propertyType && errors.propertyType
                        ? "border-red-300 ring-1 ring-red-200"
                        : "border-gray-300",
                    ].join(" ")}
                    aria-haspopup="listbox"
                    aria-expanded={isPropertyTypeOpen}
                  >
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-500">
                      <Building2 size={16} />
                    </span>

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
                  Bedrooms
                </label>
                <InputWithIcon
                  icon={BedDouble}
                  hasError={touched.bedrooms && errors.bedrooms}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.bedrooms = n),
                    type: "number",
                    id: "bedrooms",
                    name: "bedrooms",
                    value: formData.bedrooms,
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("bedrooms");
                      validateAndSet(false);
                    },
                    placeholder: "0",
                    min: "0",
                    step: "1",
                  }}
                />

                <ErrorText>{touched.bedrooms ? errors.bedrooms : ""}</ErrorText>
              </div>

              <div>
                <label
                  htmlFor="bathrooms"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Bathrooms
                </label>
                <InputWithIcon
                  icon={Bath}
                  hasError={touched.bathrooms && errors.bathrooms}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.bathrooms = n),
                    type: "number",
                    id: "bathrooms",
                    name: "bathrooms",
                    value: formData.bathrooms,
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("bathrooms");
                      validateAndSet(false);
                    },
                    placeholder: "0",
                    min: "0",
                    step: "1",
                  }}
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
                  Size (sqm)
                </label>
                <InputWithIcon
                  icon={Ruler}
                  hasError={touched.size && errors.size}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.size = n),
                    type: "number",
                    id: "size",
                    name: "size",
                    value: formData.size,
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("size");
                      validateAndSet(false);
                    },
                    placeholder: "0",
                    min: "0",
                    step: "1",
                  }}
                />

                <ErrorText>{touched.size ? errors.size : ""}</ErrorText>
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
                onBlur={(e) => {
                  const trimmed = e.target.value.trim();
                  if (trimmed !== e.target.value) {
                    onInputChange({
                      target: {
                        name: "description",
                        value: trimmed,
                      },
                    });
                  }
                }}
                maxLength={400}
                className="form-input-focus w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900"
                rows={4}
                placeholder="Highlight the best features, nearby landmarks, and what makes it special."
              />
              {formData.description && (
                <p
                  className={[
                    "mt-1 text-xs",
                    formData.description.length === 400
                      ? "text-red-600"
                      : formData.description.length >= 350
                        ? "text-amber-600"
                        : "text-gray-500",
                  ].join(" ")}
                >
                  {formData.description.length}/400 characters
                  {formData.description.length === 400
                    ? " — limit reached"
                    : formData.description.length >= 350
                      ? " — almost at limit"
                      : ""}
                </p>
              )}
            </div>

            <div
              ref={(n) => (fieldRefs.current.images = n)}
              className={[
                "rounded-lg py-3",
                touched.images && errors.images
                  ? "border border-red-300 bg-red-50/40"
                  : "border border-transparent",
              ].join(" ")}
            >
              <MultiFileInput
                icon={Images}
                label="Property Images"
                files={images}
                onChange={(e) => {
                  onImageChange(e);
                  markTouched("images");

                  const selectedCount = e.target.files?.length ?? 0;
                  const nextImages =
                    selectedCount > 0 ? new Array(selectedCount).fill({}) : [];
                  validateAndSetWith(formData, nextImages, false);
                }}
              />

              <ErrorText>{touched.images ? errors.images : ""}</ErrorText>

              {images?.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
              <InputWithIcon
                icon={User}
                hasError={touched.agentName && errors.agentName}
                inputProps={{
                  ref: (n) => (fieldRefs.current.agentName = n),
                  type: "text",
                  id: "agentName",
                  name: "agentName",
                  value: formData.agentName,
                  onChange: onInputChange,
                  onBlur: () => {
                    markTouched("agentName");
                    validateAndSet(false);
                  },
                  placeholder: "Sok Sokha",
                  "aria-invalid": Boolean(
                    touched.agentName && errors.agentName
                  ),
                }}
              />

              <ErrorText>{touched.agentName ? errors.agentName : ""}</ErrorText>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="agentPhone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Phone <span className="text-red-500">*</span>
                </label>

                <InputWithIcon
                  icon={Phone}
                  hasError={touched.agentPhone && errors.agentPhone}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.agentPhone = n),
                    type: "tel",
                    id: "agentPhone",
                    name: "agentPhone",
                    value: formData.agentPhone,
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("agentPhone");
                      markTouched("agentContact");
                      validateAndSet(false);
                    },
                    placeholder: "+855...",
                  }}
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
                  Email <span className="text-red-500">*</span>
                </label>

                <InputWithIcon
                  icon={Mail}
                  hasError={touched.agentEmail && errors.agentEmail}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.agentEmail = n),
                    type: "email",
                    id: "agentEmail",
                    name: "agentEmail",
                    value: formData.agentEmail,
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("agentEmail");
                      markTouched("agentContact");
                      validateAndSet(false);
                    },
                    placeholder: "agent@example.com",
                  }}
                />

                <ErrorText>
                  {touched.agentEmail ? errors.agentEmail : ""}
                </ErrorText>
              </div>

              <div>
                <label
                  htmlFor="agentFacebook"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Facebook (name / page)
                </label>

                <InputWithIcon
                  icon={Facebook}
                  hasError={false}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.agentFacebook = n),
                    type: "text",
                    id: "agentFacebook",
                    name: "agentFacebook",
                    value: formData.agentFacebook || "",
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("agentFacebook");
                      markTouched("agentContact");
                      validateAndSet(false);
                    },
                    placeholder: "Sokha Realty",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="agentTelegram"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Telegram (username / number)
                </label>

                <InputWithIcon
                  icon={Send}
                  hasError={false}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.agentTelegram = n),
                    type: "text",
                    id: "agentTelegram",
                    name: "agentTelegram",
                    value: formData.agentTelegram || "",
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("agentTelegram");
                      markTouched("agentContact");
                      validateAndSet(false);
                    },
                    placeholder: "@sokha_agent",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="agentInstagram"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Instagram (username)
                </label>

                <InputWithIcon
                  icon={Instagram}
                  hasError={false}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.agentInstagram = n),
                    type: "text",
                    id: "agentInstagram",
                    name: "agentInstagram",
                    value: formData.agentInstagram || "",
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("agentInstagram");
                      markTouched("agentContact");
                      validateAndSet(false);
                    },
                    placeholder: "sokha.realty",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="agentTiktok"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  TikTok (username)
                </label>

                <InputWithIcon
                  icon={Music2}
                  hasError={false}
                  inputProps={{
                    ref: (n) => (fieldRefs.current.agentTiktok = n),
                    type: "text",
                    id: "agentTiktok",
                    name: "agentTiktok",
                    value: formData.agentTiktok || "",
                    onChange: onInputChange,
                    onBlur: () => {
                      markTouched("agentTiktok");
                      markTouched("agentContact");
                      validateAndSet(false);
                    },
                    placeholder: "@sokha_realestate",
                  }}
                />
              </div>
            </div>

            {/* Media: agent photo */}
            <div className="grid grid-cols-1">
              <FileInput
                icon={ImageIcon}
                label="Agent Photo"
                accept="image/*"
                file={formData.agentPhoto}
                onChange={onAgentPhotoChange}
                onClear={onClearAgentPhoto}
              />
            </div>
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
