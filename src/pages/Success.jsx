import React, { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import supabase from "@/integrations/supabase";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function Success() {
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
      <div className="container mx-auto max-w-5xl">
        {!appeal ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white shadow-md rounded-xl p-6 max-w-md">
              <h2 className="text-xl font-semibold mb-2">
                {language === "en" ? "Appeal Data Not Found" : "הערעור לא נמצא"}
              </h2>
              <p className="text-gray-600 mb-4">
                {language === "en"
                  ? "We couldn’t find any appeal data. Please check again later or return to the home page."
                  : "לא נמצאו נתוני ערעור. אנא נסה שוב מאוחר יותר או חזור לדף הבית."}
              </p>
            </div>
          </div>
        ) : (
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold">
                  {language === "en" ? "Appeal Response" : "תשובת ערעור"}
                </h1>
              </div>
            </div>
            <div className="mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <>
                  {appeal.text.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
