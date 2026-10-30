import React, { useState } from 'react';
import { 
  Heart, 
  Zap, 
  Sparkles, 
  Award, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw,
  Smile,
  Frown,
  Brain,
  ShieldCheck,
  GraduationCap,
  Users,
  Compass,
  ArrowRight
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import AuroreGameBriefingModal from './AuroreGameBriefingModal';

/**
 * GameSurvivantNovel:
 * Visual Novel / Jeu de Survie Académique (« HECh 2026 : Le Guide du Survivant Connecté »).
 * Fiction interactive à embranchements avec jauges d'énergie, éthique, réputation et ECTS
 * couvrant une année d'études complète (Septembre à Juin).
 * 
 * Graphismes Haute Définition : Scénographie animée, portraits d'interlocuteurs, badges d'impacts.
 */
export default function GameSurvivantNovel({ onComplete }) {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [showBriefing, setShowBriefing] = useState(true);
  
  // Player Survivant Gauges
  const [stats, setStats] = useState({
    energy: 80,       // 0 to 100
    ethics: 75,       // 0 to 100
    competence: 50,   // 0 to 100
    ects: 12          // 0 to 60
  });

  const [historyLog, setHistoryLog] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  const CHAPTERS = [
    {
      id: "ch1",
      period: "Septembre · Rentrée & Premier Dossier",
      location: "Grand Amphithéâtre Rivageois · Quai de Rome",
      characterName: "Julien (Camarade de Promo)",
      avatarGradient: "from-blue-500 to-indigo-600",
      avatarEmoji: "🧑‍🎓",
      title: "La Tentation de la Synthèse Automatique",
      description: "Vous devez rendre une fiche de synthèse de 3 pages sur le Décret Paysage pour vendredi. Julien s'approche à la pause et vous chuchote : « Regarde ce prompt magique, ça te génère tout le dossier en 12 secondes sans fatigue ! »",
      choices: [
        {
          text: "1. Copier-coller le prompt brut sans relire pour aller boire un verre aux Guillemins.",
          impact: { energy: +10, ethics: -25, competence: -15, ects: 0 },
          feedback: "Votre dossier contient des anachronismes sur les décrets 2013. Le professeur vous convoque pour un rappel à l'ordre."
        },
        {
          text: "2. Utiliser l'IA comme 'sparring-partner' pour tester vos questions et rédiger vous-même la synthèse.",
          impact: { energy: -15, ethics: +15, competence: +20, ects: +12 },
          feedback: "Excellente démarche socratique ! Vous avez mémorisé les principes clés et obtenu la note maximale au contrôle continu."
        },
        {
          text: "3. Refuser catégoriquement tout outil numérique et tout taper manuellement sans assistance.",
          impact: { energy: -35, ethics: +10, competence: +5, ects: +6 },
          feedback: "Démarche respectable mais épuisante. Vous accumulez du retard sur le reste de vos cours."
        }
      ]
    },
    {
      id: "ch2",
      period: "Janvier · Session de Blocus d'Hiver",
      location: "Bibliothèque Universitaire · Salle de Blocus",
      characterName: "Hélène (Conseillère SAR)",
      avatarGradient: "from-emerald-500 to-teal-600",
      avatarEmoji: "👩‍🏫",
      title: "Le Mur de la Mémorisation & Panique Réseau",
      description: "La courbe de l'oubli frappe de plein fouet à 48 heures de l'examen de méthodologie. Des rumeurs de fuites circulent sur TikTok avec un prétendu questionnaire d'examen complet généré par IA. Vous hésitez sur votre méthode de révision finale.",
      choices: [
        {
          text: "1. Abandonner les révisions et mémoriser uniquement le faux questionnaire viral de TikTok.",
          impact: { energy: +5, ethics: -20, competence: -25, ects: 0 },
          feedback: "Le questionnaire était un piège forgé par un bot ! Aucune de ces questions n'était à l'examen. Échec cuisant."
        },
        {
          text: "2. Utiliser un outil IA pour créer des flashcards de réactivation espacée basées sur vos vrais syllabus.",
          impact: { energy: -10, ethics: +15, competence: +25, ects: +18 },
          feedback: "Victoire cognitive ! La répétition active et le double codage vous permettent de valider l'UE avec mention."
        }
      ]
    },
    {
      id: "ch3",
      period: "Mai · Projet de Groupe & TP Transversal",
      location: "Laboratoire Collaboratif · Salle Multimédia",
      characterName: "Léa (Déléguée d'Équipe)",
      avatarGradient: "from-pink-500 to-rose-600",
      avatarEmoji: "👩‍💻",
      title: "Le Dilemme du Passager Clandestin",
      description: "Un membre de votre groupe n'a rien fait pendant 3 semaines et soumet à la dernière minute un chapitre entier manifestement plagié via ChatGPT sans aucune source réelle. Le dépôt officiel sur Moodle est fixé dans 3 heures.",
      choices: [
        {
          text: "1. Laisser passer pour éviter le conflit dans le groupe et espérer que personne ne vérifie.",
          impact: { energy: 0, ethics: -30, competence: -10, ects: 0 },
          feedback: "Le logiciel de détection et le jury repèrent immédiatement la fraude. Tout le groupe est ajourné !"
        },
        {
          text: "2. Organiser une séance d'arbitrage d'urgence, isoler les parties suspectes et obliger le camarade à expliciter ses sources.",
          impact: { energy: -15, ethics: +25, competence: +20, ects: +18 },
          feedback: "Posture exemplaire d'adulte apprenant ! Le jury salue l'intégrité de la démarche collective."
        }
      ]
    },
    {
      id: "ch4",
      period: "Juin · Grand Oral de Délibération",
      location: "Salle des Délibérations · Présidence du Jury",
      characterName: "Prof. Lambert (Président du Jury)",
      avatarGradient: "from-amber-500 to-orange-600",
      avatarEmoji: "👨‍⚖️",
      title: "La Soutenance devant le Jury de Bloc 1",
      description: "Le jury vous demande d'expliciter comment vous avez articulé les outils numériques avec votre propre réflexion tout au long de votre parcours académique à la Haute École.",
      choices: [
        {
          text: "1. Expliquer que l'IA a été un partenaire d'entraînement critique, jamais un substitut de votre pensée.",
          impact: { energy: +10, ethics: +20, competence: +25, ects: +12 },
          feedback: "Triomphe académique ! 60 crédits ECTS définitivement acquis avec les félicitations unanimes."
        }
      ]
    }
  ];

  const currentChapter = CHAPTERS[currentChapterIdx];

  // Keyboard shortcut listener for options [1], [2], [3]
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (isGameOver || isVictory || showBriefing) return;
      if (['1', '2', '3'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (currentChapter.choices[idx]) {
          handleChoice(currentChapter.choices[idx]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentChapter, isGameOver, isVictory, showBriefing, stats]);

  const handleChoice = (choice) => {
    sounds.playPop();

    const newStats = {
      energy: Math.max(0, Math.min(100, stats.energy + choice.impact.energy)),
      ethics: Math.max(0, Math.min(100, stats.ethics + choice.impact.ethics)),
      competence: Math.max(0, Math.min(100, stats.competence + choice.impact.competence)),
      ects: Math.min(60, stats.ects + choice.impact.ects)
    };

    setStats(newStats);
    setHistoryLog(prev => [{ chapter: currentChapter.title, feedback: choice.feedback }, ...prev]);

    // Check GameOver
    if (newStats.ethics <= 20) {
      sounds.playBuzzer();
      sounds.playGroan();
      setIsGameOver(true);
      return;
    }

    if (currentChapterIdx + 1 < CHAPTERS.length) {
      sounds.playSuccess();
      setCurrentChapterIdx(prev => prev + 1);
    } else {
      sounds.playSuccess();
      setIsVictory(true);
      if (onComplete) {
        setTimeout(onComplete, 2200);
      }
    }
  };

  return (
    <div className="w-full h-full min-h-[540px] rounded-3xl bg-[#031b14] border-2 border-emerald-500/40 shadow-2xl flex flex-col font-['Lexend'] text-white overflow-hidden animate-in fade-in select-none">
      
      {/* Top Status & Gauges Bar */}
      <div className="h-14 bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/60 px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
              VISUAL NOVEL ACADÉMIQUE · HECH 2026
            </span>
            <strong className="font-['Outfit'] font-black text-sm text-emerald-100">
              Le Guide du Survivant Connecté (Bloc 1)
            </strong>
          </div>
        </div>

        {/* 4 Survivant Gauges */}
        <div className="flex items-center gap-3 text-xs font-mono">
          {/* Bouton Briefing Officiel d'Aurore (Scénario & Règles) */}
          <button
            onClick={() => {
              sounds.playPop();
              setShowBriefing(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-xs font-mono font-bold text-cyan-200 transition cursor-pointer shadow-md"
            title="Briefing d'Aurore : Scénario, Enjeu & Règles"
          >
            <span>ℹ️</span>
            <span className="hidden sm:inline">Briefing Aurore</span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <Heart className={`w-3.5 h-3.5 ${stats.energy < 30 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <span className="text-slate-300 font-bold">{stats.energy}%</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <Sparkles className={`w-3.5 h-3.5 ${stats.ethics < 35 ? 'text-amber-500 animate-pulse' : 'text-cyan-400'}`} />
            <span className="text-slate-300 font-bold">{stats.ethics}%</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-300 font-bold">{stats.competence}%</span>
          </div>

          <div className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-bold">
            {stats.ects} / 60 ECTS
          </div>
        </div>
      </div>

      {/* Main Visual Novel Narrative Screen */}
      <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto max-w-4xl mx-auto w-full gap-4">
        
        {!isGameOver && !isVictory ? (
          <>
            {/* Visual Scene Card with Character Dialogue */}
            <div className="p-6 rounded-3xl bg-slate-950/90 border border-emerald-500/40 shadow-2xl space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <Compass className="w-4 h-4 text-emerald-400" />
                  <span>{currentChapter.location}</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold">
                  {currentChapter.period}
                </span>
              </div>

              {/* Character Avatar & Dialogue */}
              <div className="flex items-start gap-4 pt-1">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${currentChapter.avatarGradient} flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/20 flex-shrink-0 border-2 border-white/20`}>
                  {currentChapter.avatarEmoji}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-['Outfit'] font-black text-xs text-emerald-400 uppercase tracking-wide">
                      {currentChapter.characterName}
                    </span>
                  </div>
                  <h3 className="text-lg font-['Outfit'] font-bold text-white">
                    {currentChapter.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                    « {currentChapter.description} »
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Choices Grid with Stat Badges */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-300 uppercase font-mono flex items-center gap-1.5">
                <ArrowRight className="w-4 h-4" /> Quelle démarche décidez-vous d'adopter ?
              </span>

              {currentChapter.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(c)}
                  className="w-full p-4 rounded-2xl bg-slate-950/80 hover:bg-emerald-950/60 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all duration-300 cursor-pointer shadow-lg hover:scale-[1.01] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <span className="text-xs sm:text-sm text-slate-200 group-hover:text-white leading-relaxed">
                    {c.text}
                  </span>
                  
                  {/* Impact preview pill */}
                  <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0 text-[10px] font-mono">
                    {c.impact.ects > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        +{c.impact.ects} ECTS
                      </span>
                    )}
                    {c.impact.ethics > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                        +{c.impact.ethics}% Éthique
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {c.impact.ethics}% Éthique
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : isGameOver ? (
          /* Game Over Screen */
          <div className="my-auto p-6 rounded-3xl bg-slate-950/95 border-2 border-rose-500 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40 shadow-lg shadow-rose-500/30">
              <Frown className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-['Outfit'] font-black text-rose-200">
              Échec : Ajournement par le Jury d'Éthique
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Votre jauge d'intégrité est tombée trop bas. La délégation aveugle de vos travaux aux modèles génératifs a détruit votre capacité d'apprentissage critique.
            </p>
            <button
              onClick={() => {
                setStats({ energy: 80, ethics: 75, competence: 50, ects: 12 });
                setCurrentChapterIdx(0);
                setIsGameOver(false);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:scale-105 text-white font-bold text-xs uppercase transition shadow-lg cursor-pointer"
            >
              Recommencer l'Année Académique ↺
            </button>
          </div>
        ) : (
          /* Victory Screen */
          <div className="my-auto p-6 rounded-3xl bg-slate-950/95 border-2 border-emerald-400 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto border border-emerald-400/50 shadow-lg shadow-emerald-500/40">
              <GraduationCap className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-['Outfit'] font-black text-emerald-200">
              Félicitations : Diplôme du Bloc 1 Validé !
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
              Vous avez franchi toutes les étapes de l'année en conservant une posture éthique et éclairée. Les 60 crédits ECTS sont validés avec mention.
            </p>
            <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold max-w-sm mx-auto">
              🏆 CLÉ GAMMA (SOBRIÉTÉ & RGPD) ACQUISE
            </div>
            {onComplete && (
              <button
                onClick={onComplete}
                className="mt-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black font-['Outfit'] text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-500/30 cursor-pointer"
              >
                Continuer l'Escape Game →
              </button>
            )}
          </div>
        )}

        {/* History Log Snippets */}
        {historyLog.length > 0 && !isGameOver && !isVictory && (
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] font-sans text-slate-400">
            <strong className="text-emerald-400 font-mono block text-[10px] uppercase mb-1">
              Dernier retour pédagogique :
            </strong>
            <p className="italic">« {historyLog[0].feedback} »</p>
          </div>
        )}

      </div>

      {/* Briefing Officiel d'Aurore (Scénario de l'Escape Game, Enjeu & Règles) */}
      <AuroreGameBriefingModal
        gameId="survivant"
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
      />
    </div>
  );
}
