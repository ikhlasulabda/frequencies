// components/QuizStep.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Question } from '@/types'

interface QuizStepProps {
    question: Question
    value: string
    onChange: (val: string) => void
}

export default function QuizStep({ question, value, onChange }: QuizStepProps) {
    const [showCustomInput, setShowCustomInput] = useState(() => {
        if (question.id === 2) {
            const isPredefined = question.choices?.some(c => c.label === value) ?? false
            return !!value && !isPredefined
        }
        return false
    })
    const [prevQuestionId, setPrevQuestionId] = useState(question.id)

    if (question.id !== prevQuestionId) {
        setPrevQuestionId(question.id)
        const isPredefined = question.choices?.some(c => c.label === value) ?? false
        setShowCustomInput(!!value && !isPredefined)
    }

    const isDualColumn = question.id === 1 || question.id === 3
    const choices = question.choices ?? []

    function renderChoice(choice: { label: string; display: string }, index: number) {
        const isSelected = !showCustomInput && value === choice.label
        return (
            <motion.button
                key={choice.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.28, delay: index * 0.045 }}
                onClick={() => {
                    setShowCustomInput(false)
                    onChange(choice.label)
                }}
                className={`quiz-choice${isSelected ? ' quiz-choice--selected' : ''}`}
            >
                {choice.display}
            </motion.button>
        )
    }

    function renderChoices() {
        if (isDualColumn && choices.length >= 10) {
            const left = choices.slice(0, 5)
            const right = choices.slice(5, 10)
            return (
                <div className="quiz-choices-dual">
                    <div className="quiz-choices-col">
                        {left.map((choice, i) => renderChoice(choice, i))}
                    </div>
                    <div className="quiz-choices-col">
                        {right.map((choice, i) => renderChoice(choice, i + 5))}
                    </div>
                </div>
            )
        }

        return (
            <div className="quiz-choices-single">
                {choices.map((choice, i) => renderChoice(choice, i))}
            </div>
        )
    }

    return (
        <div className="w-full">
            <h2 className="font-display" style={{
                fontSize: 'clamp(26px, 6.5vw, 36px)',
                fontWeight: 400,
                lineHeight: 1.2,
                letterSpacing: '-0.01em',
                color: 'var(--foreground)',
                marginBottom: '24px',
            }}>
                {question.text}
            </h2>

            {question.type === 'choice' && (
                <div>
                    {renderChoices()}

                    {question.id === 2 && (
                        <div className="quiz-choices-single" style={{ marginTop: choices.length > 0 ? '14px' : 0 }}>
                            <motion.button
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.28, delay: choices.length * 0.045 }}
                                onClick={() => {
                                    setShowCustomInput(true)
                                    onChange('')
                                }}
                                className={`quiz-choice${showCustomInput ? ' quiz-choice--selected' : ''}`}
                                style={{ color: 'var(--foreground-muted)', fontStyle: 'italic' }}
                            >
                                Tulis sendiri...
                            </motion.button>

                            {showCustomInput && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <textarea
                                        value={question.choices?.some(c => c.label === value) ? '' : value}
                                        onChange={(e) => onChange(e.target.value)}
                                        maxLength={100}
                                        placeholder="Ceritain kondisi lo..."
                                        rows={3}
                                        autoFocus
                                        className="textarea-field"
                                    />
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {question.type === 'text' && (
                <textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    maxLength={question.maxLength}
                    placeholder={question.placeholder}
                    rows={4}
                    className="textarea-field"
                />
            )}
        </div>
    )
}
