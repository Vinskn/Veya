import { useEffect, useState } from "react";

export const useDeviceWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [deviceType, setDeviceType] = useState<'small' | 'medium' | 'large'>(window.innerWidth < 512 ? 'small' : window.innerWidth < 768 ? 'medium' : 'large');

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      if (window.innerWidth < 512) {
        setDeviceType('small');
      } else if (window.innerWidth < 768) {
        setDeviceType('medium');
      } else {
        setDeviceType('large');
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { width, deviceType};
}