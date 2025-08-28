import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import supabase from "@/integrations/supabase";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function Fail() {
  const [language] = useLocalStorage("languagePreference", "he"); // Default to Hebrew
  const [appeal, setAppeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const fetchAppeal = useCallback(async () => {
    const lowProfileCode = searchParams.get("lowprofilecode");
    const { data, error } = await supabase
      .from("appeal_responses")
      .select("*")
      .eq("low_profile_id", lowProfileCode)
      .single();

    if (error || !data) {
      setLoading(false);
      console.error("Error fetching appeal:", error);
      setAppeal(null); 
      return;
    }
    setAppeal(data);
    setLoading(false);
  }, [searchParams, supabase]);

  useEffect(() => {
    fetchAppeal();
  }, [fetchAppeal]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-gray-500" />
            <p className="mt-4 text-gray-500">
              {language === "he"
                ? "ממתין לתשובה מהשרת..."
                : "Waiting for server response..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!appeal) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8 ${
          language === "he" ? "rtl" : "ltr"
        }`}
      >
        <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            {language === "en"
              ? "Payment Information Not Found"
              : "פרטי התשלום לא נמצאו"}
          </h2>
          <p className="text-gray-700 mb-6 text-sm leading-relaxed">
            {language === "en"
              ? "We could not retrieve your payment details. Please check the link or try again later."
              : "לא הצלחנו לאחזר את פרטי התשלום שלך. אנא בדוק את הקישור או נסה שוב מאוחר יותר."}
          </p>
          <div className="flex justify-center">
            <Link
              to="/"
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              {language === "en" ? "Back to Home" : "חזרה לדף הבית"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8 ${
        language === "he" ? "rtl" : "ltr"
      }`}
    >
      <div className="h-full container mx-auto max-w-5xl px-4">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              {language === "en" ? "Payment Unsuccessful" : "התשלום לא הצליח"}
            </h2>

            {/* Reason */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-5 text-sm text-red-700 text-left">
              <span className="font-semibold">
                {language === "en" ? "Reason: " : "סיבה: "}
              </span>
              <span className="break-words">
                {language === "en"
                  ? appeal.transaction_data.enDescription
                  : appeal.transaction_data.hbDescription}
              </span>
            </div>

            {/* Supportive message */}
            <p className="text-gray-700 mb-6 text-sm leading-relaxed">
              {language === "en"
                ? "We couldn’t complete your payment due to the issue above. Please review your details and try again. If the problem persists, contact your bank or our support team."
                : "לא ניתן היה להשלים את התשלום עקב הבעיה המוצגת לעיל. אנא בדוק את פרטיך ונסה שוב. אם הבעיה נמשכת, צור קשר עם הבנק שלך או עם צוות התמיכה שלנו."}
            </p>

            {/* Actions */}
            <div className="flex justify-center gap-3">
              <Link
                to="/"
                className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {language === "en" ? "Back to Home" : "חזרה לדף הבית"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
