import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import AppealForm from "../components/appeal/AppealForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function AppealPage() {
  const [language] = useLocalStorage("languagePreference", "he"); // Default to Hebrew
  const navigate = useNavigate();

  const handleFormSubmit = async (formData) => {
    const formDataStr = JSON.stringify(formData);
    const bytes = new TextEncoder().encode(formDataStr);
    const binString = String.fromCharCode(...bytes);
    const base64FormData = btoa(binString);
    const cardcomTerminalNumber = Number(
      import.meta.env.VITE_CARDCOM_TERMINAL_NUMBER
    );
    const cardcomApiName = import.meta.env.VITE_CARDCOM_API_NAME;
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const productDescription =
      language === "he" ? "ערעור על דוח חניה" : "Parking Ticket Appeal";

    //TODO : For testing & undestanding not using ENV values, after completing changes replace with ENV valiables  

    const url = "https://secure.cardcom.solutions/api/v11/LowProfile/Create";
    console.log("Submitting appeal with data:", {
      formData,
      webhookUrl: `https://kyxflawpfapoqdqdbwha.supabase.co/functions/v1/payment-webhook?language=${language}`,
    });
    const options = {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        TerminalNumber: "1000",
        ApiName: "kzFKfohEvL6AOF8aMEJz",
        ApiPassword: "FIDHIh4pAadw3Slbdsjg",
        Amount: 20,
        WebHookUrl: `https://kyxflawpfapoqdqdbwha.supabase.co/functions/v1/payment-webhook?language=${language}`,
        SuccessRedirectUrl: `${window.location.href}/success`,
        FailedRedirectUrl: `${window.location.href}/failed`,
        ReturnValue: base64FormData,
        UIDefinition: {
          IsHideCardOwnerEmail: false,
          IsHideCardOwnerPhone: true,
        },
        Document: {
          Products: [{ Description: productDescription, UnitCost: 20 }],
        },
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.ResponseCode !== 0) {
        console.error("Error from Cardcom:", data);
        throw new Error(`Cardcom error: ${data.ResponseMessage}`);
      }

      window.location.href = data.Url;
    } catch (error) {
      console.error(error);
      toast.error(
        language === "en"
          ? "Error submitting appeal, contact support."
          : "שגיאה בהגשת הערעור, פנה לתמיכה."
      );
    }
  };

  const handleBackToHome = () => {
    navigate(createPageUrl("Landing"));
  };

  const getTranslations = () => {
    if (language === "en") {
      return {
        pageTitle: "Submit Appeal",
        tabs: {
          form: "Appeal Form",
          payment: "Payment",
        },
        backToHome: "Back to Home",
        chatbot: {
          title: "Support Chat",
        },
      };
    } else {
      return {
        pageTitle: "הגשת ערעור",
        tabs: {
          form: "טופס ערעור",
          payment: "תשלום",
        },
        backToHome: "חזרה לדף הבית",
        chatbot: {
          title: "צ'אט תמיכה",
        },
      };
    }
  };

  const t = getTranslations();

  return (
    <div
      className={`min-h-screen bg-gray-50 p-4 md:p-8 ${
        language === "he" ? "rtl" : "ltr"
      }`}
    >
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t.pageTitle}</h1>
          </div>
          <Button variant="outline" onClick={handleBackToHome}>
            {language === "he" ? (
              <>
                {t.backToHome}
                <ArrowLeft className="mr-2 h-4 w-4" />
              </>
            ) : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t.backToHome}
              </>
            )}
          </Button>
        </div>

        <div className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AppealForm onSubmit={handleFormSubmit} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
