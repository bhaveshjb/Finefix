import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Search,
  Calendar,
  Clock,
  User,
  ChevronLeft,
  Filter,
  ArrowLeft,
  Tag,
  Share2,
  AlertCircle,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocalStorage } from "@uidotdev/usehooks";
import blogsDataEn from "../utils/blogsEn";
import blogsDataHb from "../utils/blojsHb";

export default function Blog() {
  const [language] = useLocalStorage("languagePreference", "he");

  const [featuredPost] = useState(
    language === "en"
      ? {
          id: 1,
          title: "How to Handle an Unjust Parking Ticket – The Complete Guide",
          summary:
            "A parking ticket can sometimes be justified, but in many cases authorities make mistakes. This article provides a detailed guide on how to deal with unjust parking tickets and how to file an effective appeal.",
          category: "Guides",
          publishDate: "11/10/2023",
          readTime: "6 minutes",
          author: "Attorney Ronit Levi",
          authorImage:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=50",
          image:
            "https://images.unsplash.com/photo-1588421357574-87938a86fa28?auto=format&fit=crop&q=80&w=600",
        }
      : {
          id: 1,
          title: "איך להתמודד עם דוח חניה לא מוצדק - המדריך המלא",
          summary:
            "דוח חניה יכול להיות מוצדק, אך במקרים רבים הרשויות טועות. במאמר זה נספק מדריך מפורט כיצד להתמודד עם דוחות חניה בלתי מוצדקים וכיצד להגיש ערעור אפקטיבי.",
          category: "מדריכים",
          publishDate: "10.11.2023",
          readTime: "6 דקות",
          author: "עו״ד רונית לוי",
          authorImage:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=50",
          image:
            "https://images.unsplash.com/photo-1588421357574-87938a86fa28?auto=format&fit=crop&q=80&w=600",
        }
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();

  const categories = [
    { id: "all", en: "Everything", he: "הכל" },
    { id: "tips", en: "Tips", he: "טיפים" },
    { id: "guides", en: "Guides", he: "מדריכים" },
    { id: "legal", en: "Legal", he: "משפטי" },
    { id: "tech", en: "Technology", he: "טכנולוגיה" },
    { id: "case-studies", en: "Case Studies", he: "מקרי בוחן" },
    { id: "statistics", en: "Statistics", he: "סטטיסטיקה" },
    { id: "business", en: "Business", he: "עֵסֶק" },
  ];

  const blogs = language === "en" ? blogsDataEn : blogsDataHb;

  const filteredPosts = blogs.filter((post) => {
    // Filter by category
    if (activeCategory !== "all") {
      const selectedCategory = categories.find(
        (cat) => cat.id === activeCategory
      );

      if (!selectedCategory) return false;

      if (
        post.category !== selectedCategory.en &&
        post.category !== selectedCategory.he
      ) {
        return false;
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        (post.title || "").toLowerCase().includes(query) ||
        (post.summary || "").toLowerCase().includes(query) ||
        (post.author || "").toLowerCase().includes(query) ||
        (post.category || "").toLowerCase().includes(query) ||
        post.tags?.some((tag) => (tag || "").toLowerCase().includes(query))
      );
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with featured post */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-3">
            <h1 className="text-4xl font-bold mb-4">
              {language === "en" ? "Our Blog" : "הבלוג שלנו"}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === "en"
                ? "Tips, guides and useful information about parking ticket appeals and the legal system in Israel"
                : "טיפים, מדריכים ומידע שימושי על ערעורי דוחות חניה והמערכת המשפטית בישראל"}
            </p>
          </div>
        </div>
      </section>

      {/* Blog listing section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="w-full bg-white md:w-auto mb-4 md:mb-0">
              <Tabs
                defaultValue={activeCategory}
                onValueChange={setActiveCategory}
              >
                <TabsList className="bg-white flex flex-wrap gap-2 w-full justify-center md:justify-start">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {language === "en" ? category.en : category.he}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="w-full md:w-64 mt-16 md:mt-0">
              <div className="relative">
                <Search className="absolute right-3 top-3/4 md:top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder={
                    language === "en" ? "Search articles..." : "חיפוש מאמרים..."
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => {
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="relative h-48 w-full overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                        <Badge className="absolute top-3 right-3 bg-blue-600">
                          {post.category}
                        </Badge>
                      </div>

                      <CardContent className="py-5 flex-grow">
                        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-2 space-x-reverse rtl:space-x-reverse">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 ml-1" />
                            <span>{post.publishDate}</span>
                          </div>
                          <div className="mx-2">•</div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 ml-1" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>

                        <h3 className="font-bold text-xl mb-2 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                          {post.description}
                        </p>

                        <div className="flex items-center mt-4">
                          <img
                            src={post.authorImg}
                            alt={post.author}
                            className="h-8 w-8 rounded-full object-cover ml-2"
                          />
                          <span className="text-sm font-medium ml-2">
                            {post.author}
                          </span>
                        </div>

                        <Link to={`/Blog/${post.slug}`}>
                          <Button
                            variant="ghost"
                            className="text-blue-600 p-0 h-auto font-medium hover:bg-transparent hover:text-blue-800 mt-4 flex items-center"
                          >
                            {language === "en"
                              ? "Continue Reading"
                              : "המשך קריאה"}
                            {language === "en" ? (
                              <ChevronRight className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronLeft className="h-4 w-4 mr-1" />
                            )}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-medium mb-2">
                {language === "en" ? "No results found" : "לא נמצאו תוצאות"}
              </h3>
              <p className="text-gray-600 mb-4">
                {language === "en"
                  ? "Try searching for other terms or choosing a different category."
                  : "נסו לחפש מונחים אחרים או לבחור קטגוריה אחרת"}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
              >
                {language === "en"
                  ? "Show all articles"
                  : "הציגו את כל המאמרים"}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Call to action section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {language === "en"
              ? "Want to cancel your report?"
              : "רוצים לבטל את הדוח שלכם?"}
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-blue-100">
            {language === "en"
              ? "Don't pay for unjustified tickets. The FineFix system provides a fast, efficient and inexpensive solution for appealing parking tickets."
              : "אל תשלמו על דוחות לא מוצדקים. מערכת FineFix מספקת פתרון מהיר, יעיל וזול לערעור על דוחות חניה."}
          </p>
          <Button
            onClick={() => navigate(createPageUrl("Appeal"))}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            {language === "en" ? "Get Started" : "התחילו עכשיו"}
            {language === "en" ? (
              <ArrowRight className="h-5 w-5 ml-2" />
            ) : (
              <ArrowLeft className="h-5 w-5 mr-2" />
            )}
          </Button>
        </div>
      </section>
    </div>
  );
}
