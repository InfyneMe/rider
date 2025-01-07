'use client';

import { useEffect } from "react";

const AdSense = () => {
  useEffect(() => {
    // Ensure that adsbygoogle is initialized and has the correct type
    if (typeof window !== "undefined" && window.adsbygoogle) {
      try {
        // Push the ad request only after the correct initialization
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, []);

  return (
    <div>
      {/* AdSense Ad Slot */}
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4404585551856662"
        data-ad-slot="1234567890"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSense;
