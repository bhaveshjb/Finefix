import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import supabase from "@/integrations/supabase";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Button } from "@/components/ui/button";

const AppealDetails = () => {
  const [language] = useLocalStorage("languagePreference", "he");
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appeal, setAppeal] = useState(null);

  useEffect(() => {
    fetchAppeal();
  }, [id]);

  const fetchAppeal = useCallback(async () => {
    const { data, error } = await supabase
      .from("appeals")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      setLoading(false);
      console.log("Error fetching appeal:", error);
      return;
    }
    setLoading(false);
    console.log("Appeal data:", data);
    setAppeal(data);
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-gray-500" />
            <p className="mt-4 text-gray-500">
              {language === "he"
                ? "אחזור פרטי הערעור..."
                : "Fetching Appeal details..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex justify-center bg-gray-50 p-4 md:p-8 ${
        language === "he" ? "rtl" : "ltr"
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        {/* Back Button*/}
        {appeal && (
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 mb-5"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">
              {language === "en" ? "Back" : "חזור"}
            </span>
          </Button>
        )}
        {!appeal ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-white shadow-md flex flex-col items-center rounded-xl p-6 max-w-md">
              <h2 className="text-xl font-semibold mb-2">
                {language === "en" ? "Appeal Data Not Found" : "הערעור לא נמצא"}
              </h2>
              <p className="text-gray-600 mb-4">
                {language === "en"
                  ? "We couldn’t find any appeal data. Please check again later or return."
                  : "לא מצאנו נתוני ערעור. אנא בדוק שוב מאוחר יותר או חזור."}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mx-4"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">
                  {language === "en" ? "Back" : "חזור"}
                </span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="container mx-auto max-w-5xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex justify-center w-full text-center">
                <h1 className="text-3xl text-center font-bold">
                  {language === "en" ? "Appeal Details" : "פרטי הערעור"}
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
};

export default AppealDetails;
