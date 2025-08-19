import { motion } from "framer-motion";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useSessionContext } from "@/hooks/useSessionContext";
import { Navigate } from "react-router-dom";
import supabase from "@/integrations/supabase";

const Login = () => {
  const { session, loading } = useSessionContext();

  if (!loading && session?.user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-32 pb-20 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold mb-2">התחברות</h1>
        </motion.div>
        <div className="max-w-4xl mx-auto" dir="rtl">
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            view="sign_in"
            showLinks={true}
            redirectTo="/"
            localization={{
              variables: {
                magic_link: {
                  button_label: "שליחת מייל עם קישור התחברות",
                  email_input_label: "אימייל",
                  email_input_placeholder: "אימייל",
                  loading_button_label: "טוען...",
                  link_text: "אין לך חשבון? הירשם",
                  confirmation_text: "שלחנו לך מייל עם קישור התחברות",
                  empty_email_address: "אנא הכנס אימייל",
                },
                sign_in: {
                  button_label: "התחבר עם גוגל",
                  email_label: "אימייל",
                  password_label: "סיסמא",
                  email_input_placeholder: "אימייל",
                  password_input_placeholder: "סיסמא",
                  link_text: "כבר יש לך חשבון? התחבר",
                  loading_button_label: "טוען...",
                  social_provider_text: "התחברות עם {{provider}}",
                },
                sign_up: {
                  button_label: "הרשמה",
                  email_input_label: "אימייל",
                  email_input_placeholder: "אימייל",
                  password_input_label: "סיסמא",
                  password_input_placeholder: "סיסמא",
                  loading_button_label: "טוען...",
                  link_text: "אין לך חשבון? הירשם",
                  confirmation_text:
                    "שלחנו לך מייל עם קישור לאישור ההרשמה. אנא בדוק את תיבת הדואר הנכנס שלך.",
                  email_label: "אימייל",
                  password_label: "סיסמא",
                  social_provider_text: "הרשמה עם {{provider}}",
                },
                forgotten_password: {
                  button_label: "שלח קישור לאיפוס סיסמא",
                  email_input_label: "אימייל",
                  email_input_placeholder: "אימייל",
                  loading_button_label: "טוען...",
                  link_text: "שכחת סיסמא?",
                  confirmation_text:
                    "שלחנו לך מייל עם קישור לאיפוס סיסמא. אנא בדוק את תיבת הדואר הנכנס שלך.",
                  email_label: "אימייל",
                  password_label: "סיסמא",
                },
                verify_otp: {
                  button_label: "שלח קוד",
                  email_input_label: "אימייל",
                  email_input_placeholder: "אימייל",
                  loading_button_label: "טוען...",
                  phone_input_label: "טלפון",
                  phone_input_placeholder: "טלפון",
                  token_input_label: "קוד",
                  token_input_placeholder: "קוד",
                },
              },
            }}
          />
        </div>
      </main>

      <footer className="border-t border-border py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-foreground/60">
          <p>© 2024 רישום לאירוע. כל הזכויות שמורות.</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
