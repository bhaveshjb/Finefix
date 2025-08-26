import { useEffect } from "react";
import privacyDataEn from "@/utils/privacy-policy.en";
import privacyDataHb from "@/utils/privacy-policy.he";
import { useLocalStorage } from "@uidotdev/usehooks";

const PrivacyPolicy = () => {
  const [language] = useLocalStorage("languagePreference", "he");
  const privacyData = language === "en" ? privacyDataEn : privacyDataHb;

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-10 text-start">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {privacyData.title}
        </h1>
        <p className="text-sm text-gray-500">
          Last updated:{" "}
          <span className="font-medium">{privacyData.lastUpdated}</span>
        </p>
      </header>

      {/* Content */}
      <div className="space-y-6 text-gray-700">
        {privacyData.sections.map((section) => (
          <div key={section.id}>
            {/* Section Title (aligned left) */}
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {section.title}
            </h2>

            {/* Description */}
            {section.description && (
              <p className="mb-4">{section.description}</p>
            )}

            {/* Lists */}
            {section.points && (
              <ul className="list-disc pl-8 space-y-1">
                {section.points.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
