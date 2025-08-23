import { useParams } from "react-router-dom";
import blogsDataEn from "../utils/blogsEn";
import blogsDataHb from "../utils/blojsHb";
import { useLocalStorage } from "@uidotdev/usehooks";

const BlogDetails = () => {
  const { id } = useParams();
  const [language] = useLocalStorage("languagePreference", "he");
  const blogsData = language === "en" ? blogsDataEn : blogsDataHb;
  const blog = blogsData.find((blog) => blog.id === parseInt(id));

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
          <>
            <span className="text-3xl font-bold">{blog.title}</span>
            <p>{blog.description}</p>
            <p>{blog?.subtext}</p>

            <div className="space-y-6">
              {blog.sections?.map((item, index) => (
                <div key={"sec" + index} className="flex flex-col">
                  <span className="text-xl font-semibold">{item.heading}</span>
                  {item?.subtext && (
                    <span className="font-semibold my-2">{item?.subtext}</span>
                  )}
                  <div className="flex flex-col space-y-2 mt-3">
                    {item.content?.map((text, i) => {
                      const [label, value] = text.split(":");
                      return (
                        <p key={i}>
                          {value?.trim() ? (
                            <>
                              <strong>{label.trim()}:</strong> {value.trim()}
                            </>
                          ) : (
                            text
                          )}
                        </p>
                      );
                    })}
                    {item?.note && <span>{item?.note}</span>}
                  </div>
                </div>
              ))}
            </div>

            {blog.points && (
              <div className="space-y-6">
                {blog.points?.map((point, index) => (
                  <div className="flex flex-col" key={"point" + index}>
                    <span className="font-semibold">{point.title}</span>
                    {point.descriptions?.map((des, i) => (
                      <span key={"des" + i}>{des}</span>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {blog.faq && (
              <div>
                <span className="text-2xl font-bold mb-5 block">
                  {language === "en"
                    ? "Frequently Asked Questions"
                    : "שאלות נפוצות"}
                </span>
                {blog.faq?.map((item, i) => (
                  <div key={"faq" + i} className="flex flex-col space-y-2">
                    <strong>{item.ques}</strong>
                    <span>{item.ans}</span>
                  </div>
                ))}
              </div>
            )}

            {blog.moreQues && (
              <div className="space-y-4">
                <span className="text-2xl font-bold mb-5 block">
                  {language === "en"
                    ? "More Practical Questions"
                    : "שאלות מעשיות נוספות"}
                </span>
                {blog.moreQues.map((item, i) => (
                  <div className="flex flex-col" key={i + "mq"}>
                    <strong>{item.ques}</strong>
                    <span>{item.ans}</span>
                  </div>
                ))}
              </div>
            )}

            {blog.addQue && (
              <div>
                <strong>{blog.addQue?.ques}</strong>
                <div>{blog.addQue?.ans}</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
