with open('src/components/GameTribunal3D.jsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines):
    if 'sounds.playAudioFile(' in l and 'objectionVoice' in l or (i > 195 and i < 215 and 'sounds.playAudioFile' in l):
        lines[i] = "      sounds.playAudioFile(`/audio/voices/${currentCase.objectionVoice}.mp3`, 1.0);\n"
        print(f"Set line {i+1} to template literal")

with open('src/components/GameTribunal3D.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print('Done.')
