import os

# 1. Update GameGrandProcesHacking.jsx
path_hacking = r'C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\src\components\GameGrandProcesHacking.jsx'
with open(path_hacking, 'r', encoding='utf-8') as f:
    c_h = f.read()

old_start_assault = """  const handleStartAssault = () => {
    sounds.stopAllVoice();
    sounds.playCourtroomMurmur(3.5);
    setStage('attack');
    setCameraView('PROSECUTION');
    setProsecutorState('attacking');
    setJudgeReaction('neutral');
    setSelectedArgument(null);
    setIsPleadingConfirmed(false);

    // Le Procureur prononce l'intégralité de son réquisitoire sans AUCUNE interruption
    sounds.playAudioFile(`/audio/voices/${currentAssault.prosecutorVoice}.mp3`, 1.0, false, () => {
      setProsecutorState('idle');

      // Dans l'assaut 1 : C'est SEULEMENT après la fin complète de sa phrase (réclamation d'incarcération ferme)
      // que le public s'insurge dans la salle et que le Juge frappe son marteau pour exiger le silence !
      if (currentAssaultIdx === 0) {
        setAudienceState('shout_maxime');
        setAudienceShoutText('Public : « Scandale ! Parodie de justice ! Libérez Maxime ! »');
        setCameraView('AUDIENCE');
        sounds.playVoice('proces_public_chahut_poly', () => {
          setCameraView('JUDGE');
          setJudgeState('gavel');
          setAudienceState('idle');
          setAudienceShoutText('Juge : « Silence ! Ou je fais évacuer la salle ! »');
          sounds.playJudgeSilence();
          setTimeout(() => {
            setAudienceShoutText('');
            setCameraView('TV_WIDE');
            setJudgeState('idle');
          }, 4500);
        });
      } else {
        setCameraView('TV_WIDE');
      }
    });
  };"""

new_start_assault = """  const handleStartAssault = () => {
    sounds.stopAllVoice();
    sounds.playCourtroomMurmur(2.5);
    setStage('attack');
    setSelectedArgument(null);
    setIsPleadingConfirmed(false);
    setJudgeReaction('neutral');

    if (currentAssaultIdx === 0) {
      // 1. LE JUGE OUVRE SOLENNELLEMENT L'AUDIENCE ET DONNE LA PAROLE AU PROCUREUR
      setCameraView('JUDGE');
      setJudgeState('gavel');
      sounds.playGavelStrike();

      setTimeout(() => {
        setJudgeState('speaking');
        sounds.playAudioFile('/audio/voices/proces_judge_intro_blackout.mp3', 1.0, false, () => {
          setJudgeState('idle');
          // 2. LE PROCUREUR PREND LA PAROLE POUR L'ACCUSATION
          setCameraView('PROSECUTION');
          setProsecutorState('attacking');
          sounds.playAudioFile(`/audio/voices/${currentAssault.prosecutorVoice}.mp3`, 1.0, false, () => {
            setProsecutorState('idle');
            // 3. LE PUBLIC S'INSURGE PUIS LE JUGE EXIGE LE SILENCE
            setAudienceState('shout_maxime');
            setAudienceShoutText('Public : « Scandale ! Parodie de justice ! Libérez Maxime ! »');
            setCameraView('AUDIENCE');
            sounds.playVoice('proces_public_chahut_poly', () => {
              setCameraView('JUDGE');
              setJudgeState('gavel');
              setAudienceState('idle');
              setAudienceShoutText('Juge : « Silence ! Ou je fais évacuer la salle ! »');
              sounds.playJudgeSilence();
              setTimeout(() => {
                setAudienceShoutText('');
                // 4. LE JUGE DONNE LA PAROLE À LA DÉFENSE
                setJudgeState('speaking');
                sounds.playAudioFile('/audio/voices/proces_judge_call_defense.mp3', 1.0, false, () => {
                  setJudgeState('idle');
                  setCameraView('TV_WIDE');
                });
              }, 4000);
            });
          });
        });
      }, 900);
    } else {
      setCameraView('PROSECUTION');
      setProsecutorState('attacking');
      sounds.playAudioFile(`/audio/voices/${currentAssault.prosecutorVoice}.mp3`, 1.0, false, () => {
        setProsecutorState('idle');
        setCameraView('TV_WIDE');
      });
    }
  };"""

