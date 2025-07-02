import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { igniteString, igniteArray, igniteBoolean } from "defaultprops";

export const BenefitsListProps = {
  title: igniteString("Benefits of a Buy-to-Let Survey?"),
  bottomText: igniteString(
    "Professional Property Surveys for Better Investments"
  ),
  benefits: igniteArray([
    {
      icon: igniteString("FaCheckCircle"),
      title: igniteString("Legal Compliance & Responsibility"),
      description: igniteString(
        "Helping landlords and letting agents to mitigate their responsibility in ensuring properties within the PRS are fit for human habitation and provide decent homes for tenants"
      ),
      active: igniteBoolean(true),
    },
    {
      icon: igniteString("FaCheckCircle"),
      title: igniteString("Investment Protection"),
      description: igniteString(
        "It protects the landlord's investment by ensuring that the fabric of the building is maintained and defects identified"
      ),
      active: igniteBoolean(true),
    },
    {
      icon: igniteString("FaCheckCircle"),
      title: igniteString("Positive Landlord Image"),
      description: igniteString(
        "It demonstrates a 'caring landlord', sending positive messages to tenants and helping to reduce complaints"
      ),
      active: igniteBoolean(true),
    },
    {
      icon: igniteString("FaCheckCircle"),
      title: igniteString("Regular Property Reviews"),
      description: igniteString(
        "It necessitates a regular review of the property which can highlight emerging issues which can be dealt with at an early stage"
      ),
      active: igniteBoolean(true),
    },
    {
      icon: igniteString("FaCheckCircle"),
      title: igniteString("Tax Deductible Expense"),
      description: igniteString(
        "Landlords can off-set the cost as a business expense, significantly reducing the financial impact of the survey"
      ),
      active: igniteBoolean(true),
    },
    {
      icon: igniteString("FaCheckCircle"),
      title: igniteString("Lower Repair Costs"),
      description: igniteString(
        "The early identification of defects results in lower repair costs than experienced with untreated defects"
      ),
      active: igniteBoolean(true),
    },
  ]),
};

const iconMap = {
  FaCheckCircle: FaCheckCircle,
};

export default function BenefitsList(props) {
  const mergedProps = { ...props };

  const benefits = mergedProps.benefits.value || [];

  return (
    <div className="max-w-6xl mx-auto p-8 ">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-800 mb-4 leading-tight">
          {mergedProps.title.value}
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full mb-4"></div>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Discover why professional property surveys are essential for
          successful buy-to-let investments
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 ">
        {benefits.map((benefit, index) => {
          const IconComponent = iconMap[benefit.icon.value] || FaCheckCircle;
          if (!benefit.active.value) return null; // Skip inactive benefits
          return (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon */}
              <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <IconComponent className="w-8 h-8" />
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                  {benefit.title.value}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {benefit.description.value}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          );
        })}
      </div>

      {/* Bottom Accent */}
      <div className="mt-20 text-center">
        <div className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <FaCheckCircle className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold">
            {mergedProps.bottomText.value}
          </span>
        </div>
      </div>
    </div>
  );
}
