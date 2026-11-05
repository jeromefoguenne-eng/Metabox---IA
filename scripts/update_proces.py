with open('src/components/GameGrandProcesHacking.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for idx, line in enumerate(lines[:60]):
    if 'showBriefing' in line and 'useState(true)' in line:
        lines[idx] = '  const [showBriefing, setShowBriefing] = useState(false);\n'
        print('Fixed showBriefing in GameGrandProcesHacking at line', idx+1)

for idx, line in enumerate(lines):
    if "setStage('reaction_fail')" in line:
        block = """      setTimeout(() => {
        setStage('reaction_fail');
        setCameraView('JUDGE');
        setJudgeState('speaking');
        // Sécurité : apaiser le Juge après son intervention pour ne pas bloquer la scène
        setTimeout(() => {
          setJudgeState('idle');
          setCameraView('TV_WIDE');
        }, 3200);
      }, 2200);
"""
        start = idx - 1
        end = idx + 4
        lines[start:end] = [block]
        print('Fixed reaction_fail watchdog at line', idx+1)
        break

with open('src/components/GameGrandProcesHacking.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('SUCCESSFULLY UPDATED GameGrandProcesHacking.jsx')
