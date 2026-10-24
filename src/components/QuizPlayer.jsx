import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Trophy, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function QuizPlayer({ quiz, onComplete }) {
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [textAnswers, setTextAnswers] = useState({});

  if (!quiz) return null;

  const isMultipleChoice = quiz.questions[0]?.options && quiz.questions[0].options.length > 0;

  const handleSelectOption = (questionId, optionIndex) => {
    if (submitted) return;
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
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    if (onComplete) {
      onComplete(quiz.id, score, quiz.questions.length);
    }
  };

  const handleReset = () => {
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
    <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Exercice Interactif Moodle
          </span>
          <h3 className="text-xl font-bold text-white mt-1">{quiz.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{quiz.source}</p>
        </div>
        {submitted && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">
              Score : {score} / {quiz.questions.length}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 ml-1">
              {Math.round((score / quiz.questions.length) * 100)}%
            </span>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-300 mb-6 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
        💡 <strong className="text-indigo-300">Consigne :</strong> {quiz.instruction}
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
              className={`p-4 rounded-xl border transition-all ${
                submitted
                  ? (isQMultiple ? isCorrectChoice : isCorrectText)
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-rose-950/20 border-rose-500/40'
                  : 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-700/60 text-slate-300">
                  Question {idx + 1} / {quiz.questions.length}
                </span>
                {submitted && (
                  (isQMultiple ? isCorrectChoice : isCorrectText) ? (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )
                )}
              </div>

              {/* Question title / Verb */}
              {q.verb ? (
                <div className="text-base font-semibold text-white mb-3">
                  Verbe à identifier : <span className="text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20 font-mono">{q.verb}</span>
                </div>
              ) : q.prompt ? (
                <div className="mb-3">
                  <p className="text-sm font-medium text-slate-200">{q.prompt}</p>
                  {q.context && (
                    <p className="text-sm font-serif italic text-amber-200/90 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 mt-1.5">
                      « {q.context} »
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm font-semibold text-white mb-3">{q.question}</p>
              )}

              {/* Options for Multiple Choice */}
              {isQMultiple ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isOptionSelected = selected === optIdx;
                    const isThisCorrect = optIdx === q.correctIndex;

                    let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700/80 hover:border-slate-600';
                    if (submitted) {
                      if (isThisCorrect) {
                        btnStyle = 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200 font-semibold';
                      } else if (isOptionSelected && !isThisCorrect) {
                        btnStyle = 'bg-rose-500/20 border-rose-500/60 text-rose-200';
                      } else {
                        btnStyle = 'bg-slate-800/40 border-slate-800 text-slate-400 opacity-60';
                      }
                    } else if (isOptionSelected) {
                      btnStyle = 'bg-indigo-600/30 border-indigo-500 text-indigo-200 font-medium ring-1 ring-indigo-500';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`text-left px-3.5 py-2.5 rounded-lg border text-sm transition-all flex items-start gap-2.5 ${btnStyle}`}
                      >
                        <span className="font-mono text-xs text-slate-400 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span className="flex-1">{opt}</span>
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
                      placeholder="Tapez la réponse ici..."
                      className={`flex-1 px-3.5 py-2 rounded-lg bg-slate-900 border text-sm text-white focus:outline-none focus:ring-2 ${
                        submitted
                          ? isCorrectText
                            ? 'border-emerald-500/60 bg-emerald-950/20 text-emerald-200'
                            : 'border-rose-500/60 bg-rose-950/20 text-rose-200'
                          : 'border-slate-700 focus:ring-indigo-500 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                  {submitted && !isCorrectText && (
                    <div className="text-xs text-rose-300 mt-1.5 flex items-center gap-1">
                      <span>Réponse attendue :</span>
                      <strong className="text-white font-mono bg-rose-900/40 px-1.5 py-0.5 rounded">
                        {q.correctAnswers?.join(' ou ')}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              {/* Feedback Explanation */}
              {submitted && q.explanation && (
                <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-300 flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg">
                  <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-indigo-300">Explication pédagogique : </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800">
        <span className="text-xs text-slate-400">
          Progression : {answeredCount} sur {quiz.questions.length} répondue(s)
        </span>

        <div className="flex gap-3">
          {submitted ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition"
            >
              <RefreshCw className="w-4 h-4" /> Recommencer l'exercice
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={answeredCount === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition shadow-lg ${
                answeredCount === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
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
