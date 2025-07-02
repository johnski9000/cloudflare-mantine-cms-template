"use client";
import React, { useState } from "react";
import { igniteString, igniteArray } from "defaultprops";

export const ContactSectionProps = {
  id: igniteString("contact-section"),
  title: igniteString("Contact Setoria Security for Expert Security Solutions"),
  subtitle: igniteString(
    "Reach out for top-tier security services in Manchester & Cheshire – available 24/7!"
  ),
  phone: igniteString("0161 234 5678"),
  email: igniteString("info@setoriasecurity.com"),

  formFields: igniteArray([
    {
      inputType: igniteString("text"),
      fieldLabel: igniteString("Your Full Name"),
      fieldName: igniteString("name"),
    },
    {
      inputType: igniteString("email"),
      fieldLabel: igniteString("Your Email Address"),
      fieldName: igniteString("email"),
    },
    {
      inputType: igniteString("tel"),
      fieldLabel: igniteString("Your Phone Number"),
      fieldName: igniteString("phone"),
    },
    {
      inputType: igniteString("textarea"),
      fieldLabel: igniteString("How Can We Assist You?"),
      fieldName: igniteString("message"),
    },
  ]),

  buttonText: igniteString("Request a Free Consultation"),

  // Contact info labels
  phoneLabel: igniteString("Call Us Directly"),
  emailLabel: igniteString("Email Our Team"),

  // Messages
  successMessage: igniteString("Message sent successfully!"),
  errorMessage: igniteString("Failed to send message. Please try again."),
};

export default function ContactSection(props) {
  const mergedProps = { ...props };

  // State to track form inputs and submission status
  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle");

  // Handle input/textarea changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.text();
      setSubmitStatus("success");
      setFormData({}); // Reset form after submission
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    }
  };

  return (
    <section className="py-16" id={mergedProps.id.value}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="w-full flex items-center justify-center mb-2">
          <p className="mx-auto inline-block px-3 py-2 font-bold mb-4 text-xs tracking-wider uppercase rounded-full !text-black bg-[rgba(209,159,78,1)]">
            Contact Us
          </p>
        </div>

        <h2 className="text-center font-manrope text-4xl font-bold leading-10 mb-4">
          {mergedProps.title.value}
        </h2>

        <p className="text-center text-base font-normal leading-6 mb-14">
          {mergedProps.subtitle.value}
        </p>

        {/* Contact Grid */}
        <div className="grid lg:grid-cols-3 grid-cols-1 md:gap-8 gap-0">
          {/* Contact Information */}
          <div className="md:mb-0 mb-5 flex flex-col">
            {/* Phone Section */}
            <div className="bg-gray-100 rounded-2xl text-black p-6 mb-8">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  📞
                </div>
                <h4 className="text-base font-medium leading-6">
                  {mergedProps.phoneLabel.value}
                </h4>
              </div>
              <h3 className="font-manrope text-2xl font-bold leading-10 mb-6 overflow-clip">
                {mergedProps.phone.value}
              </h3>
            </div>

            {/* Email Section */}
            <div className="p-6 bg-gray-100 text-black rounded-2xl">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-4">
                  ✉️
                </div>
                <h4 className="text-base font-medium leading-6">
                  {mergedProps.emailLabel.value}
                </h4>
              </div>
              <h3 className="font-manrope text-2xl font-bold leading-10 mb-6 overflow-clip">
                {mergedProps.email.value}
              </h3>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-2 md:p-8 p-5 border border-gray-200 rounded-2xl">
            <form className="mb-0" onSubmit={handleSubmit}>
              {mergedProps.formFields.value.map((field, index) => (
                <div
                  key={index}
                  className={
                    field.inputType.value === "textarea"
                      ? "mb-6"
                      : "grid md:grid-cols-1 grid-cols-1 gap-6 mb-6"
                  }
                >
                  {field.inputType.value === "textarea" ? (
                    <textarea
                      name={field.fieldName.value}
                      value={formData[field.fieldName.value] || ""}
                      onChange={handleInputChange}
                      className="w-full h-40 border bg-slate-100 border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-[rgba(209,159,78,1)]"
                      placeholder={field.fieldLabel.value}
                    ></textarea>
                  ) : (
                    <input
                      type={field.inputType.value}
                      name={field.fieldName.value}
                      value={formData[field.fieldName.value] || ""}
                      onChange={handleInputChange}
                      className="w-full h-12 border bg-slate-100 border-gray-300 rounded-full pl-4 focus:outline-none focus:ring-2 focus:ring-[rgba(209,159,78,1)]"
                      placeholder={field.fieldLabel.value}
                    />
                  )}
                </div>
              ))}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="w-full h-12 mt-6 font-semibold !text-black bg-[rgba(209,159,78,1)] rounded-full shadow transition-all duration-200 hover:bg-[#b88f50] disabled:opacity-50"
              >
                {submitStatus === "loading"
                  ? "Sending..."
                  : mergedProps.buttonText.value}
              </button>

              {/* Success/Error Feedback */}
              {submitStatus === "success" && (
                <p className="text-green-600 text-center mt-4">
                  {mergedProps.successMessage.value}
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 text-center mt-4">
                  {mergedProps.errorMessage.value}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
