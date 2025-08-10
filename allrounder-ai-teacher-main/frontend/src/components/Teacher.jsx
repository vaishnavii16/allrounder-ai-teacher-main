import { teachers, useAITeacher } from "../hooks/useAITeacher";
import { Html, useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { MathUtils, MeshStandardMaterial } from "three";
import { randInt } from "three/src/math/MathUtils";

const ANIMATION_FADE_TIME = 0.5;

export function Teacher({ teacher, ...props }) {
  const group = useRef();
  const { scene } = useGLTF(`/models/Teacher_${teacher}.glb`);
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child.material) {
        child.material = new MeshStandardMaterial({
          map: child.material.map,
        });
      }
    });
  }, [scene]);

  const currentMessage = useAITeacher((state) => state.currentMessage);
  const loading = useAITeacher((state) => state.loading);
  const { animations } = useGLTF(`/models/animations_${teacher}.glb`);
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState("Idle");

  // Debug: Log available animations
  useEffect(() => {
    if (actions) {
      console.log(`Available animations for ${teacher}:`, Object.keys(actions));
    }
  }, [actions, teacher]);

  // Imported from r3f-virtual-girlfriend project
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    let blinkTimeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 100);
      }, randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  useEffect(() => {
    if (loading) {
      // For thinking state, use Idle animation with special visual indicator
      // Most models don't have a dedicated "Thinking" animation
      setAnimation("Idle");
    } else if (currentMessage) {
      setAnimation(randInt(0, 1) ? "Talking" : "Talking2");
    } else {
      setAnimation("Idle");
    }
  }, [currentMessage, loading, actions]);

  useFrame(({ camera }) => {
    // Smile
    lerpMorphTarget("mouthSmile", 0.2, 0.5);
    // Blinking
    lerpMorphTarget("eye_close", blink ? 1 : 0, 0.5);

    // Special behavior during thinking/loading
    if (loading) {
      // Add subtle head tilt or contemplative expression during thinking
      const time = Date.now() * 0.002;
      const thinkingValue = Math.sin(time) * 0.1;
      // Slightly furrow brow or look contemplative
      lerpMorphTarget("browDown", Math.abs(thinkingValue), 0.1);
    }

    // Talking - simplified without visemes
    if (!loading) {
      for (let i = 0; i <= 21; i++) {
        lerpMorphTarget(i, 0, 0.1); // reset morph targets only when not thinking
      }
    }

    if (currentMessage && currentMessage.speechUtterance) {
      // Check if speech is currently playing
      const isSpeaking = speechSynthesis.speaking && !speechSynthesis.paused;
      
      if (isSpeaking) {
        // Create simple mouth movement animation during speech
        const time = Date.now() * 0.01;
        const mouthValue = Math.sin(time) * 0.5 + 0.5; // Oscillate between 0 and 1
        lerpMorphTarget("mouthOpen", mouthValue * 0.7, 0.3);
        lerpMorphTarget("mouthSmile", 0.2 + mouthValue * 0.3, 0.3);
        
        // Switch between talking animations periodically
        if (
          actions[animation] && 
          actions[animation].time >
          actions[animation].getClip().duration - ANIMATION_FADE_TIME
        ) {
          setAnimation((animation) =>
            animation === "Talking" ? "Talking2" : "Talking"
          ); // Could load more type of animations and randomization here
        }
      }
    }
  });

  useEffect(() => {
    // Only proceed if we have a valid animation and it exists in actions
    if (actions && actions[animation]) {
      actions[animation]
        ?.reset()
        .fadeIn(mixer && mixer.time > 0 ? ANIMATION_FADE_TIME : 0)
        .play();
      return () => {
        actions[animation]?.fadeOut(ANIMATION_FADE_TIME);
      };
    } else {
      // Fallback: if animation doesn't exist, try to use Idle
      if (actions && actions["Idle"] && animation !== "Idle") {
        console.warn(`Animation "${animation}" not found, falling back to Idle`);
        setAnimation("Idle");
      }
    }
  }, [animation, actions, mixer]);

  const lerpMorphTarget = (target, value, speed = 0.1) => {
    scene.traverse((child) => {
      if (child.isSkinnedMesh && child.morphTargetDictionary) {
        const index = child.morphTargetDictionary[target];
        if (
          index === undefined ||
          child.morphTargetInfluences[index] === undefined
        ) {
          return;
        }
        child.morphTargetInfluences[index] = MathUtils.lerp(
          child.morphTargetInfluences[index],
          value,
          speed
        );
      }
    });
  };

  const [thinkingText, setThinkingText] = useState(".");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setThinkingText((thinkingText) => {
          if (thinkingText.length === 3) {
            return ".";
          }
          return thinkingText + ".";
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <group {...props} dispose={null} ref={group}>
      {loading && (
        <Html position-y={teacher === "Nanami" ? 1.6 : 1.8}>
          <div className="flex justify-center items-center -translate-x-1/2">
            <span className="relative flex h-12 w-12 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
              <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-300 opacity-40"></span>
              <span className="relative inline-flex items-center justify-center rounded-full h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-sm shadow-lg">
                {thinkingText}
              </span>
            </span>
          </div>
        </Html>
      )}
      <primitive object={scene} />
    </group>
  );
}

teachers.forEach((teacher) => {
  useGLTF.preload(`/models/Teacher_${teacher}.glb`);
  useGLTF.preload(`/models/animations_${teacher}.glb`);
});
