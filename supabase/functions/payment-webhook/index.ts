// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { getTranslations } from "./translations.ts";

export interface TransactionResponse {
  ResponseCode: number;
  Description: string;
  TerminalNumber: number;
  LowProfileId: string;
  TranzactionId: number;
  ReturnValue: string;
  Operation: string;
  UIValues: {
    CardOwnerEmail: string;
    CardOwnerName: string;
    CardOwnerPhone: string;
    CardOwnerIdentityNumber: string;
    NumOfPayments: number;
    CardYear: number;
    CardMonth: number;
    CustomFields: unknown[];
    IsAbroadCard: boolean;
  };
  DocumentInfo: unknown | null;
  TokenInfo: unknown | null;
  SuspendedInfo: unknown | null;
  TranzactionInfo: {
    ResponseCode: number;
    Description: string;
    TranzactionId: number;
    TerminalNumber: number;
    Amount: number;
    CoinId: number;
    CouponNumber: string;
    CreateDate: string; // ISO date string
    Last4CardDigits: number;
    Last4CardDigitsString: string;
    FirstCardDigits: number;
    JParameter: string;
    CardMonth: number;
    CardYear: number;
    ApprovalNumber: string;
    FirstPaymentAmount: number;
    ConstPaymentAmount: number;
    NumberOfPayments: number;
    CardInfo: string;
    CardOwnerName: string;
    CardOwnerPhone: string;
    CardOwnerEmail: string;
    CardOwnerIdentityNumber: string;
    Token: string;
    CardName: string;
    SapakMutav: string;
    Uid: string;
    ConcentrationNumber: string | null;
    DocumentNumber: string | null;
    DocumentType: string | null;
    Rrn: string;
    Brand: string;
    Acquire: string;
    Issuer: string;
    PaymentType: string;
    CardNumberEntryMode: string;
    DealType: string;
    IsRefund: boolean;
    DocumentUrl: string | null;
    CustomFields: unknown[];
    IsAbroadCard: boolean;
    IssuerAuthCodeDescription: string;
  };
  ExternalPaymentVector: string;
  Country: string;
  UTM: unknown | null;
  IssuerAuthCodeDescription: string;
}

interface FormData {
  carNumber: string;
  ticketNumber: string;
  violationType: string;
  violationDate: string;      // e.g., "2025-05-08"
  violationTime: string;      // e.g., "02:50"
  violationLocation: string;
  ticketAmount: string;
  wasDriver: "yes" | "no";
  appealReason: string;
  correctParking: "yes" | "no";
  visibleSignage: "yes" | "no";
}

console.log("Starting payment webhook function...")

// supabase secrets set SB_URL=<project_URL>
// supabase secrets set SB_SERVICE_ROLE_KEY=<service_role_key>
// supabase secrets set CARDCOM_TERMINAL_NUMBER=<value>
// supabase secrets set CARDCOM_API_NAME=<api_name>

const supabaseUrl = Deno.env.get('SB_URL');
const supabaseServiceRoleKey = Deno.env.get('SB_SERVICE_ROLE_KEY');
const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
);

