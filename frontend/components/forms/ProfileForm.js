"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  getProfile,
  updateProfile,
  clearError,
} from "../../store/slices/authSlice";


const COLORS = {
  primary: '#C9B59C',
  lightBg: '#F9F8F6',
  secondaryBg: '#EFE9E3',
  border: '#D9CFC7',
  text: '#5D4037',
  textLight: '#8D6E63',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
};

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    reset,
    watch,
  } = useForm();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const formData = watch();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(updateProfile(data)).unwrap();
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {

    }
  };

  const handleCloseError = () => {
    dispatch(clearError());
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      reset();
    }
  };

  const inputClasses = (hasError) =>
    `w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
    } ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`;

  const labelClasses = (hasError) =>
    `block text-sm font-medium mb-2 ${
      hasError ? "text-red-700" : "text-gray-700"
    }`;

  return (
    <div 
      className="rounded-2xl shadow-lg border overflow-hidden"
      style={{ 
        backgroundColor: 'white',
        borderColor: COLORS.border
      }}
    >
      {/* Header */}
      <div 
        className="px-6 py-4 border-b"
        style={{ 
          backgroundColor: COLORS.secondaryBg,
          borderColor: COLORS.border
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: COLORS.primary }}
            >
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 
                className="text-xl font-bold"
                style={{ color: COLORS.text }}
              >
                Profile Information
              </h2>
              <p 
                className="text-sm"
                style={{ color: COLORS.textLight }}
              >
                Update your personal details and preferences
              </p>
            </div>
          </div>
          <button
            onClick={handleEditToggle}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              isEditing
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "text-white hover:opacity-90"
            }`}
            style={{ 
              backgroundColor: isEditing ? COLORS.secondaryBg : COLORS.primary
            }}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Success Message */}
        {showSuccess && (
          <div 
            className="mb-6 p-4 border rounded-xl flex items-center gap-3"
            style={{ 
              backgroundColor: '#ECFDF5',
              borderColor: COLORS.success
            }}
          >
            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.success }} />
            <div>
              <p 
                className="font-medium"
                style={{ color: COLORS.success }}
              >
                Profile updated successfully!
              </p>
              <p 
                className="text-sm"
                style={{ color: COLORS.success }}
              >
                Your changes have been saved.
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div 
            className="mb-6 p-4 border rounded-xl flex items-center gap-3"
            style={{ 
              backgroundColor: '#FEF2F2',
              borderColor: COLORS.error
            }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: COLORS.error }} />
            <div>
              <p 
                className="font-medium"
                style={{ color: COLORS.error }}
              >
                Update failed
              </p>
              <p 
                className="text-sm"
                style={{ color: COLORS.error }}
              >
                {error}
              </p>
            </div>
            <button
              onClick={handleCloseError}
              style={{ color: COLORS.error }}
              className="ml-auto hover:opacity-70"
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: COLORS.text }}
            >
              <User className="w-5 h-5" style={{ color: COLORS.primary }} />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className={labelClasses(!!errors.name)}>
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    id="name"
                    type="text"
                    disabled={!isEditing}
                    className={inputClasses(!!errors.name)}
                    placeholder="Enter your full name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Name must be less than 50 characters",
                      },
                    })}
                  />
                  {!errors.name && formData.name && (
                    <CheckCircle className="w-5 h-5 absolute right-3 top-3" style={{ color: COLORS.success }} />
                  )}
                </div>
                {errors.name && (
                  <p 
                    className="mt-1 text-sm flex items-center gap-1"
                    style={{ color: COLORS.error }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className={labelClasses(!!errors.email)}>
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    disabled
                    className="w-full px-4 py-3 border rounded-xl bg-gray-100 cursor-not-allowed"
                    style={{ borderColor: COLORS.border }}
                    placeholder="your@email.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  <Mail className="w-5 h-5 absolute right-3 top-3" style={{ color: COLORS.textLight }} />
                </div>
                <p 
                  className="mt-1 text-xs flex items-center gap-1"
                  style={{ color: COLORS.textLight }}
                >
                  <Shield className="w-3 h-3" />
                  Email cannot be changed for security reasons
                </p>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className={labelClasses(!!errors.phone)}>
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    type="tel"
                    disabled={!isEditing}
                    className={inputClasses(!!errors.phone)}
                    placeholder="+1 (555) 123-4567"
                    {...register("phone", {
                      pattern: {
                        value: /^[+]?[\d\s-()]+$/,
                        message: "Please enter a valid phone number",
                      },
                    })}
                  />
                  <Phone className="w-5 h-5 absolute right-3 top-3" style={{ color: COLORS.textLight }} />
                </div>
                {errors.phone && (
                  <p 
                    className="mt-1 text-sm flex items-center gap-1"
                    style={{ color: COLORS.error }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 
              className="text-lg font-semibold mb-4 flex items-center gap-2"
              style={{ color: COLORS.text }}
            >
              <MapPin className="w-5 h-5" style={{ color: COLORS.primary }} />
              Address Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Address Field */}
              <div>
                <label
                  htmlFor="address"
                  className={labelClasses(!!errors.address)}
                >
                  Street Address
                </label>
                <div className="relative">
                  <textarea
                    id="address"
                    disabled={!isEditing}
                    rows={3}
                    className={inputClasses(!!errors.address)}
                    placeholder="Enter your complete street address"
                    {...register("address", {
                      maxLength: {
                        value: 200,
                        message: "Address must be less than 200 characters",
                      },
                    })}
                  />
                  <MapPin className="w-5 h-5 absolute right-3 top-3" style={{ color: COLORS.textLight }} />
                </div>
                {errors.address && (
                  <p 
                    className="mt-1 text-sm flex items-center gap-1"
                    style={{ color: COLORS.error }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* City Field */}
                <div>
                  <label htmlFor="city" className={labelClasses(!!errors.city)}>
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    disabled={!isEditing}
                    className={inputClasses(!!errors.city)}
                    placeholder="City"
                    {...register("city")}
                  />
                </div>

                {/* State Field */}
                <div>
                  <label
                    htmlFor="state"
                    className={labelClasses(!!errors.state)}
                  >
                    State
                  </label>
                  <input
                    id="state"
                    type="text"
                    disabled={!isEditing}
                    className={inputClasses(!!errors.state)}
                    placeholder="State"
                    {...register("state")}
                  />
                </div>

                {/* ZIP Code Field */}
                <div>
                  <label
                    htmlFor="zipCode"
                    className={labelClasses(!!errors.zipCode)}
                  >
                    ZIP Code
                  </label>
                  <input
                    id="zipCode"
                    type="text"
                    disabled={!isEditing}
                    className={inputClasses(!!errors.zipCode)}
                    placeholder="ZIP Code"
                    {...register("zipCode", {
                      pattern: {
                        value: /^[0-9-]+$/,
                        message: "Please enter a valid ZIP code",
                      },
                    })}
                  />
                </div>

                {/* Country Field */}
                <div>
                  <label
                    htmlFor="country"
                    className={labelClasses(!!errors.country)}
                  >
                    Country
                  </label>
                  <input
                    id="country"
                    type="text"
                    disabled={!isEditing}
                    className={inputClasses(!!errors.country)}
                    placeholder="Country"
                    {...register("country")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          {isEditing && (
            <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: COLORS.border }}>
              <div className="text-sm">
                {isDirty && (
                  <span 
                    className="flex items-center gap-1"
                    style={{ color: COLORS.warning }}
                  >
                    <AlertCircle className="w-4 h-4" />
                    You have unsaved changes
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading || !isDirty}
                className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: COLORS.primary }}
                onMouseEnter={(e) => {
                  if (!isLoading && isDirty) {
                    e.currentTarget.style.backgroundColor = COLORS.text;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && isDirty) {
                    e.currentTarget.style.backgroundColor = COLORS.primary;
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}

          {/* Security Notice */}
          {!isEditing && (
            <div 
              className="border rounded-xl p-4 mt-6"
              style={{ 
                backgroundColor: COLORS.secondaryBg,
                borderColor: COLORS.primary
              }}
            >
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: COLORS.primary }} />
                <div>
                  <p 
                    className="font-medium"
                    style={{ color: COLORS.text }}
                  >
                    Your information is secure
                  </p>
                  <p 
                    className="text-sm mt-1"
                    style={{ color: COLORS.textLight }}
                  >
                    We use encryption to protect your personal data. Click "Edit
                    Profile" to make changes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;