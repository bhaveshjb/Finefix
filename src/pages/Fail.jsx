import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
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
      .from("appeal_view")
      .select("*")
      .eq("low_profile_id", lowProfileCode)
      .single();

    if (error) {
      setLoading(false);
      console.error("Error fetching appeal:", error);
      return;
    }
    setLoading(false);
    console.log("Appeal data:", data);
    setAppeal(data);
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

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 p-4 md:p-8 ${
        language === "he" ? "rtl" : "ltr"
      }`}
    >
      <div className="h-full container mx-auto max-w-5xl">
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="bg-white shadow-md rounded-xl p-6 max-w-md">
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              {language === "en" ? "Payment Failed" : "התשלום נכשל"}
            </h2>
            <p className="text-gray-600 mb-4">
              {language === "en"
                ? "Your payment could not be processed. Please try again later."
                : "לא ניתן היה לעבד את התשלום שלך. אנא נסה שוב מאוחר יותר."}
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
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
