'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

interface QuizAnswer {
  question: string;
  answer: string;
  points: {
    keto: number;
    lean: number;
    holiday: number;
    family: number;
    custom: number;
  };
}

const questions = [
  {
    id: 1,
    question: "What's your primary dietary goal?",
    options: [
      {
        text: "Following a ketogenic/low-carb lifestyle",
        points: { keto: 5, lean: 1, holiday: 0, family: 1, custom: 2 }
      },
      {
        text: "Building muscle or losing weight",
        points: { keto: 1, lean: 5, holiday: 0, family: 1, custom: 2 }
      },
      {
        text: "Feeding the whole family",
        points: { keto: 0, lean: 0, holiday: 1, family: 5, custom: 2 }
      },
      {
        text: "Entertaining guests or special occasions",
        points: { keto: 0, lean: 0, holiday: 5, family: 2, custom: 2 }
      },
      {
        text: "I want complete control over what I get",
        points: { keto: 1, lean: 1, holiday: 1, family: 1, custom: 5 }
      }
    ]
  },
  {
    id: 2,
    question: "How do you prefer your proteins?",
    options: [
      {
        text: "High-fat cuts with rich marbling",
        points: { keto: 5, lean: 0, holiday: 3, family: 2, custom: 2 }
      },
      {
        text: "Lean cuts with minimal fat",
        points: { keto: 0, lean: 5, holiday: 1, family: 2, custom: 2 }
      },
      {
        text: "A mix of both lean and fatty cuts",
        points: { keto: 2, lean: 2, holiday: 3, family: 4, custom: 3 }
      },
      {
        text: "Premium steakhouse-quality cuts",
        points: { keto: 3, lean: 1, holiday: 5, family: 1, custom: 2 }
      }
    ]
  },
  {
    id: 3,
    question: "What's your cooking style?",
    options: [
      {
        text: "Quick weeknight meals (30 mins or less)",
        points: { keto: 2, lean: 3, holiday: 0, family: 5, custom: 2 }
      },
      {
        text: "Meal prep for the week",
        points: { keto: 4, lean: 5, holiday: 0, family: 3, custom: 3 }
      },
      {
        text: "Weekend grilling and BBQ",
        points: { keto: 3, lean: 2, holiday: 3, family: 4, custom: 2 }
      },
      {
        text: "Special occasion cooking and entertaining",
        points: { keto: 1, lean: 0, holiday: 5, family: 2, custom: 2 }
      }
    ]
  },
  {
    id: 4,
    question: "How many people are you typically cooking for?",
    options: [
      {
        text: "Just myself",
        points: { keto: 3, lean: 4, holiday: 0, family: 0, custom: 3 }
      },
      {
        text: "2 people",
        points: { keto: 4, lean: 3, holiday: 2, family: 2, custom: 3 }
      },
      {
        text: "3-4 people (small family)",
        points: { keto: 2, lean: 2, holiday: 3, family: 5, custom: 2 }
      },
      {
        text: "5+ people or large gatherings",
        points: { keto: 1, lean: 1, holiday: 5, family: 4, custom: 2 }
      }
    ]
  },
  {
    id: 5,
    question: "Which protein variety appeals to you most?",
    options: [
      {
        text: "Beef-focused with some chicken and pork",
        points: { keto: 5, lean: 3, holiday: 4, family: 3, custom: 2 }
      },
      {
        text: "Lean chicken and turkey",
        points: { keto: 1, lean: 5, holiday: 1, family: 3, custom: 2 }
      },
      {
        text: "Family favorites like burgers and sausages",
        points: { keto: 2, lean: 2, holiday: 2, family: 5, custom: 2 }
      },
      {
        text: "Premium specialty cuts",
        points: { keto: 3, lean: 1, holiday: 5, family: 1, custom: 2 }
      },
      {
        text: "I want to choose my own mix",
        points: { keto: 1, lean: 1, holiday: 1, family: 1, custom: 5 }
      }
    ]
  }
];