Deno.serve(async (req: Request) => {
  const { LowProfileId } = await req.json() as TransactionResponse;
  const cardcomTerminamlNumber = Deno.env.get('CARDCOM_TERMINAL_NUMBER');
  const cardcomApiName = Deno.env.get('CARDCOM_API_NAME');

  const response = await fetch(
    'https://secure.cardcom.solutions/api/v11/LowProfile/GetLpResult',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "TerminalNumber": Number(cardcomTerminamlNumber),
        "ApiName": cardcomApiName,
        "LowProfileId": LowProfileId,
      }),
    });
  const { ReturnValue, ...lowProfileResult } = await response.json();

  // Check if the webhook is valid in accordance with Cardcom service
  if (lowProfileResult.ResponseCode !== 0) {
    console.error("Error fetching low profile result:", lowProfileResult);
    return new Response(
      JSON.stringify({ error: "Failed to fetch low profile result" }),
      { status: 500 },
    );
  }

  const { searchParams } = new URL(req.url);
  const formData = JSON.parse(atob(ReturnValue)) as FormData;
  const language = searchParams.get("language") || "en";
  const t = await getTranslations(language);

  // Get appeal reason text
  const appealReasonText =
    formData.appealReason === "other"
      ? formData.otherReason
      : t.appealReasons.find((r) => r.value === formData.appealReason)
        ?.label || formData.appealReason;

  // Get violation type text
  const violationTypeText =
    t.violationTypes.find((v) => v.value === formData.violationType)
      ?.label || formData.violationType;

  // Create prompt for the AI
  const prompt =
    language === "en"
      ? `Generate a professional appeal letter for a parking ticket with the following details:
  - Vehicle license plate: ${formData.carNumber}
  - Ticket number: ${formData.ticketNumber}
  - Type of violation: ${violationTypeText}
  - Date and time of the violation: ${formData.violationDate} ${formData.violationTime || ""
      }
  - Location: ${formData.violationLocation}
  - The appellant was${formData.wasDriver === "yes" ? "" : " not"
      } the driver at the time.
  - The car was${formData.correctParking === "yes"
        ? ""
        : formData.correctParking === "partial"
          ? " partially"
          : " not"
      } parked correctly.
  - The signage was${formData.visibleSignage === "yes"
        ? ""
        : formData.visibleSignage === "partial"
          ? " partially"
          : " not"
      } clearly visible.
  - Main appeal reason: ${appealReasonText}

  ${formData.otherReason
        ? `- Additional details: ${formData.otherReason}`
        : ""
      }

  The letter should be formal, polite, and persuasive. It should include the ticket details, explain why the ticket should be dismissed based on the reason provided, and request that the fine be cancelled. Format it as a proper appeal letter with appropriate sections and a signature block.`
      : `צור מכתב ערעור מקצועי לדוח חניה עם הפרטים הבאים:
  - מספר רישוי: ${formData.carNumber}
  - מספר דוח: ${formData.ticketNumber}
  - סוג העבירה: ${violationTypeText}
  - תאריך ושעת העבירה: ${formData.violationDate} ${formData.violationTime || ""
      }
  - מיקום: ${formData.violationLocation}
  - המערער ${formData.wasDriver === "yes" ? "היה" : "לא היה"
      } הנהג בזמן העבירה.
  - הרכב חנה ${formData.correctParking === "yes"
        ? "כראוי"
        : formData.correctParking === "partial"
          ? "באופן חלקי כראוי"
          : "לא כראוי"
      }.
  - השילוט היה ${formData.visibleSignage === "yes"
        ? "ברור ונראה"
        : formData.visibleSignage === "partial"
          ? "נראה באופן חלקי"
          : "לא נראה בבירור"
      }.
  - סיבת הערעור העיקרית: ${appealReasonText}

  ${formData.otherReason ? `- פרטים נוספים: ${formData.otherReason}` : ""}

  המכתב צריך להיות רשמי, מנומס ומשכנע. הוא צריך לכלול את פרטי הדוח, להסביר מדוע יש לבטל את הדוח בהתבסס על הסיבה שניתנה, ולבקש שהקנס יבוטל. פרמט אותו כמכתב ערעור נאות עם חלקים מתאימים וחתימה.`;

  const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
  const appealResponse = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        "model": "gpt-4.1",
        "messages": [
          {
            "role": "assistant",
            "content": language === "en" ?
              "I am an AI assistant specialized in generating professional, persuasive appeal letters for parking violations. I analyze ticket details, violation types, legal precedents, and user-provided context to construct a formal and convincing appeal."
              : `אני עוזר בינה מלאכותית המתמחה ביצירת מכתבי ערעור מקצועיים ומשכנעים על דו"חות חניה. אני מנתח את פרטי הדו"ח, סוג העבירה, תקנות רלוונטיות והקשר שהמשתמש מוסר — ומנסח מכתב ערעור רשמי בהתאם.`
          },
          {
            "role": "user",
            "content": prompt,
          }
        ]
      }),
    }
  );

  const appealResult = await appealResponse.json();
  const appealText = appealResult.choices[0].message.content;

  const { data, error } = await supabase.from('appeals').insert({
    user_email: lowProfileResult.TranzactionInfo.CardOwnerEmail,
    text: appealText,
    form_data: formData,
    transaction_data: lowProfileResult,
  });

  if (error) {
    console.error("Error inserting data into Supabase:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to insert data into Supabase",
        data,
        user_email: lowProfileResult.TranzactionInfo?.CardOwnerEmail || null,
        text: appealText,
        form_data: formData,
        transaction_data: lowProfileResult,
      }),
      { status: 500 },
    );
  }

  console.log("Successfully inserted appeal data into Supabase:", data);
  return new Response(
    JSON.stringify({ ok: true }),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/payment-webhook' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
