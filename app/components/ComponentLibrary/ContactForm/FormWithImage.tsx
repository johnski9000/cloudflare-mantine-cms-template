"use client";
import React, { useState } from "react";
import {
  igniteString,
  igniteArray,
  igniteImage,
  igniteBoolean,
} from "defaultprops";

export const FormWithImageProps = {
  id: igniteString("orlando-tickets-contact-form"),
  title: igniteString("Get Your Orlando Vacation Quote"),
  subtitle: igniteString(
    "Contact our Orlando theme park specialists for personalized ticket recommendations and vacation packages. We'll provide the best deals on Disney World, Universal Studios, and Central Florida attractions within 24 hours."
  ),

  formFields: igniteArray([
    {
      inputType: igniteString("text"),
      fieldLabel: igniteString("First Name"),
      fieldName: igniteString("firstName"),
      required: igniteBoolean(true),
    },
    {
      inputType: igniteString("text"),
      fieldLabel: igniteString("Last Name"),
      fieldName: igniteString("lastName"),
      required: igniteBoolean(true),
    },
    {
      inputType: igniteString("email"),
      fieldLabel: igniteString("Email"),
      fieldName: igniteString("email"),
      required: igniteBoolean(true),
    },
    {
      inputType: igniteString("tel"),
      fieldLabel: igniteString("Phone Number"),
      fieldName: igniteString("phone"),
      required: igniteBoolean(true),
    },
    {
      inputType: igniteString("select"),
      fieldLabel: igniteString("Inquiry Type"),
      fieldName: igniteString("inquiryType"),
      required: igniteBoolean(true),
      options: igniteArray([
        igniteString("Please select inquiry type"),
        igniteString("New ticket quote"),
        igniteString("Existing order question"),
        igniteString("Vacation package planning"),
        igniteString("Group bookings"),
        igniteString("General information"),
      ]),
    },
    {
      inputType: igniteString("text"),
      fieldLabel: igniteString("Order Number (if asking about existing order)"),
      fieldName: igniteString("orderNumber"),
      required: igniteBoolean(false),
    },
    {
      inputType: igniteString("select"),
      fieldLabel: igniteString("Interested Theme Parks"),
      fieldName: igniteString("themeParks"),
      required: igniteBoolean(false),
      options: igniteArray([
        igniteString("Please select your interests"),
        igniteString("Disney World (4 Parks)"),
        igniteString("Universal Orlando (3 Parks)"),
        igniteString("Disney + Universal Combo"),
        igniteString("SeaWorld Orlando"),
        igniteString("LEGOLAND Florida"),
        igniteString("All Orlando Attractions"),
        igniteString("Not sure - need recommendations"),
      ]),
    },
    {
      inputType: igniteString("text"),
      fieldLabel: igniteString("Planned Visit Dates"),
      fieldName: igniteString("visitDates"),
      required: igniteBoolean(false),
    },
    {
      inputType: igniteString("textarea"),
      fieldLabel: igniteString(
        "Additional Details (Group size, special requests, etc.)"
      ),
      fieldName: igniteString("additionalDetails"),
      required: igniteBoolean(false),
    },
  ]),

  buttonText: igniteString("Get Best Ticket Prices"),
  image: igniteImage(
    "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=1000&q=80"
  ),
  imageAlt: igniteString("Orlando Theme Park Tickets and Family Vacation"),

  // Success/Error Messages
  successMessage: igniteString(
    "Quote request sent successfully! We'll respond with the best ticket deals within 24 hours."
  ),
  errorMessage: igniteString(
    "Failed to send request. Please try again or call our Orlando specialists directly."
  ),
};
export default function FormWithImage(props) {
  const mergedProps = { ...props };

  // State to track form inputs and submission status
  const [formData, setFormData] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");
    console.log("Submitting form with data:", formData);
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

  const renderField = (field, index) => {
    const commonProps = {
      name: field.fieldName.value,
      value: formData[field.fieldName.value] || "",
      onChange: handleInputChange,
      className:
        "w-full py-3 px-5 rounded-lg focus:outline-none border border-gray-200 shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] placeholder-gray-400 text-gray-900 text-lg font-normal",
      required: field.required.value,
    };

    if (field.inputType.value === "select") {
      return (
        <select
          {...commonProps}
          className={`${commonProps.className} bg-white`}
        >
          {field.options.value.map((option, optionIndex) => (
            <option
              key={optionIndex}
              value={optionIndex === 0 ? "" : option.value}
              disabled={optionIndex === 0}
            >
              {option.value}
            </option>
          ))}
        </select>
      );
    }

    if (field.inputType.value === "textarea") {
      return (
        <textarea
          {...commonProps}
          rows={4}
          placeholder={`Enter ${field.fieldLabel.value.toLowerCase()}...`}
        />
      );
    }

    return (
      <input
        {...commonProps}
        type={field.inputType.value}
        placeholder={field.fieldLabel.value}
      />
    );
  };

  return (
    <section className="py-24" id={mergedProps.id.value}>
      <div className="mx-auto max-w-[1330px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 grid-cols-1 lg:gap-8 gap-2 lg:items-stretch">
          <div className="p-8 rounded-r-3xl border border-gray-100 bg-white flex flex-col">
            <div className="pb-11 flex flex-col gap-5">
              <h2 className="text-gray-900 font-manrope text-4xl font-semibold leading-snug">
                {mergedProps.title.value}
              </h2>

              <p className="text-gray-600 text-lg font-normal">
                {mergedProps.subtitle.value}
              </p>
            </div>

            <form
              className="flex flex-col gap-10 mb-0 flex-1"
              onSubmit={handleSubmit}
            >
              {/* First and Last Name Row */}
              <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
                {mergedProps.formFields.value
                  .filter(
                    (field) =>
                      field.fieldName.value === "firstName" ||
                      field.fieldName.value === "lastName"
                  )
                  .map((field, index) => (
                    <div
                      key={index}
                      className="w-full justify-start items-start gap-1 flex"
                    >
                      <div className="w-full justify-start items-start gap-1.5 flex flex-col">
                        <div className="justify-start items-center gap-1 inline-flex">
                          <span className="text-gray-600 text-base font-medium leading-7">
                            {field.fieldLabel.value}
                          </span>
                          {field.required.value && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="7"
                              height="7"
                              viewBox="0 0 7 7"
                              fill="none"
                            >
                              <path
                                d="M2.55682 6.90909L2.66477 4.51136L0.642045 5.8125L0.0227273 4.73295L2.17045 3.63636L0.0227273 2.53977L0.642045 1.46023L2.66477 2.76136L2.55682 0.363636H3.78977L3.68182 2.76136L5.70455 1.46023L6.32386 2.53977L4.17614 3.63636L6.32386 4.73295L5.70455 5.8125L3.68182 4.51136L3.78977 6.90909H2.55682Z"
                                fill="#EF4444"
                              />
                            </svg>
                          )}
                        </div>
                        {renderField(field, index)}
                      </div>
                    </div>
                  ))}
              </div>

              {/* Other Fields */}
              {mergedProps.formFields.value
                .filter(
                  (field) =>
                    field.fieldName.value !== "firstName" &&
                    field.fieldName.value !== "lastName"
                )
                .map((field, index) => (
                  <div
                    key={index}
                    className="w-full justify-start items-start gap-1 flex"
                  >
                    <div className="w-full justify-start items-start gap-1.5 flex flex-col">
                      <div className="justify-start items-center gap-1 inline-flex">
                        <span className="text-gray-600 text-base font-medium leading-7">
                          {field.fieldLabel.value}
                        </span>
                        {field.required.value && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="7"
                            height="7"
                            viewBox="0 0 7 7"
                            fill="none"
                          >
                            <path
                              d="M2.55682 6.90909L2.66477 4.51136L0.642045 5.8125L0.0227273 4.73295L2.17045 3.63636L0.0227273 2.53977L0.642045 1.46023L2.66477 2.76136L2.55682 0.363636H3.78977L3.68182 2.76136L5.70455 1.46023L6.32386 2.53977L4.17614 3.63636L6.32386 4.73295L5.70455 5.8125L3.68182 4.51136L3.78977 6.90909H2.55682Z"
                              fill="#EF4444"
                            />
                          </svg>
                        )}
                      </div>
                      {renderField(field, index)}
                    </div>
                  </div>
                ))}

              <button
                type="submit"
                disabled={submitStatus === "loading"}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] disabled:opacity-50"
              >
                <span className="px-2 text-white text-base font-semibold leading-7">
                  {submitStatus === "loading"
                    ? "Submitting..."
                    : mergedProps.buttonText.value}
                </span>
              </button>

              {/* Success/Error Feedback */}
              {submitStatus === "success" && (
                <p className="text-green-600 text-center">
                  {mergedProps.successMessage.value}
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-red-600 text-center">
                  {mergedProps.errorMessage.value}
                </p>
              )}
            </form>
          </div>

          <div className="flex items-center justify-center lg:h-full">
            <img
              src={mergedProps.image.value}
              alt={mergedProps.imageAlt.value}
              className="w-full h-full object-cover rounded-l-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