const boxResults = {
  keto: {
    name: "Keto Box",
    handle: "keto-box",
    description: "Perfect for your ketogenic lifestyle with high-fat, zero-carb proteins",
    image: "/images/keto-box.jpg",
    badge: "KETO FRIENDLY"
  },
  lean: {
    name: "Lean Machine",
    handle: "lean-machine",
    description: "Build muscle and burn fat with premium lean proteins",
    image: "/images/lean-machine.jpg",
    badge: "LEAN & HEALTHY"
  },
  holiday: {
    name: "Holiday Box",
    handle: "holiday-box",
    description: "Impress your guests with show-stopping cuts for special occasions",
    image: "/images/holiday-box.jpg",
    badge: "HOLIDAY SPECIAL"
  },
  family: {
    name: "Family Favorites",
    handle: "family-favorites",
    description: "Crowd-pleasing cuts the whole family will love",
    image: "/images/family-favorites.jpg",
    badge: "FAMILY PACK"
  },
  custom: {
    name: "Custom Box",
    handle: "build-box",
    description: "Build your perfect box with complete control over every cut",
    image: "/images/custom-box.jpg",
    badge: "CUSTOM"
  }
};

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [result, setResult] = useState<keyof typeof boxResults | null>(null);

  const handleAnswer = (option: any) => {
    const newAnswers = [...answers, {
      question: questions[currentQuestion].question,
      answer: option.text,
      points: option.points
    }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result
      const scores = {
        keto: 0,
        lean: 0,
        holiday: 0,
        family: 0,
        custom: 0
      };

      newAnswers.forEach(answer => {
        scores.keto += answer.points.keto;
        scores.lean += answer.points.lean;
        scores.holiday += answer.points.holiday;
        scores.family += answer.points.family;
        scores.custom += answer.points.custom;
      });

      // Find the highest score
      const winner = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0] as keyof typeof boxResults;
      setResult(winner);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  };

  if (result) {
    const recommendedBox = boxResults[result];

    return (
      <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black font-slab text-meatzy-olive uppercase mb-4">
              Your Perfect Match!
            </h1>
            <p className="text-xl text-gray-600">
              Based on your answers, we recommend...
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-meatzy-mint/30 mb-8">
            <div className="bg-gradient-to-r from-meatzy-rare to-meatzy-welldone text-white p-8 text-center">
              <div className="inline-block bg-white text-meatzy-rare text-xs font-bold uppercase px-4 py-2 mb-4">
                {recommendedBox.badge}
              </div>
              <h2 className="text-4xl font-black font-slab uppercase mb-3">
                {recommendedBox.name}
              </h2>
              <p className="text-xl text-white/90">
                {recommendedBox.description}
              </p>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-black font-slab text-meatzy-olive uppercase mb-4">
                  Why This Box?
                </h3>
                <div className="space-y-3">
                  {answers.map((answer, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-meatzy-dill flex-shrink-0 mt-1" />
                      <div>
                        <div className="font-bold text-meatzy-olive text-sm">{answer.question}</div>
                        <div className="text-gray-600 text-sm">{answer.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={result === 'custom' ? '/build-box' : `/products/${recommendedBox.handle}`}
                  className="flex-1 bg-meatzy-rare text-white py-4 px-6 font-display font-bold uppercase tracking-widest hover:bg-meatzy-welldone transition-colors flex items-center justify-center gap-2 text-center"
                >
                  {result === 'custom' ? 'Start Building' : 'View Details'}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-meatzy-olive text-white py-4 px-6 font-display font-bold uppercase tracking-widest hover:bg-meatzy-olive/80 transition-colors"
                >
                  Retake Quiz
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm">
            Not quite right? <Link href="/" className="text-meatzy-rare hover:underline">Browse all boxes</Link> or <button onClick={handleRestart} className="text-meatzy-rare hover:underline">retake the quiz</button>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-meatzy-tallow pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black font-slab text-meatzy-olive uppercase mb-4">
            Find Your Perfect Box
          </h1>
          <p className="text-lg text-gray-600">
            Answer 5 quick questions to get your personalized recommendation
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-meatzy-rare to-meatzy-welldone h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-meatzy-mint/30 mb-6">
          <div className="bg-gradient-to-r from-meatzy-olive to-meatzy-welldone text-white p-6">
            <h2 className="text-2xl md:text-3xl font-black font-slab uppercase">
              {questions[currentQuestion].question}
            </h2>
          </div>

          <div className="p-6 space-y-3">
            {questions[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                className="w-full text-left p-5 border-2 border-meatzy-mint/30 rounded-xl hover:border-meatzy-rare hover:bg-meatzy-rare/5 transition-all duration-200 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full border-2 border-meatzy-mint/50 group-hover:border-meatzy-rare group-hover:bg-meatzy-rare/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-meatzy-olive group-hover:text-meatzy-rare font-bold">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </div>
                  <span className="text-gray-700 group-hover:text-meatzy-olive font-medium">
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="text-meatzy-olive font-bold uppercase tracking-wide flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed hover:text-meatzy-rare transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>
          <Link
            href="/"
            className="text-gray-500 hover:text-meatzy-olive transition-colors text-sm"
          >
            Exit Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
