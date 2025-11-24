import { useEffect } from "react";

const ContactRedirect = () => {
  useEffect(() => {
    // Redirect to contact section on homepage
    window.location.replace("/#contact");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-foreground">
      در حال انتقال به صفحه تماس...
    </div>
  );
};

export default ContactRedirect;
