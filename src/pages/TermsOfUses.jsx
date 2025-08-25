import React, { useEffect } from "react";
import termsDataEn from "../utils/terms-of-use.en";
import termsDataHb from "@/utils/terms-of-use.he";
import { useLocalStorage } from "@uidotdev/usehooks";

const TermsOfUse = () => {
  const [language] = useLocalStorage("languagePreference", "he");
  const termsData = language === "en" ? termsDataEn : termsDataHb;

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {termsData.title}
      </h1>

      {/* Last Updated */}
      <p className="text-sm text-gray-500 mb-6">
        Last updated:{" "}
        <span className="font-medium">{termsData.lastUpdated}</span>
      </p>

      {/* Introduction */}
      <p className="text-lg text-gray-600 mb-6 leading-relaxed">
        {termsData.introduction}
      </p>

      {/* Sections */}
      {termsData.sections.map((section) => (
        <div key={section.id} className="mb-3 p-6 bg-white shadow-sm">
          {/* Section Title */}
          <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-4">
            {section.icon && (
              <span className="mr-2 text-blue-500">{section.icon}</span>
            )}
            {section.title}
          </h2>

          {/* Description */}
          {section.description && (
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {section.description}
            </p>
          )}

          {/* Points */}
          {section.points && (
            <ul className="list-disc list-inside space-y-2 text-gray-700 pl-2">
              {section.points.map((point, index) => (
                <li key={index} className="leading-relaxed">
                  {typeof point === "string" ? (
                    point
                  ) : (
                    <>
                      <span className="font-medium text-gray-800">
                        {point.title}:
                      </span>{" "}
                      {point.description}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default TermsOfUse;
