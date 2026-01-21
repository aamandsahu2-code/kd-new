"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import GradientButton from "../GradientButton"
import { ArrowRight, Heart, Star, Sparkles } from "lucide-react";

export default function MessageScreen({ onNext }) {
    const recipientName = process.env.NEXT_PUBLIC_RECIPIENT_NAME || "Cutiepie"
    const birthdayAge = process.env.NEXT_PUBLIC_BIRTHDAY_AGE || "20"

    return (
        <div className="px-4 md:px-6 py-10 text-center">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 drop-shadow mb-6 leading-tight flex items-center justify-center gap-3"
            >
                <Heart className="text-red-400 animate-pulse" size={32} />
                A Special Message
                <Sparkles className="text-yellow-400" size={32} />
            </motion.h2>

            <div className="mx-auto relative w-full max-w-3xl flex justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 30, rotateY: 90 }}
                    animate={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-auto max-w-xl bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 rounded-2xl shadow-lg p-4 md:p-6 text-center border-2 border-pink-200 relative overflow-hidden"
                >
                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-pink-300 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-pink-300 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-pink-300 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-pink-300 rounded-br-lg"></div>
                    
                    {/* Floating hearts in background */}
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-pink-200/30"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, -20, 0],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 4 + Math.random() * 3,
                                repeat: Infinity,
                                delay: i * 0.5,
                            }}
                        >
                            <Heart size={24} />
                        </motion.div>
                    ))}

                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-600 to-fuchsia-600 mb-4">
                            Dear {recipientName} 💕
                        </h3>
                        
                        <div className="text-[#301733] text-base md:text-lg leading-relaxed text-left space-y-4 px-2">
                            <p className="flex items-start gap-2">
                                <Star className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                                <span>Happy {birthdayAge}th Birthday! 🎉 Today is all about celebrating the incredible person you are!</span>
                            </p>
                            
                            <p className="flex items-start gap-2">
                                <Heart className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                                <span>Your smile has the power to light up any room, and your kindness touches every heart you meet.</span>
                            </p>
                            
                            <p className="flex items-start gap-2">
                                <Sparkles className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                                <span>May this special year bring you endless joy, laughter that echoes through your days, and dreams that bloom into beautiful realities.</span>
                            </p>
                            
                            <p className="flex items-start gap-2">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 mt-1 flex-shrink-0"></div>
                                <span>Wishing you adventures that create lifelong memories, love that surrounds you always, and success in everything you pursue.</span>
                            </p>
                            
                            <p className="text-center text-lg font-semibold text-pink-700 mt-6 pt-4 border-t border-pink-200">
                                Remember: You are loved, you are valued, and you are absolutely amazing! ✨
                            </p>
                            
                            <p className="text-center text-pink-600 font-medium">
                                With all my love and best wishes 💖
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="mt-8 flex justify-center"
            >
                <GradientButton onClick={onNext}>
                    Watch the Grand Finale
                    <ArrowRight size={20} className="mt-0.5" />
                </GradientButton>
            </motion.div>
        </div>
    )
}
