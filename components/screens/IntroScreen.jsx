"use client"

import GradientButton from "../GradientButton"
import { Gift, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function IntroScreen({ onNext }) {
    return (
        <div className="py-10 md:py-14 text-center">
            <div className="flex flex-col items-center gap-6">
                {/* Animated birthday icon */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 1, type: "spring" }}
                    className="relative"
                >
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-pink-500 via-rose-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(244,114,182,0.5)]">
                        <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-white" />
                    </div>
                    <motion.div
                        className="absolute -top-2 -right-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                    </motion.div>
                    <motion.div
                        className="absolute -bottom-2 -left-2"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-500"></div>
                    </motion.div>
                </motion.div>

                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-pretty text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 drop-shadow leading-tight"
                        style={{
                            filter: "drop-shadow(0 0 20px rgba(255,105,180,0.4))",
                        }}>
                        {process.env.NEXT_PUBLIC_RECIPIENT_NAME} was born today, {process.env.NEXT_PUBLIC_BIRTHDAY_AGE} years ago!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="mt-4 text-xl text-pink-200"
                    >
                        Yes, it's YOU! A little surprise awaits...
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-8"
                >
                    <GradientButton
                        onClick={() => { onNext?.() }}
                    >
                        <Gift size={20} />
                        Start the surprise
                    </GradientButton>
                </motion.div>

                {/* Floating particles */}
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-pink-400"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                            duration: 2 + Math.random() * 3,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>
        </div>
    )
}
