
import { useState, useEffect } from "react";
import Confetti from "react-confetti";

interface ConfettiEffectProps {
  isActive: boolean;
}

const ConfettiEffect = ({ isActive }: ConfettiEffectProps) => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      // We don't set a timeout to hide the confetti, so it will remain visible 
      // until all particles fall off the screen
    }
  }, [isActive]);

  if (!isVisible) return null;

  return (
    <Confetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      recycle={false}
      numberOfPieces={500}
      gravity={0.2}
      initialVelocityY={10}
      initialVelocityX={5}
      colors={['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7', '#C7CEEA']}
      onConfettiComplete={() => setIsVisible(false)}
    />
  );
};

export default ConfettiEffect;
