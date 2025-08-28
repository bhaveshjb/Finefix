import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import {
  CarFront,
  FileText,
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  PlusCircle,
  Star,
  MessageSquare,
  BarChart,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import FeedbackDisplay from "../components/feedback/FeedbackDisplay";
import supabase from "@/integrations/supabase";
import { useLocalStorage } from "@uidotdev/usehooks";
import { SessionContext } from "@/context/SessionContext";

const violationTypes_en = {
  red_white: "Parking in a red-white zone",
  handicapped: "Parking in a disabled spot",
  unmarked: "Parking in an unmarked area",
  bus_lane: "Parking in a bus lane",
  crosswalk: "Parking on a crosswalk",
  hydrant: "Parking by a fire hydrant",
  sidewalk: "Parking on a sidewalk",
  double_parking: "Double parking",
  expired_meter: "Expired meter",
  loading_zone: "Parking in a loading zone",
  other: "Other violation",
};

const violationTypes_he = {
  red_white: "חניה באדום-לבן",
  handicapped: "חניה בחניית נכים",
  unmarked: "חניה באזור לא מסומן",
  bus_lane: "חניה בנתיב אוטובוס",
  crosswalk: "חניה על מעבר חציה",
  hydrant: "חניה ליד ברז כיבוי אש",
  sidewalk: "חניה על מדרכה",
  double_parking: "חניה כפולה",
  expired_meter: "מדחן שפג תוקפו",
  loading_zone: "חניה באזור פריקה וטעינה",
  other: "עבירה אחרת",
};

export default function UserDashboard() {
  const { session } = useContext(SessionContext);
  const [user, setUser] = useState(null);
  const [appeals, setAppeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("appeals");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language] = useLocalStorage("languagePreference", "he");
  const navigate = useNavigate();
  const violationTypes =
    language === "he" ? violationTypes_he : violationTypes_en;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = null;
        setUser(userData);

        const { data: userAppeals = [] } = await supabase
          .from("appeals")
          .select("*");
        setAppeals(
          userAppeals.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )
        );
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const handleNewAppeal = () => {
    navigate(createPageUrl("Appeal"));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>{language === "en" ? "draft" : "טיוטה"}</span>
          </Badge>
        );
      case "submitted":
        return (
          <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{language === "en" ? "Submitted" : "בטיפול"}</span>
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>{language === "en" ? "Approved" : "אושר"}</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <X className="h-3 w-3" />
            <span>{language === "en" ? "Rejected" : "נדחה"}</span>
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-opacity-10 border-t-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-[240px_1fr] gap-8">
        <div className="hidden md:block">
          <Card className="sticky top-20">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 mx-auto flex items-center justify-center text-blue-600 text-2xl font-bold mb-2">
                {user?.full_name ? user.full_name.charAt(0) : "U"}
              </div>
              <CardTitle className="text-center">
                {user?.full_name || language === "en" ? "User" : "משתמש"}
              </CardTitle>
              <CardDescription className="text-center truncate max-w-[180px] mx-auto">
                {user?.email}
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("appeals")}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                    activeTab === "appeals"
                      ? "bg-blue-100 text-blue-900 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <FileText className="me-2 h-5 w-5" />
                  {language === "en" ? "My Appeals" : "הערעורים שלי"}
                </button>
                <button
                  onClick={() => setActiveTab("feedback")}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                    activeTab === "feedback"
                      ? "bg-blue-100 text-blue-900 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <MessageSquare className="me-2 h-5 w-5" />
                  {language === "en" ? "Feedback" : "משובים"}
                </button>
                <button
                  onClick={() => setActiveTab("stats")}
                  className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                    activeTab === "stats"
                      ? "bg-blue-100 text-blue-900 font-medium"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  <BarChart className="me-2 h-5 w-5" />
                  {language === "en" ? "Statistics" : "סטטיסטיקות"}
                </button>
              </nav>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleNewAppeal}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <PlusCircle className="me-2 h-5 w-5" />
                {language === "en" ? "New Appeal" : "ערעור חדש"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            {language === "en" ? "The Personal Center" : "המרכז האישי"}
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mb-4"
          >
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                    {user?.full_name ? user.full_name.charAt(0) : "U"}
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      {user?.full_name || language === "en" ? "user" : "משתמש"}
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {user?.email}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-2 pb-2">
                <nav className="space-y-1">
                  <button
                    onClick={() => {
                      setActiveTab("appeals");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                      activeTab === "appeals"
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <FileText className="me-2 h-5 w-5" />
                    {language === "en" ? "My Appeals" : "הערעורים שלי"}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("feedback");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                      activeTab === "feedback"
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <MessageSquare className="me-2 h-5 w-5" />
                    {language === "en" ? "Feedback" : "משובים"}
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("stats");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 text-sm rounded-lg ${
                      activeTab === "stats"
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <BarChart className="me-2 h-5 w-5" />
                    {language === "en" ? "Statistics" : "סטטיסטיקות"}
                  </button>
                </nav>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={handleNewAppeal}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <PlusCircle className="me-2 h-5 w-5" />
                  {language === "en" ? "New Appeal" : "ערעור חדש"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        <div>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="md:hidden mb-4">
              <TabsTrigger value="appeals">
                {language === "en" ? "My appeals" : "הערעורים שלי"}
              </TabsTrigger>
              <TabsTrigger value="feedback">
                {language === "en" ? "Feedback" : "מָשׁוֹב"}
              </TabsTrigger>
              <TabsTrigger value="stats">
                {language === "en" ? "Statistics" : "סטָטִיסטִיקָה"}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appeals" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {language === "en" ? "My appeals" : "הערעורים שלי"}
                </h2>
                <Button
                  onClick={handleNewAppeal}
                  className="bg-blue-600 hover:bg-blue-700 md:hidden"
                >
                  <PlusCircle className="me-2 h-5 w-5" />
                  {language === "en" ? "New appeal" : " ערעור חדש"}
                </Button>
              </div>

              {appeals.length === 0 ? (
                <Card className="text-center p-8">
                  <CardContent>
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      {language === "en"
                        ? "You have no active appeals."
                        : "אין לך ערעורים פעילים"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {language === "en"
                        ? "You haven't filed parking ticket appeals yet. Start now to save time and money!"
                        : "יין לא הגשת ערעורים על דוחות חניה. התחל עכשיו כדי לחסוךזמן וכסף!"}
                    </p>
                    <Button
                      onClick={handleNewAppeal}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <PlusCircle className="me-2 h-5 w-5" />
                      {language === "en"
                        ? "Submit a new appeal"
                        : "הגש ערעור חדש"}
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4" dir="rtl">
                  {appeals.map((appeal, index) => (
                    <motion.div
                      key={appeal.id}
                      className="hover:border-blue-300 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeOut",
                        delay: index * 0.05,
                      }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Card
                        key={appeal.id}
                        dir={language === "he" ? "rtl" : "ltr"}
                        className="hover:border-blue-300 transition-colors"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <div className="bg-blue-100 p-2 rounded-lg">
                                <CarFront className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-semibold">
                                  {language === "en" ? "Report" : "דוח"}{" "}
                                  {violationTypes[
                                    appeal.form_data.violationType
                                  ] || "חניה"}
                                </CardTitle>
                                <CardDescription className="text-start">
                                  {language === "en" ? "Vehicle No" : "רכב מס׳"}{" "}
                                  {appeal.form_data.carNumber || "-"},{" "}
                                  {language === "en" ? "Report No." : "דוח מס׳"}{" "}
                                  {appeal.form_data.ticketNumber || "-"}
                                </CardDescription>
                              </div>
                            </div>

                            {getStatusBadge(appeal.form_data.appeal_status)}
                          </div>
                        </CardHeader>

                        <CardContent className="pb-2">
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                              <span>
                                {language === "en" ? "Submitted:" : "הוגש:"}{" "}
                                {new Date(
                                  appeal.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            {appeal.ticket_amount && (
                              <div className="flex items-center">
                                <span>
                                  {language === "en" ? "Amount:" : "סכום: ₪"}
                                  {appeal.ticket_amount}
                                </span>
                              </div>
                            )}
                          </div>
                        </CardContent>

                        <CardFooter className="pt-2">
                          <div className="flex justify-between w-full">
                            <Link
                              to={`${createPageUrl("Appeal")}?id=${appeal.id}`}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                            >
                              {language === "en"
                                ? "View details"
                                : "צפייה בפרטים"}
                            </Link>

                            {(appeal.appeal_status === "approved" ||
                              appeal.appeal_status === "rejected") && (
                              <Link
                                to={`${createPageUrl("AppealFeedback")}?id=${
                                  appeal.id
                                }`}
                                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                              >
                                <Star className="h-4 w-4 mr-1" />
                                {language === "en"
                                  ? "Rate the experience"
                                  : "דרג את החוויה"}
                              </Link>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="feedback" className="mt-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  {language === "en"
                    ? "Feedback and Ratings"
                    : "משובים ודירוגים"}
                </h2>
                <p className="text-gray-600">
                  {language === "en"
                    ? "View other users' feedback and ratings about our service"
                    : "צפה במשובים ודירוגים של משתמשים אחרים לגבי השירות שלנו"}
                </p>
              </div>

              <FeedbackDisplay />
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">
                  {language === "en" ? "Statistics" : "סטטיסטיקות"}
                </h2>
                <p className="text-gray-600">
                  {language === "en"
                    ? "Statistical data on success rates, amounts saved and treatment times"
                    : "נתונים סטטיסטיים על אחוזי הצלחה, סכומים שנחסכו וזמני טיפול"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {language === "en"
                          ? "Success percentage"
                          : "אחוזי הצלחה"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-blue-600">
                        92%
                      </div>
                      <p className="text-gray-500">
                        {language === "en"
                          ? "Some of our appeals lead to full or partial cancellation"
                          : "מהערעורים שלנו מובילים לביטול מלא או חלקי"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {language === "en"
                          ? "Average treatment time"
                          : "זמן טיפול ממוצע"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-blue-600">14</div>
                      <p className="text-gray-500">
                        {language === "en"
                          ? "Days to receive a response to an appeal"
                          : "ימים לקבלת תשובה על ערעור"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                <motion.div
                  className="h-full"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <Card className="h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        {language === "en"
                          ? "Successful appeals today"
                          : "ערעורים מוצלחים היום"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-blue-600">
                        127
                      </div>
                      <p className="text-gray-500">
                        {language === "en"
                          ? "Appeals received today only"
                          : "ערעורים שהתקבלו היום בלבד"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
