// components/QuizStep.tsx

import { Question } from '@/types'

interface QuizStepProps {
    question: Question
    value: string
    onChange: (val: string) => void
}

export default function QuizStep({ question, value, onChange }: QuizStepProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            <p className="text-sm text-gray-400 mb-2">
                {question.id} / 5
            </p>
            <h2 className="text-xl font-semibold text-white mb-6">
                {question.text}
            </h2>

            {question.type === 'choice' && (
                <div className="flex flex-col gap-3">
                    {question.choices?.map((choice) => (
                        <button
                            key={choice.label}
                            onClick={() => onChange(choice.label)}
                            className={`w-full text-left px-4 py-3 border text-sm transition-colors
                ${value === choice.label
                                    ? 'border-white bg-white text-black'
                                    : 'border-gray-600 text-gray-300 hover:border-white'
                                }`}
                        >
                            {choice.display}
                        </button>
                    ))}
                </div>
            )}

            {question.type === 'text' && (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    maxLength={question.maxLength}
                    placeholder={question.placeholder}
                    rows={3}
                    className="w-full bg-transparent border border-gray-600 text-white
            placeholder-gray-500 px-4 py-3 text-sm resize-none
            focus:outline-none focus:border-white"
                />
            )}
        </div>
    )
}