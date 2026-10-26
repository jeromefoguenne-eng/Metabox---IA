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
  Smartphone
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

/**
 * GameInvestigationOS:
 * Point & Click / Cyber-Détective OS simulé (La Rédaction Fantôme).
 * L'étudiant est stagiaire au média d'investigation étudiant et doit publier
 * l'édition du jour en traquant les deepfakes, les fermes de bots et en protégeant les sources.
 */
export default function GameInvestigationOS({ onComplete }) {
  const [activeWindow, setActiveWindow] = useState('inbox'); // 'inbox' | 'social_feed' | 'image_analyzer' | 'publisher'
  const [selectedMail, setSelectedMail] = useState(0);
  
  // Investigation Clues State
  const [analyzedDeepfake, setAnalyzedDeepfake] = useState(false);
  const [identifiedBotFarm, setIdentifiedBotFarm] = useState(false);
  const [securedSource, setSecuredSource] = useState(false);
  const [zoomCoords, setZoomCoords] = useState(null);

  // Emails in Simulated OS
  const EMAILS = [
    {
      id: 'm1',
      sender: 'source_anonyme@protonmail.ch',
      subject: 'URGENT : Fuite de données sur le campus Rivageois',
      preview: 'Un projet de surveillance biométrique des étudiants est en cours...',
      content: `Bonjour la rédaction,
Un cadre administratif m'a transmis une photo compromettante prise dans les bureaux du Quai de Rome.
Attention : la direction prétend qu'il s'agit d'une réunion officielle, mais certains prétendent que l'image a été entièrement générée par Midjourney pour créer un scandale artificiel avant les élections du conseil étudiant.
Veuillez inspecter l'image ci-jointe dans votre logiciel d'analyse avant toute diffusion publique !`,
      hasAttachment: true,
      attachmentName: 'photo_fuite_reunion_recteur.png'
    },
    {
      id: 'm2',
      sender: 'sar_contact@he-charlemagne.be',
      subject: 'Alerte Phishing & Scraping IA non autorisé',
      preview: 'Des bots aspirent actuellement les mémoires déposés sur Moodle...',
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
      handle: 'Compte créé il y a 2 jours · 14 200 retweets',
      text: "SCOOP : La direction de la Haute École va supprimer 50% des diplômes de bachelier dès septembre 2026 ! Tous dans la rue demain matin à 8h !",
      isBotFarm: true,
      flags: ['Syntaxe générative répétée 400 fois par minute', 'Comptes relais créés le même jour avec avatars IA', 'Aucune source universitaire citée']
    },
    {
      id: 'p2',
      author: '@Conseil_Etudiants_HECh',
      handle: 'Compte Certifié Officiel',
      text: "Rappel à tous : la séance d'information sur les parcours allégés et le Décret Paysage aura lieu jeudi à l'amphithéâtre Rivageois à 12h30.",
      isBotFarm: false
    }
  ];

  const allTasksDone = analyzedDeepfake && identifiedBotFarm && securedSource;

  return (
    <div className="w-full h-full min-h-[520px] rounded-2xl bg-[#0a1120] border-2 border-cyan-500/40 shadow-2xl flex flex-col font-['Lexend'] text-white overflow-hidden animate-in fade-in">
      
      {/* OS Desktop Window Header Bar */}
      <div className="h-10 bg-slate-900 border-b border-cyan-900/60 px-3 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-mono text-cyan-300 font-bold ml-2 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" /> Cyber-Desk OS v3.2 · Rédaction Fantôme
          </span>
        </div>
        
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-slate-400">Progression Enquête : </span>
          <strong className="text-amber-400 font-bold">
            {[analyzedDeepfake, identifiedBotFarm, securedSource].filter(Boolean).length} / 3 Preuves
          </strong>
        </div>
      </div>

      {/* Main OS Workspace: Left Taskbar + Central Window */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        
        {/* Left App Switcher Bar */}
        <div className="md:col-span-3 bg-slate-950/90 border-r border-slate-800 p-3 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2 block mb-1">
              Applications d'Investigation
            </span>

            <button
              onClick={() => { sounds.playPop(); setActiveWindow('inbox'); }}
              className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition cursor-pointer ${
                activeWindow === 'inbox' 
                  ? 'bg-cyan-600/30 border-cyan-500 text-white shadow-md' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Messagerie Source</span>
              </div>
              {securedSource && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={() => { sounds.playPop(); setActiveWindow('image_analyzer'); }}
              className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition cursor-pointer ${
                activeWindow === 'image_analyzer' 
                  ? 'bg-cyan-600/30 border-cyan-500 text-white shadow-md' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>Détecteur d'Artefacts 3D</span>
              </div>
              {analyzedDeepfake && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={() => { sounds.playPop(); setActiveWindow('social_feed'); }}
              className={`w-full p-2.5 rounded-xl border text-left text-xs flex items-center justify-between transition cursor-pointer ${
                activeWindow === 'social_feed' 
                  ? 'bg-cyan-600/30 border-cyan-500 text-white shadow-md' 
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-pink-400" />
                <span>Radar Fermes de Bots</span>
              </div>
              {identifiedBotFarm && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
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
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase transition shadow-lg flex items-center justify-center gap-2 ${
                allTasksDone 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:scale-[1.02] text-slate-950 cursor-pointer animate-bounce' 
                  : 'bg-slate-800/80 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{allTasksDone ? "Publier l'Enquête & Extraire la Clé" : "3 Preuves Requises"}</span>
            </button>
          </div>
        </div>

        {/* Right Active App Area */}
        <div className="md:col-span-9 p-4 bg-slate-900/60 overflow-y-auto">
          
          {/* WINDOW 1: MESSAGERIE & SOURCE CHIFFRÉE */}
          {activeWindow === 'inbox' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <strong className="text-cyan-300 flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> Boîte de réception confidentielle (2 messages)
                </strong>
                <span className="text-[11px] text-slate-400">ProtonMail Crypt · Campus HECh</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMAILS.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => { sounds.playPop(); setSelectedMail(idx); }}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedMail === idx ? 'bg-slate-800 border-cyan-500' : 'bg-slate-950/70 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>{m.sender}</span>
                      {m.hasAttachment && <span className="text-cyan-400">📎 Pièce jointe</span>}
                    </div>
                    <strong className="text-xs text-white block truncate">{m.subject}</strong>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{m.preview}</p>
                  </button>
                ))}
              </div>

              {/* Selected Email Reader */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex justify-between items-start border-b border-slate-800 pb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">{EMAILS[selectedMail].subject}</h4>
                    <span className="text-xs text-slate-400">De : {EMAILS[selectedMail].sender}</span>
                  </div>
                  {EMAILS[selectedMail].hasAttachment && (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setActiveWindow('image_analyzer');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Analyser la photo
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {EMAILS[selectedMail].content}
                </p>

                {EMAILS[selectedMail].hasSecurityAction && !securedSource && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/50 flex items-center justify-between gap-3">
                    <span className="text-xs text-amber-200">
                      ⚠️ Le tunnel de données est exposé aux aspirateurs de données IA tierces !
                    </span>
                    <button
                      onClick={() => {
                        sounds.playSuccess();
                        setSecuredSource(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer flex items-center gap-1"
                    >
                      <Lock className="w-3.5 h-3.5" /> Chiffrer la Source PGP
                    </button>
                  </div>
                )}

                {securedSource && EMAILS[selectedMail].hasSecurityAction && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Clé de chiffrement PGP 4096-bit active. Données de l'informateur protégées !</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* WINDOW 2: IMAGE ARTIFACTS ANALYZER (DEEPFAKE INSPECTOR) */}
          {activeWindow === 'image_analyzer' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                <strong className="text-indigo-300 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" /> Laboratoire de Détection d'Anomalies Visuelles (Deepfake)
                </strong>
                <span className="text-[11px] text-slate-400">Modèle de diffusion synthétique suspecté</span>
              </div>

              {/* Simulated Deepfake Canvas Box */}
              <div className="relative w-full aspect-[16/9] rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950 border border-slate-700 p-4 flex flex-col justify-between overflow-hidden shadow-inner">
                {/* Visual Fake Artifact Simulation Area */}
                <div className="relative flex-1 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-amber-400 mx-auto flex items-center justify-center relative cursor-pointer group"
                      onClick={() => {
                        sounds.playPop();
                        setZoomCoords('hands_and_eyes');
                      }}
                    >
                      <span className="text-3xl">👤</span>
                      <div className="absolute inset-0 rounded-full border-2 border-dashed border-rose-500 animate-spin" style={{ animationDuration: '8s' }} />
                      <span className="absolute -bottom-2 bg-rose-600 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-white">
                        Zone Suspecte
                      </span>
                    </div>
                    <span className="text-xs text-slate-300 font-bold block">
                      Portrait du Doyen en réunion secrète (Quai de Rome)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Cliquez sur la zone pour activer la loupe spectrale à 400%
                    </span>
                  </div>
                </div>

                {/* Spectral Scan Overlay Results */}
                {zoomCoords && (
                  <div className="p-3 rounded-xl bg-slate-950/90 border border-amber-500/50 space-y-2 text-xs animate-in zoom-in-95">
                    <div className="flex justify-between items-center text-amber-300 font-bold">
                      <span>🔍 Rapport d'Analyse d'Anomalies Révélées :</span>
                      <span className="font-mono text-[10px] text-rose-400">Indice de Falsification : 98.4%</span>
                    </div>
                    <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                      <li><strong>Mains & Doigts</strong> : Fusion incohérente (6 phalanges visibles sur la main droite).</li>
                      <li><strong>Reflets dans les Yeux</strong> : Sources lumineuses divergentes (incohérence optique).</li>
                      <li><strong>Texture de peau</strong> : Absence totale de pores naturels (lissage plastique typique de Midjourney v5).</li>
                    </ul>

                    {!analyzedDeepfake ? (
                      <button
                        onClick={() => {
                          sounds.playSuccess();
                          setAnalyzedDeepfake(true);
                        }}
                        className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 font-bold text-xs text-white uppercase transition shadow-md cursor-pointer"
                      >
                        Classifier Officiellement comme « Deepfake Généré »
                      </button>
                    ) : (
                      <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-300 text-xs font-bold text-center">
                        ✓ Fausse photo neutralisée ! Rapport d'expertise versé au dossier.
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
                <strong className="text-pink-300 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> Flux Réseaux Sociaux & Traque des Bots Viraux
                </strong>
                <span className="text-[11px] text-slate-400">Détection d'astroturfing coordonné</span>
              </div>

              <div className="space-y-3">
                {SOCIAL_POSTS.map((post) => (
                  <div 
                    key={post.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      post.isBotFarm 
                        ? 'bg-rose-950/20 border-rose-500/40' 
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1.5">
                      <div>
                        <strong className="text-xs font-bold text-white mr-2">{post.author}</strong>
                        <span className="text-[10px] text-slate-400 font-mono">{post.handle}</span>
                      </div>
                      {post.isBotFarm && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                          Alerte Désinformation
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-200 leading-snug mb-2">{post.text}</p>

                    {post.isBotFarm && (
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Signaux d'activité artificielle détectés :</span>
                        {post.flags.map((f, i) => (
                          <div key={i} className="text-[11px] text-rose-300 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            <span>{f}</span>
                          </div>
                        ))}

                        {!identifiedBotFarm ? (
                          <button
                            onClick={() => {
                              sounds.playSuccess();
                              setIdentifiedBotFarm(true);
                            }}
                            className="mt-2 w-full py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs uppercase cursor-pointer transition shadow-md"
                          >
                            Signaler & Démanteler la Campagne de Bots
                          </button>
                        ) : (
                          <div className="p-2 rounded-lg bg-emerald-950/80 text-emerald-300 text-xs font-bold text-center">
                            ✓ Ferme de bots isolée et signalée au conseil de déontologie !
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
