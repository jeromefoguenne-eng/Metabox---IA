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
  ShieldCheck
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GameSurvivantNovel:
 * Visual Novel / Jeu de Survie Académique (« HECh 2026 : Le Guide du Survivant Connecté »).
 * Fiction interactive à embranchements avec jauges d'énergie, éthique, réputation et ECTS
 * couvrant une année d'études complète (Septembre à Juin).
 */
export default function GameSurvivantNovel({ onComplete }) {
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  
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
      title: "La Tentation de la Synthèse Automatique",
      description: "Vous devez rendre une fiche de synthèse de 3 pages sur le Décret Paysage pour vendredi. Un camarade vous propose un prompt 'magique' qui génère tout le dossier en 12 secondes sans fatigue.",
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
          text: "3. Refuser catégoriquement tout outil numérique et tout taper à la machine à écrire.",
          impact: { energy: -35, ethics: +10, competence: +5, ects: +6 },
          feedback: "Démarche respectable mais épuisante. Vous accumulez du retard sur le reste de vos cours."
        }
      ]
    },
    {
      id: "ch2",
      period: "Janvier · Session de Blocus d'Hiver",
      title: "Le Mur de la Mémorisation & Panique Réseau",
      description: "La courbe de l'oubli frappe de plein fouet à 48 heures de l'examen de méthodologie. Des rumeurs de fuites circulent sur TikTok avec un prétendu questionnaire d'examen complet généré par IA.",
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
      title: "Le Dilemme du Passager Clandestin",
      description: "Un membre de votre groupe n'a rien fait pendant 3 semaines et soumet à la dernière minute un chapitre entier manifestement plagié via ChatGPT sans aucune source réelle.",
      choices: [
        {
          text: "1. Laisser passer pour éviter le conflit dans le groupe.",
          impact: { energy: 0, ethics: -30, competence: -10, ects: 0 },
          feedback: "Le logiciel de détection et le jury repèrent immédiatement la fraude. Tout le groupe est ajourné !"
        },
        {
          text: "2. Organiser une séance d'arbitrage, isoler les parties suspectes et obliger le camarade à expliciter ses sources.",
          impact: { energy: -15, ethics: +25, competence: +20, ects: +18 },
          feedback: "Posture exemplaire d'adulte apprenant ! Le jury salue l'intégrité de la démarche collective."
        }
      ]
    },
    {
      id: "ch4",
      period: "Juin · Grand Oral de Délibération",
      title: "La Soutenance devant le Jury de Bloc 1",
      description: "Le jury vous demande d'expliciter comment vous avez articulé les outils numériques avec votre propre réflexion tout au long de votre parcours académique.",
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
    <div className="w-full h-full min-h-[520px] rounded-2xl bg-[#031f18] border-2 border-emerald-500/50 shadow-2xl flex flex-col font-['Lexend'] text-white overflow-hidden animate-in fade-in">
      
      {/* Top Status & Gauges Bar */}
      <div className="h-14 bg-slate-950 border-b border-emerald-900/60 px-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <strong className="font-['Outfit'] font-black text-xs sm:text-sm text-emerald-300 uppercase tracking-wide">
            LE GUIDE DU SURVIVANT CONNECTÉ (BAC 1 HECh)
          </strong>
        </div>

        {/* 4 Survivant Gauges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Heart className={`w-3.5 h-3.5 ${stats.energy < 30 ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <span>Énergie : {stats.energy}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles className={`w-3.5 h-3.5 ${stats.ethics < 35 ? 'text-amber-500 animate-pulse' : 'text-cyan-400'}`} />
            <span>Éthique : {stats.ethics}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-purple-400" />
            <span>Compétence : {stats.competence}%</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-500/50 text-amber-300 font-bold">
            {stats.ects} / 60 ECTS
          </div>
        </div>
      </div>

      {/* Main Visual Novel Narrative Screen */}
      <div className="flex-1 p-5 sm:p-7 flex flex-col justify-between overflow-y-auto max-w-4xl mx-auto w-full space-y-4">
        
        {!isGameOver && !isVictory ? (
          <>
            {/* Story Card */}
            <div className="p-5 rounded-3xl bg-slate-950/80 border border-emerald-500/40 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                  {currentChapter.period}
                </span>
                <span className="text-xs text-slate-400 font-mono">Chapitre {currentChapterIdx + 1} / {CHAPTERS.length}</span>
              </div>

              <h3 className="text-xl font-['Outfit'] font-bold text-white">
                {currentChapter.title}
              </h3>

              <p className="text-sm text-slate-200 leading-relaxed font-serif">
                « {currentChapter.description} »
              </p>
            </div>

            {/* Interactive Choices Grid */}
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-emerald-300 uppercase font-mono block">
                Que décidez-vous de faire ?
              </span>

              {currentChapter.choices.map((c, i) => (
                <button
                  key={i}
                  onClick={() => handleChoice(c)}
                  className="w-full p-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 hover:border-emerald-400 text-left text-xs sm:text-sm text-slate-200 transition-all duration-200 cursor-pointer shadow-md hover:scale-[1.01]"
                >
                  {c.text}
                </button>
              ))}
            </div>

            {/* Feedback History Log */}
            {historyLog.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 font-mono">
                <strong className="text-emerald-400 block mb-0.5">Dernier résultat :</strong>
                {historyLog[0].feedback}
              </div>
            )}
          </>
        ) : isGameOver ? (
          <div className="my-auto text-center space-y-4 animate-in zoom-in-95">
            <Frown className="w-16 h-16 text-rose-500 mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Conseil de Discipline : Échec Académique</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Votre jauge d'éthique est tombée trop bas. L'accumulation de raccourcis faciles et de délégation aveugle a annulé votre session.
            </p>
            <button
              onClick={() => {
                setStats({ energy: 80, ethics: 75, competence: 50, ects: 12 });
                setCurrentChapterIdx(0);
                setIsGameOver(false);
                setHistoryLog([]);
              }}
              className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase"
            >
              Recommencer l'Année Académique
            </button>
          </div>
        ) : (
          <div className="my-auto text-center space-y-4 animate-in zoom-in-95">
            <ShieldCheck className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Survivant Connecté d'Excellence !</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              Vous avez traversé l'année en utilisant le numérique comme catalyseur d'autonomie sans jamais brader votre esprit critique.
            </p>
            <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500 text-xs font-mono font-bold text-emerald-300">
              CLÉ GAMMA (SOBRIÉTÉ & MÉTHODE ACADÉMIQUE) DÉBLOQUÉE !
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
