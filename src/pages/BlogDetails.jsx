import { useEffect } from "react";
import { useParams } from "react-router-dom";
import blogsDataEn from "../utils/blogsEn";
import blogsDataHb from "../utils/blojsHb";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

const BlogDetails = () => {
  const { slug } = useParams();
  const [language] = useLocalStorage("languagePreference", "he");
  const blogsData = language === "en" ? blogsDataEn : blogsDataHb;
  const blog = blogsData.find((blog) => blog.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 space-y-6">
        {!blog ? (
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-blue-600">
              {language === "en" ? "Blog not found" : "המאמר לא נמצא"}
            </h1>
            <p className="mt-4 text-gray-600">
              {language === "en"
                ? "The blog you are looking for does not exist or may have been removed."
                : "המאמר שחיפשת אינו קיים או הוסר."}
            </p>
          </div>
        ) : (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="p-4 md:p-6"
          >
            {/* Blog Title */}
            <span className="text-3xl font-bold">{blog.title}</span>

            {/* Author Info */}
            <div className="flex items-center gap-3 mt-4 text-gray-600">
              {blog.authorImg && (
                <img
                  src={blog.authorImg}
                  alt={blog.author || "Author"}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}

              <div>
                {blog.author && (
                  <span className="font-semibold text-gray-800 block text-lg">
                    {typeof blog.author === "string"
                      ? blog.author
                      : blog.author.name}
                  </span>
                )}

                <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                  {blog.publishDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{blog.publishDate}</span>
                    </div>
                  )}

                  {blog.readTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{blog.readTime} min read</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {blog.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Blog Description */}
            <div className="mt-6">
              <p className="text-gray-600 text-lg">{blog.description}</p>
            </div>

            {blog?.subtext && <p className="text-gray-600 text-base">{blog.subtext}</p>}

            {/* Blog Image */}
            {blog.image && (
              <div className="my-6">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-[500px] rounded-2xl shadow-md object-cover"
                />
              </div>
            )}

            {/* Sections */}
            <div className="space-y-8 mt-6">
              {blog.sections?.map((item, index) => (
                <div key={"sec" + index} className="flex flex-col">
                  <span className="text-xl text-black font-semibold">
                    {item.heading}
                  </span>
                  {item?.subtext && (
                    <span className="my-2 text-gray-600 text-lg">
                      {item?.subtext}
                    </span>
                  )}

                  {item.content?.length > 0 && (
                    <ul className="list-disc mt-3 pl-10 space-y-2">
                      {item.content.map((text, i) => {
                        const [label, value] = text.split(":");
                        return (
                          <li key={i} className="text-gray-600 text-lg">
                            {value?.trim() ? (
                              <>
                                <strong className="text-gray-600 text-lg">
                                  {label.trim()}:
                                </strong>{" "}
                                {value.trim()}
                              </>
                            ) : (
                              text
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {item?.note && (
                    <span className="italic text-base text-gray-500 mt-2">
                      {item.note}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Points */}
            {blog.points && (
              <div className="space-y-6 mt-8">
                {blog.points.map((point, index) => (
                  <div key={"point" + index}>
                    <span className="font-semibold text-lg block mb-2">
                      {point.title}
                    </span>
                    <ul className="list-disc pl-10 text-gray-600 text-lg space-y-2">
                      {point.descriptions?.map((des, i) => (
                        <li key={"des" + i}>{des}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* FAQ */}
            {blog.faq && (
              <div className="mt-10">
                <span className="text-2xl font-bold mb-5 block">
                  {language === "en"
                    ? "Frequently Asked Questions"
                    : "שאלות נפוצות"}
                </span>
                <div className="space-y-4">
                  {blog.faq.map((item, i) => (
                    <div key={"faq" + i}>
                      <strong className="block text-lg">{item.ques}</strong>
                      <p className="text-gray-600 text-lg">{item.ans}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* More Practical Questions */}
            {blog.moreQues && (
              <div className="mt-10">
                <span className="text-2xl font-bold mb-5 block">
                  {language === "en"
                    ? "More Practical Questions"
                    : "שאלות מעשיות נוספות"}
                </span>
                <div className="space-y-4">
                  {blog.moreQues.map((item, i) => (
                    <div key={i + "mq"}>
                      <strong className="block text-lg">{item.ques}</strong>
                      <p className="text-gray-700">{item.ans}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Question */}
            {blog.addQue && (
              <div className="mt-8">
                <strong className="block">{blog.addQue?.ques}</strong>
                <p className="text-gray-700">{blog.addQue?.ans}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
