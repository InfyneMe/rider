import { useEffect } from 'react'

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4404585551856662"
        data-ad-slot="3726060420"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}