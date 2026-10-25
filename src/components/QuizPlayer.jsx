import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Trophy, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function QuizPlayer({ quiz, onComplete }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [textAnswers, setTextAnswers] = useState({});

  if (!quiz) return null;

  const isMultipleChoice = quiz.questions[0]?.options && quiz.questions[0].options.length > 0;

  const handleSelectOption = (questionId, optionIndex) => {
    if (submitted) return;
    sounds.playPop();
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleTextChange = (questionId, val) => {
    if (submitted) return;
    setTextAnswers(prev => ({
      ...prev,
      [questionId]: val
    }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let score = 0;

    if (isMultipleChoice) {
      quiz.questions.forEach(q => {
        if (userAnswers[q.id] === q.correctIndex) {
          score++;
        }
      });
    } else {
      // Text answers check
      quiz.questions.forEach(q => {
        const given = (textAnswers[q.id] || '').trim().toLowerCase();
        const valid = q.correctAnswers?.some(ans => ans.toLowerCase() === given);
        if (valid) score++;
      });
    }

    if (score === quiz.questions.length && score > 0) {
      sounds.playFanfare();
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 }
      });
    } else if (score >= quiz.questions.length / 2) {
      sounds.playSuccess();
    } else {
      sounds.playError();
    }

    if (onComplete) {
      onComplete(quiz.id, score, quiz.questions.length);
    }
  };

  const handleReset = () => {
    sounds.playPop();
    setUserAnswers({});
    setTextAnswers({});
    setSubmitted(false);
  };

  // Calculate score
  let score = 0;
  if (isMultipleChoice) {
    quiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctIndex) score++;
    });
  } else {
    quiz.questions.forEach(q => {
      const given = (textAnswers[q.id] || '').trim().toLowerCase();
      if (q.correctAnswers?.some(ans => ans.toLowerCase() === given)) score++;
    });
  }

  const answeredCount = isMultipleChoice
    ? Object.keys(userAnswers).length
    : Object.keys(textAnswers).filter(k => textAnswers[k]?.trim()).length;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Exercice Interactif Moodle
          </span>
          <h3 className="font-['Outfit'] text-xl sm:text-2xl font-black text-slate-900 mt-2">{quiz.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{quiz.source}</p>
        </div>
        {submitted && (
          <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 shadow-xs">
            <Trophy className="w-5 h-5 text-amber-600" />
            <span className="font-['Outfit'] font-black text-base text-amber-900">
              Score : {score} / {quiz.questions.length}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 ml-1">
              {Math.round((score / quiz.questions.length) * 100)}%
            </span>
          </div>
        )}
      </div>

      <p className="text-xs sm:text-sm text-slate-700 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 leading-relaxed">
        💡 <strong className="text-indigo-700 font-bold">Consigne :</strong> {quiz.instruction}
      </p>

      <div className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const isQMultiple = q.options && q.options.length > 0;
          const selected = userAnswers[q.id];
          const isCorrectChoice = selected === q.correctIndex;

          const textGiven = (textAnswers[q.id] || '').trim().toLowerCase();
          const isCorrectText = q.correctAnswers?.some(a => a.toLowerCase() === textGiven);

          return (
            <div
              key={q.id || idx}
              className={`p-5 rounded-2xl border-2 transition-all ${
                submitted
                  ? (isQMultiple ? isCorrectChoice : isCorrectText)
                    ? 'bg-emerald-50/60 border-emerald-300'
                    : 'bg-rose-50/60 border-rose-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                  Question {idx + 1} / {quiz.questions.length}
                </span>
                {submitted && (
                  (isQMultiple ? isCorrectChoice : isCorrectText) ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )
                )}
              </div>

              {/* Question title / Verb */}
              {q.verb ? (
                <div className="text-base font-bold text-slate-900 mb-4">
                  Verbe à identifier : <span className="text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200 font-mono font-black">{q.verb}</span>
                </div>
              ) : q.prompt ? (
                <div className="mb-4">
                  <p className="text-sm sm:text-base font-bold text-slate-900">{q.prompt}</p>
                  {q.context && (
                    <p className="text-sm font-serif italic text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200 mt-2">
                      « {q.context} »
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm sm:text-base font-bold text-slate-900 mb-4">{q.question}</p>
              )}

              {/* Options for Multiple Choice */}
              {isQMultiple ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    const isThisCorrect = optIdx === q.correctIndex;

                    let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';
                    if (submitted) {
                      if (isThisCorrect) {
                        btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold';
                      } else if (isOptionSelected && !isThisCorrect) {
                        btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-medium';
                      } else {
                        btnStyle = 'bg-slate-50 border-slate-100 text-slate-400 opacity-60';
                      }
                    } else if (isOptionSelected) {
                      btnStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-500/30';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`text-left p-3.5 rounded-xl border-2 text-xs sm:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                      >
                        <span className="font-mono font-bold text-xs text-slate-500 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Text Input for Conjugation */
                <div className="mt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={submitted}
                      value={textAnswers[q.id] || ''}
                      onChange={(e) => handleTextChange(q.id, e.target.value)}
                      placeholder="Tapez votre réponse ici..."
                      className={`flex-1 px-4 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                        submitted
                          ? isCorrectText
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-900 font-bold'
                            : 'border-rose-400 bg-rose-50 text-rose-900'
                          : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500 bg-white'
                      }`}
                    />
                  </div>
                  {submitted && !isCorrectText && (
                    <div className="text-xs text-rose-700 mt-2 flex items-center gap-1.5 font-medium">
                      <span>Réponse attendue :</span>
                      <strong className="text-rose-900 font-mono bg-rose-100 px-2 py-0.5 rounded">
                        {q.correctAnswers?.join(' ou ')}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Explanation */}
              {submitted && q.explanation && (
                <div className="mt-4 pt-3 border-t border-slate-200 text-xs sm:text-sm text-slate-700 flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl">
                  <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-bold text-indigo-700">Explication pédagogique : </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-100">
        <span className="text-xs font-medium text-slate-500">
          Progression : <strong>{answeredCount}</strong> sur <strong>{quiz.questions.length}</strong> répondu(s)
        </span>

        <div className="flex gap-3">
          {submitted ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 transition"
            >
              <RefreshCw className="w-4 h-4" /> Recommencer l'exercice
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition shadow-sm ${
                answeredCount === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              Valider mes réponses <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
