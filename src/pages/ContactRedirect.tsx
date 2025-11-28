import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const ContactRedirect = () => {
  useEffect(() => {
    // Redirect to contact section on homepage
    window.location.replace("/#contact");
  }, []);

  return (
    <>
      <Helmet>
        {/* Prevent indexing - redirect page should not appear in search results */}
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Canonical to homepage contact section */}
        <link rel="canonical" href="https://tarkhisun.ir/#contact" />
        
        {/* Unique title to prevent duplicate content issues */}
        <title>انتقال به صفحه تماس | ترخیصان</title>
        <meta name="description" content="در حال انتقال به بخش تماس با ترخیصان - مشاوره گمرکی و ترخیص کالا" />
      </Helmet>
      <div className="flex items-center justify-center min-h-screen text-foreground">
        در حال انتقال به صفحه تماس...
      </div>
    </>
  );
};

export default ContactRedirect;
