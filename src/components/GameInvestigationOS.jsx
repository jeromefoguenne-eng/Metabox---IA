import React, { useState } from 'react';
import { 
  FileSearch, 
  Mail, 
  Radio, 
  Send, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Clock, 
  Search, 
  ExternalLink,
  Smartphone,
  Cpu,
  Layers,
  Terminal,
  Activity,
  ScanLine
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GameInvestigationOS:
 * Point & Click / Cyber-Détective OS simulé (La Rédaction Fantôme).
 * L'étudiant est stagiaire au média d'investigation étudiant et doit publier
 * l'édition du jour en traquant les deepfakes, les fermes de bots et en protégeant les sources.
 * 
 * Graphismes Haute Définition : Fenêtres frosted glass, analyseur spectral de deepfakes, EXIF inspector.
 */
export default function GameInvestigationOS({ onComplete }) {
  const [activeWindow, setActiveWindow] = useState('inbox'); // 'inbox' | 'social_feed' | 'image_analyzer'
  const [selectedMail, setSelectedMail] = useState(0);
  
  // Investigation Clues State
  const [analyzedDeepfake, setAnalyzedDeepfake] = useState(false);
  const [identifiedBotFarm, setIdentifiedBotFarm] = useState(false);
  const [securedSource, setSecuredSource] = useState(false);
  const [zoomCoords, setZoomCoords] = useState(null);
  const [activeFilter, setActiveFilter] = useState('rgb'); // 'rgb' | 'noise' | 'spectral'

  // Emails in Simulated OS
  const EMAILS = [
    {
      id: 'm1',
      sender: 'source_anonyme@protonmail.ch',
      subject: 'URGENT : Fuite photographique compromettante (Campus Rivageois)',
      preview: 'Un cliché circule montrant le Doyen dans une négociation secrète...',
      content: `Bonjour la rédaction,
Un cadre administratif m'a transmis une photo compromettante prise dans les bureaux du Quai de Rome.
Attention : la direction prétend qu'il s'agit d'une réunion officielle, mais plusieurs signaux indiquent que l'image a été entièrement générée par Midjourney v6 pour créer un scandale artificiel avant les élections du conseil étudiant.
Veuillez inspecter l'image ci-jointe dans votre logiciel d'analyse spectrale avant toute diffusion publique !`,
      hasAttachment: true,
      attachmentName: 'photo_fuite_reunion_recteur.png'
    },
    {
      id: 'm2',
      sender: 'sar_contact@he-charlemagne.be',
      subject: 'Alerte Phishing & Scraping IA non autorisé sur Moodle',
      preview: 'Des fermes de scrapers automatisés aspirent actuellement les mémoires déposés...',
      content: `Chers étudiants journalistes,
Nous constatons une tentative d'aspiration automatisée des données nominatives d'étudiants par une entreprise tierce utilisant des bots pour entraîner des modèles commerciaux.
Activez sans délai le protocole de chiffrement PGP et sécurisez l'accès à vos sources confidentielles dans votre boîte de messagerie !`,
      hasSecurityAction: true
    }
  ];

  // Social Feed Posts
  const SOCIAL_POSTS = [
    {
      id: 'p1',
      author: '@HECh_Insider_9921',
      handle: 'Compte créé il y a 2 jours · 14 200 retweets automatisés',
      text: "SCOOP : La direction de la Haute École va supprimer 50% des diplômes de bachelier dès septembre 2026 ! Tous dans la rue demain matin à 8h !",
      isBotFarm: true,
      flags: [
        'Syntaxe générative répétée 400 fois par minute par 85 comptes dormants',
        'Avatars de profil générés par StyleGAN (yeux parfaitement alignés au centre)',
        'Aucune source universitaire primaire citée, liens de redirection opaques'
      ]
    },
    {
      id: 'p2',
      author: '@Conseil_Etudiants_HECh',
      handle: 'Compte Officiel Vérifié · Campus Rivageois',
      text: "Rappel à tous : la séance d'information sur les parcours allégés et le Décret Paysage aura lieu jeudi à l'amphithéâtre Rivageois à 12h30.",
      isBotFarm: false
    }
  ];

  const allTasksDone = analyzedDeepfake && identifiedBotFarm && securedSource;

  return (
    <div className="w-full h-full min-h-[540px] rounded-3xl bg-[#070d18] border-2 border-cyan-500/40 shadow-2xl flex flex-col font-['Lexend'] text-white overflow-hidden animate-in fade-in select-none">
      
      {/* OS Desktop Window Header Bar */}
      <div className="h-12 bg-slate-950/90 backdrop-blur-md border-b border-cyan-900/60 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          </div>
          <span className="text-xs font-mono text-cyan-300 font-bold ml-2 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>Cyber-Desk OS v4.1 · Rédaction Fantôme HECh</span>
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400 hidden sm:inline">Preuves Réunies :</span>
          <div className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-amber-300 font-bold">
            {[analyzedDeepfake, identifiedBotFarm, securedSource].filter(Boolean).length} / 3 Validées
          </div>
        </div>
      </div>

      {/* Main OS Workspace: Left Taskbar + Central Window */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left App Switcher Bar */}
        <div className="md:col-span-3 bg-slate-950/95 border-r border-slate-800 p-3.5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 block">
              POSTES D'INVESTIGATION
            </span>

            <button
              onClick={() => { sounds.playPop(); setActiveWindow('inbox'); }}
              className={`w-full p-3 rounded-2xl border text-left text-xs flex items-center justify-between transition cursor-pointer ${
                activeWindow === 'inbox' 
                  ? 'bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span className="font-semibold">Messagerie Source</span>
              </div>
              {securedSource && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => { sounds.playPop(); setActiveWindow('image_analyzer'); }}
              className={`w-full p-3 rounded-2xl border text-left text-xs flex items-center justify-between transition cursor-pointer ${
                activeWindow === 'image_analyzer' 
                  ? 'bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">Inspecteur Deepfake</span>
              </div>
              {analyzedDeepfake && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              onClick={() => { sounds.playPop(); setActiveWindow('social_feed'); }}
              className={`w-full p-3 rounded-2xl border text-left text-xs flex items-center justify-between transition cursor-pointer ${
                activeWindow === 'social_feed' 
                  ? 'bg-gradient-to-r from-pink-900/40 to-rose-900/40 border-pink-400 text-white shadow-lg shadow-pink-500/20' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-850'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span className="font-semibold">Radar de Bots Viraux</span>
              </div>
              {identifiedBotFarm && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Validation Final Button */}
          <div className="pt-3 border-t border-slate-800">
            <button
              disabled={!allTasksDone}
              onClick={() => {
                sounds.playSuccess();
                if (onComplete) onComplete();
              }}
              className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wide transition shadow-lg flex items-center justify-center gap-2 ${
                allTasksDone 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02] text-slate-950 cursor-pointer animate-bounce shadow-emerald-500/30' 
                  : 'bg-slate-900 text-slate-500 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{allTasksDone ? "Publier l'Édition & Récupérer la Clé Alpha" : "3 Preuves Requises"}</span>
            </button>
          </div>
        </div>

        {/* Right Active App Area */}
        <div className="md:col-span-9 p-5 bg-slate-900/60 overflow-y-auto">
          
          {/* WINDOW 1: MESSAGERIE & SOURCE CHIFFRÉE */}
          {activeWindow === 'inbox' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs">
                <strong className="text-cyan-300 flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Boîte Confidentielle Sécurisée (ProtonMail HECh)
                </strong>
                <span className="text-[11px] font-mono text-slate-400">Chiffrement End-to-End</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMAILS.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => { sounds.playPop(); setSelectedMail(idx); }}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                      selectedMail === idx 
                        ? 'bg-slate-850 border-cyan-400 shadow-md' 
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                      <span>{m.sender}</span>
                      {m.hasAttachment && <span className="text-cyan-400">📎 Photo EXIF</span>}
                    </div>
                    <strong className="text-xs text-white block truncate">{m.subject}</strong>
                    <p className="text-[11px] text-slate-400 truncate mt-1">{m.preview}</p>
                  </button>
                ))}
              </div>

              {/* Selected Email Reader */}
              <div className="p-5 rounded-3xl bg-slate-950/90 border border-slate-800 space-y-3.5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white font-['Outfit']">{EMAILS[selectedMail].subject}</h4>
                    <span className="text-xs text-slate-400 font-mono">Expéditeur : {EMAILS[selectedMail].sender}</span>
                  </div>
                  {EMAILS[selectedMail].hasAttachment && (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setActiveWindow('image_analyzer');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-400/50 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                    >
                      <Eye className="w-3.5 h-3.5" /> Ouvrir dans l'Inspecteur 3D →
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                  {EMAILS[selectedMail].content}
                </p>

                {EMAILS[selectedMail].hasSecurityAction && !securedSource && (
                  <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-xs text-amber-200">
                      ⚠️ Alerte : Le tunnel de transmission des mémoires est vulnérable aux scrapers IA !
                    </span>
                    <button
                      onClick={() => {
                        sounds.playSuccess();
                        setSecuredSource(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1.5 shadow-md"
                    >
                      <Lock className="w-3.5 h-3.5" /> Activer Clé PGP 4096-bit
                    </button>
                  </div>
                )}

                {securedSource && EMAILS[selectedMail].hasSecurityAction && (
                  <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Protocole de chiffrement PGP validé. L'informateur et les mémoires d'étudiants sont sécurisés !</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WINDOW 2: IMAGE ARTIFACTS ANALYZER (DEEPFAKE FORENSIC INSPECTOR) */}
          {activeWindow === 'image_analyzer' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <strong className="text-indigo-300 flex items-center gap-2">
                  <Eye className="w-4 h-4" /> Laboratoire de Forensique Visuelle & Spectre Fréquentiel
                </strong>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveFilter('rgb')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${activeFilter === 'rgb' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    RGB Naturel
                  </button>
                  <button 
                    onClick={() => setActiveFilter('noise')}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold cursor-pointer transition ${activeFilter === 'noise' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                  >
                    Bruit de Diffusion (FFT)
                  </button>
                </div>
              </div>

              {/* Simulated Deepfake Visual Box */}
              <div className="relative w-full rounded-3xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
                
                {/* Visual Target Area */}
                <div className="relative h-64 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/60 flex items-center justify-center overflow-hidden">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-30" />
                  
                  <div className="relative text-center space-y-3 z-10">
                    <div 
                      onClick={() => {
                        sounds.playPop();
                        setZoomCoords('hands_and_eyes');
                      }}
                      className="w-28 h-28 rounded-full bg-slate-850 border-2 border-amber-400/80 mx-auto flex items-center justify-center relative cursor-pointer group shadow-2xl hover:scale-105 transition"
                    >
                      <span className="text-4xl">🧑‍💼</span>
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-rose-500 animate-spin" style={{ animationDuration: '10s' }} />
                      <span className="absolute -bottom-2 bg-rose-600 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full text-white shadow">
                        Cible Suspecte (Zoom 400%)
                      </span>
                    </div>

                    <div>
                      <span className="text-xs text-slate-200 font-bold block font-['Outfit']">
                        Cliché Réunion Secrète · Quai de Rome
                      </span>
                      <span className="text-[11px] text-cyan-400 font-mono">
                        Cliquez sur le portrait pour lancer l'analyse des artefacts
                      </span>
                    </div>
                  </div>
                </div>

                {/* Spectral Scan Overlay Results */}
                {zoomCoords && (
                  <div className="mt-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/50 space-y-3 text-xs animate-in zoom-in-95">
                    <div className="flex justify-between items-center text-amber-300 font-bold">
                      <span className="flex items-center gap-1.5">
                        <ScanLine className="w-4 h-4 text-amber-400" /> Rapport Forensique des Anomalies :
                      </span>
                      <span className="font-mono text-rose-400 font-bold bg-rose-950/50 px-2 py-0.5 rounded border border-rose-900">
                        Score de Falsification IA : 99.1%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-sans">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <strong className="text-rose-400 block mb-0.5">Mains & Phalanges</strong>
                        <p className="text-slate-300">6 doigts distincts fusionnés sur la main droite tenant le dossier.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <strong className="text-rose-400 block mb-0.5">Reflets Oculaires</strong>
                        <p className="text-slate-300">Reflets des fenêtres orientés à 45° dans l'œil gauche et 180° dans l'œil droit.</p>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <strong className="text-rose-400 block mb-0.5">Métadonnées EXIF</strong>
                        <p className="text-slate-300">Généré par Midjourney v6 (Prompt: "secret university rector deal, 8k, cinematic").</p>
                      </div>
                    </div>

                    {!analyzedDeepfake ? (
                      <button
                        onClick={() => {
                          sounds.playSuccess();
                          setAnalyzedDeepfake(true);
                        }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 font-bold text-xs text-white uppercase tracking-wider transition shadow-lg cursor-pointer"
                      >
                        Classifier Officiellement comme « Deepfake Généré » →
                      </button>
                    ) : (
                      <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs font-bold font-mono text-center border border-emerald-500/40">
                        ✓ Fausse photo neutralisée ! Rapport d'expertise versé au dossier de presse.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WINDOW 3: RADAR SOCIAL & FERMES DE BOTS */}
          {activeWindow === 'social_feed' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <strong className="text-pink-300 flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Radar des Réseaux Sociaux & Traque d'Astroturfing
                </strong>
                <span className="text-[11px] font-mono text-slate-400">Algorithme d'Analyse des Réseaux</span>
              </div>

              <div className="space-y-3">
                {SOCIAL_POSTS.map((post) => (
                  <div 
                    key={post.id}
                    className={`p-4 rounded-3xl border transition shadow-lg ${
                      post.isBotFarm 
                        ? 'bg-rose-950/20 border-rose-500/50' 
                        : 'bg-slate-950/90 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <strong className="text-xs font-bold text-white mr-2">{post.author}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{post.handle}</span>
                      </div>
                      {post.isBotFarm && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/40 font-mono">
                          CAMPAGNE COORDONNÉE
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed mb-3">{post.text}</p>

                    {post.isBotFarm && (
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">
                          Analyse Spectrale des Anomalies :
                        </span>
                        {post.flags.map((f, i) => (
                          <div key={i} className="text-[11px] text-rose-300 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                            <span>{f}</span>
                          </div>
                        ))}

                        {!identifiedBotFarm ? (
                          <button
                            onClick={() => {
                              sounds.playSuccess();
                              setIdentifiedBotFarm(true);
                            }}
                            className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition shadow-md font-mono"
                          >
                            Signaler & Isoler la Ferme de Bots
                          </button>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-300 text-xs font-bold text-center border border-emerald-500/40 font-mono">
                            ✓ Ferme de bots démantelée et signalée au conseil de déontologie !
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
