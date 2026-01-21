"use client"

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import confetti from "canvas-confetti"
import GradientButton from "../GradientButton"
import { ArrowRight, Flame, Volume2, VolumeX, Music } from "lucide-react"

const confettiColors = ["#FF3CAC", "#F687B3", "#D8B4FE", "#C084FC", "#F472B6"];

export default function CakeScreen({ onNext }) {
  const [lit, setLit] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    // Initialize audio
    if (typeof Audio !== 'undefined') {
      audioRef.current = new Audio(process.env.NEXT_PUBLIC_BIRTHDAY_SONG || '/music/happy-birthday.mp3')
      audioRef.current.loop = true
      audioRef.current.volume = 0.7
      
      // Try to autoplay with user interaction
      const handleFirstInteraction = () => {
        if (audioRef.current && musicPlaying) {
          audioRef.current.play().catch(e => console.log("Auto-play prevented:", e))
        }
        document.removeEventListener('click', handleFirstInteraction)
        document.removeEventListener('touchstart', handleFirstInteraction)
      }
      
      document.addEventListener('click', handleFirstInteraction)
      document.addEventListener('touchstart', handleFirstInteraction)
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const toggleMusic = () => {
    if (!audioRef.current) return
    
    if (musicPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(e => console.log("Auto-play prevented:", e))
    }
    setMusicPlaying(!musicPlaying)
  }

  const lightCandle = () => {
    if (lit) return
    setLit(true)
    
    // Start music if not already playing
    if (audioRef.current && !musicPlaying) {
      audioRef.current.play().catch(e => console.log("Auto-play prevented:", e))
      setMusicPlaying(true)
    }
    
    // Fireworks sequence
    const launchFireworks = () => {
      // Multiple bursts
      setTimeout(() => burst(), 300);
      setTimeout(() => burst(), 600);
      setTimeout(() => burst(), 900);
      setTimeout(() => burstSide(), 1200);
      setTimeout(() => burstSide(), 1500);
      setTimeout(() => burst(), 1800);
      setTimeout(() => burst(), 2100);
      
      // Heart-shaped burst
      setTimeout(() => {
        const scalar = 2;
        const heart = confetti.shapeFromText({ text: '❤️', scalar });
        
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          shapes: [heart],
          colors: ['#FF3CAC', '#F687B3'],
        });
      }, 2400);
    }
    
    launchFireworks()
  }

  const burst = () => {
    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 },
      colors: confettiColors,
    })
  }

  const burstSide = () => {
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: confettiColors,
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: confettiColors,
    });
  }

  return (
    <div className="px-4 md:px-6 py-10 text-center relative">
      {lit && (
        <motion.div className="fixed top-50 lg:top-60 left-0 w-full text-center text-[40px] md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 drop-shadow leading-tight px-4"
          style={{ filter: "drop-shadow(0 0 20px rgba(255,105,180,0.4))" }}
          initial={{ opacity: 0, scale: 0.8, }}
          animate={{ opacity: 1, scale: 1, }}
          transition={{ duration: 1, ease: "easeOut", delay: 1.5 }}
        >
          Happy Birthday, {process.env.NEXT_PUBLIC_RECIPIENT_NAME}!
        </motion.div>
      )}

      {/* Music control button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-sm border border-pink-300/30 hover:scale-110 transition-transform"
      >
        {musicPlaying ? (
          <Volume2 className="w-6 h-6 text-pink-300" />
        ) : (
          <VolumeX className="w-6 h-6 text-pink-300" />
        )}
      </motion.button>

      <div className="relative flex flex-col items-center gap-8 mt-52">
        <div className="relative mb-6">
          <Cake lit={lit} />
        </div>
        <AnimatePresence mode="wait">
          {!lit ? (
            <motion.div
              key="light"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.5 } }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <GradientButton onClick={lightCandle}>
                <Flame size={20} />
                Light the Candle
              </GradientButton>
            </motion.div>
          ) : (
            <motion.div
              key="next"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.5, delay: 3 } }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <GradientButton onClick={onNext}>
                Next
                <ArrowRight size={20} className="mt-0.5" />
              </GradientButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Cake({ lit }) {
  return (
    <div className="flex flex-col items-center">
      <div className="cake">
        <div className="plate"></div>
        <div className="layer layer-bottom"></div>
        <div className="layer layer-middle"></div>
        <div className="layer layer-top"></div>
        <div className="icing"></div>
        <div className="drip drip1"></div>
        <div className="drip drip2"></div>
        <div className="drip drip3"></div>
        <div className="candle">
          {lit && <motion.div
            initial={{ opacity: 0, scaleY: 0.2, y: 10 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.25, 0.1, 0.25, 1.0],
            }}
            className="flame"></motion.div>}
        </div>
      </div>
      
      {/* Sparkle effects around cake */}
      {lit && [...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-yellow-300 rounded-full"
          style={{
            left: `${Math.cos((i / 8) * Math.PI * 2) * 180 + 125}px`,
            top: `${Math.sin((i / 8) * Math.PI * 2) * 180 + 100}px`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}