c_h = c_h.replace(old_start_assault.replace('\n', '\r\n'), new_start_assault.replace('\n', '\r\n'))
c_h = c_h.replace(old_start_assault, new_start_assault)

with open(path_hacking, 'w', encoding='utf-8') as f:
    f.write(c_h)
print("Updated GameGrandProcesHacking.jsx with Judge opening & defense calls!")

# 2. Update GameTribunal3D.jsx
path_tribunal = r'C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\src\components\GameTribunal3D.jsx'
with open(path_tribunal, 'r', encoding='utf-8') as f:
    c_t = f.read()

old_statement_effect = """  // Lancement de la voix au changement d'étape
  useEffect(() => {
    if (trialStage === 'statement') {
      setWitnessState('speaking');
      setCameraView('WITNESS');
      sounds.playAudioFile(`/audio/voices/${currentCase.statementVoice}.mp3`, 1.0);
    }
  }, [currentCaseIdx, trialStage]);"""

new_statement_effect = """  // Lancement de la voix : Le Juge introduit chaque affaire avant le témoin
  useEffect(() => {
    if (trialStage === 'statement') {
      const caseJudgeVoiceMap = [
        '/audio/voices/tribunal_judge_case1_intro.mp3',
        '/audio/voices/tribunal_judge_case2_intro.mp3',
        '/audio/voices/tribunal_judge_case3_intro.mp3'
      ];
      const judgeVoice = caseJudgeVoiceMap[currentCaseIdx] || caseJudgeVoiceMap[0];

      // Le Juge ouvre les débats de l'affaire
      setCameraView('JUDGE');
      setJudgeState('speaking');
      sounds.playAudioFile(judgeVoice, 1.0, false, () => {
        setJudgeState('idle');
        // Puis le témoin dépose à la barre
        setCameraView('WITNESS');
        setWitnessState('speaking');
        sounds.playAudioFile(`/audio/voices/${currentCase.statementVoice}.mp3`, 1.0);
      });
    }
  }, [currentCaseIdx, trialStage]);"""

c_t = c_t.replace(old_statement_effect.replace('\n', '\r\n'), new_statement_effect.replace('\n', '\r\n'))
c_t = c_t.replace(old_statement_effect, new_statement_effect)

old_objection = """  // Déclenchement de l'OBJECTION !
  const handleTriggerObjection = () => {
    sounds.playObjectionImpact();
    setObjectionTriggered(true);
    setWitnessState('stressed');
    setCameraView('JUDGE');

    setTimeout(() => {
      setCameraView('WITNESS');
      setWitnessState('broken');
      sounds.playAudioFile(`/audio/voices/${currentCase.objectionVoice}.mp3`, 1.0);
    }, 1200);
  };"""

new_objection = """  // Déclenchement de l'OBJECTION !
  const handleTriggerObjection = () => {
    sounds.playObjectionImpact();
    setObjectionTriggered(true);
    setWitnessState('stressed');
    setCameraView('JUDGE');
    setJudgeState('speaking');

    // Le Juge intervient vocalement pour retenir l'objection
    sounds.playAudioFile('/audio/voices/tribunal_judge_objection_call.mp3', 1.0, false, () => {
      setJudgeState('idle');
      setCameraView('WITNESS');
      setWitnessState('broken');
      sounds.playAudioFile(`/audio/voices/${currentCase.objectionVoice}.mp3`, 1.0);
    });
  };"""

c_t = c_t.replace(old_objection.replace('\n', '\r\n'), new_objection.replace('\n', '\r\n'))
c_t = c_t.replace(old_objection, new_objection)

with open(path_tribunal, 'w', encoding='utf-8') as f:
    f.write(c_t)
print("Updated GameTribunal3D.jsx with Judge case introductions and objection responses!")
