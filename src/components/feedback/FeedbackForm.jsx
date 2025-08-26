import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocalStorage } from "@uidotdev/usehooks";

export default function FeedbackForm({ appealId, onSuccess, onCancel }) {
  const [language] = useLocalStorage("languagePreference", "he");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackData, setFeedbackData] = useState({
    appeal_id: appealId,
    rating: 0,
    satisfaction_level: "ניטרלי",
    service_quality: "טוב",
    appeal_result: "ממתין להחלטה",
    ease_of_use: "קל",
    feedback_text: "",
    improvement_suggestions: "",
    would_recommend: true,
    fine_amount: 0,
    amount_saved: 0,
    time_to_process: 0
  });
  const handleRatingClick = (value) => {
    setRating(value);
    setFeedbackData({ ...feedbackData, rating: value });
  };

  const handleSatisfactionChange = (value) => {
    setFeedbackData({ ...feedbackData, satisfaction_level: value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData({ ...feedbackData, [name]: value });
  };

  const handleCheckboxChange = (checked) => {
    setFeedbackData({ ...feedbackData, would_recommend: checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (feedbackData.rating === 0) {
        alert("אנא דרגו את השירות כדי להמשיך");
        setLoading(false);
        return;
      }
      
      // Calculate amount saved based on result
      if (feedbackData.appeal_result === "בוטל לחלוטין" && feedbackData.fine_amount) {
        setFeedbackData(prev => ({
          ...prev,
          amount_saved: prev.fine_amount - 20 // Subtract the service fee of 20 NIS
        }));
      } else if (feedbackData.appeal_result === "הופחת" && feedbackData.fine_amount) {
        // Assuming reduction of 50% on average
        setFeedbackData(prev => ({
          ...prev,
          amount_saved: (prev.fine_amount * 0.5) - 20
        }));
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("אירעה שגיאה בשליחת המשוב. אנא נסו שנית.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>{language === "en" ? "Your feedback on the service" : "המשוב שלך על השירות"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Rating Stars */}
              <div className="space-y-2">
                <Label>{language === "en" ? "How would you rate our service?" : "איך היית מדרג את השירות שלנו?"}</Label>
                <div className="flex items-center justify-center md:justify-start space-x-2 space-x-reverse">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="w-10 h-10 focus:outline-none"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          (hoverRating ? value <= hoverRating : value <= rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Satisfaction Level */}
              <div className="space-y-2">
                <Label>{language === "en" ? "What is your level of satisfaction with the service?" : "מה רמת שביעות הרצון שלך מהשירות?"}</Label>
                <RadioGroup
                  value={feedbackData.satisfaction_level}
                  onValueChange={handleSatisfactionChange}
                  className="grid grid-cols-2 sm:grid-cols-5 gap-2"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="מרוצה מאוד" id="satisfaction-5" />
                    <Label htmlFor="satisfaction-5">{language === "en" ?"Very satisfied" : "מרוצה מאוד"}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="מרוצה" id="satisfaction-4" />
                    <Label htmlFor="satisfaction-4">{language === "en" ?"satisfied" : "מרוצה"}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="ניטרלי" id="satisfaction-3" />
                    <Label htmlFor="satisfaction-3">{language === "en" ?"Neutral" : "ניטרלי"}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="לא מרוצה" id="satisfaction-2" />
                    <Label htmlFor="satisfaction-2">{language === "en" ?"Not satisfied" : "לא מרוצה"}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="לא מרוצה בכלל" id="satisfaction-1" />
                    <Label htmlFor="satisfaction-1">{language === "en" ?"Not satisfied at all" : "לא מרוצה בכלל"}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Appeal Result */}
              <div className="space-y-2">
                <Label>{language === "en" ? "What was the outcome of the appeal?" : "מה הייתה תוצאת הערעור?"}</Label>
                <RadioGroup
                  value={feedbackData.appeal_result}
                  onValueChange={(value) => setFeedbackData({ ...feedbackData, appeal_result: value })}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="בוטל לחלוטין" id="result-4" />
                    <Label htmlFor="result-4">{language === "en" ?"Completely canceled" : "בוטל לחלוטין"}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="הופחת" id="result-3" />
                    <Label htmlFor="result-3">{language === "en" ? "Reduced" : "הופחת"}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="נדחה" id="result-2" />
                    <Label htmlFor="result-2">{language === "en" ? "rejected" : "נדחה"}</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="ממתין להחלטה" id="result-1" />
                    <Label htmlFor="result-1">{language === "en" ? "Awaiting decision" : "ממתין להחלטה"}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Fine Amount */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="fine_amount">{language === "en" ? "Original fine amount (NIS)" : "סכום הקנס המקורי (₪)"}</Label>
                  <Input
                    id="fine_amount"
                    name="fine_amount"
                    type="number"
                    min="0"
                    value={feedbackData.fine_amount}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time_to_process">{language === "en" ? "Time of treatment in days" : "זמן הטיפול בימים"}</Label>
                  <Input
                    id="time_to_process"
                    name="time_to_process"
                    type="number"
                    min="0"
                    value={feedbackData.time_to_process}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ease_of_use">{language === "en" ? "Ease of use of the system" : "קלות השימוש במערכת"}</Label>
                  <select
                    id="ease_of_use"
                    name="ease_of_use"
                    value={feedbackData.ease_of_use}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="קל מאוד">{language === "en" ? "Very easy": "קל מאד"}</option>
                    <option value="קל">{language === "en" ? "easy" : "קל"}</option>
                    <option value="סביר">{language === "en" ? "reasonable" : "סביר"}</option>
                    <option value="מורכב">{language === "en" ? "complex" : "מורכב"}</option>
                    <option value="מורכב מאוד">{language === "en" ? "Very complex" : "מורכב מאוד"}</option>
                  </select>
                </div>
              </div>

              {/* Feedback Text */}
              <div className="space-y-2">
                <Label htmlFor="feedback_text">{language === "en" ?"Verbal feedback (optional)" : "משוב מילולי (אופציונלי)"}</Label>
                <Textarea
                  id="feedback_text"
                  name="feedback_text"
                  placeholder={language === "en" ? "Tell us about your experience with the service...": "ספרו לנו על החוויה שלכם עם השירות..."}
                  value={feedbackData.feedback_text}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              {/* Improvement Suggestions */}
              <div className="space-y-2">
                <Label htmlFor="improvement_suggestions">{language === "en" ?"Suggestions for improvement (optional)": "הצעות לשיפור (אופציונלי)"}</Label>
                <Textarea
                  id="improvement_suggestions"
                  name="improvement_suggestions"
                  placeholder={language === "en" ? "Do you have any ideas on how to improve our service?" : "יש לכם רעיונות כיצד לשפר את השירות שלנו?"}
                  value={feedbackData.improvement_suggestions}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              {/* Would Recommend */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="would_recommend"
                  checked={feedbackData.would_recommend}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="would_recommend">
                  {language === "en" ? "I recommend the service to friends and family" : "אני ממליץ על השירות לחברים ומשפחה"}
                </Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={onCancel}>
           {language === "en" ? "Cancel" : "ביטול"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full animate-spin mr-2"></div>
                {language === "en" ? "Sending feedback..." : "שולח משוב..."}
              </div>
            ) : (
              <>
                {language === "en" ? "Send Feedback" : "שלח משוב"}
                <Send className="mr-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}