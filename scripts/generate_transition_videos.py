import subprocess
import os

OUT_DIR = os.path.join("public", "video", "transitions")
os.makedirs(OUT_DIR, exist_ok=True)

TRANSITIONS = [
    {
        "filename": "trans_investigation_os.mp4",
        "tag": "CYBER-DETECTIVE - OS INVESTIGATION",
        "title": "AILE NORD - QUAI DE ROME",
        "subtitle": "DEEPFAKE ET VERITE - LA REDACTION FANTOME",
        "color": "0x0284c7"
    },
    {
        "filename": "trans_tribunal_2030.mp4",
        "tag": "SIMULATEUR DE PROCES CONTRADICTOIRE",
        "title": "AILE OUEST - RUE DES RIVAGEOIS",
        "subtitle": "PROCES 2030 - L IA A LA BARRE",
        "color": "0x7c3aed"
    },
    {
        "filename": "trans_survivant_novel.mp4",
        "tag": "VISUAL NOVEL - SURVIE ACADEMIQUE",
        "title": "AILE SUD - FAILLE VITREE ET SOUS-SOLS",
        "subtitle": "HECH 2026 - LE GUIDE DU SURVIVANT CONNECTE",
        "color": "0x059669"
    },
    {
        "filename": "trans_prompt_wars.mp4",
        "tag": "JEU DE CARTES TACTIQUE - DECK-BUILDING",
        "title": "AILE EST - COUR DU VIEUX HETRE",
        "subtitle": "PROMPT WARS - LE DUEL DE L ESPRIT CRITIQUE",
        "color": "0xe11d48"
    }
]

def generate_video(cfg):
    out_path = os.path.join(OUT_DIR, cfg["filename"])
    c = cfg["color"]
    
    # Clean filter without single quotes inside text
    filter_str = (
        f"[0:v]drawbox=x=0:y=0:w=1280:h=720:color=black:t=fill,"
        f"drawgrid=width=32:height=32:thickness=1:color={c}@0.2,"
        f"drawbox=x=80:y=160:w=1120:h=400:color={c}@0.15:t=fill,"
        f"drawbox=x=80:y=160:w=1120:h=400:color={c}:t=3,"
        f"drawtext=text=CAMPUS LES RIVAGEOIS - PROTOCOLE AURORE:fontcolor=white@0.7:fontsize=16:x=(w-text_w)/2:y=200,"
        f"drawtext=text={cfg['tag']}:fontcolor={c}:fontsize=18:x=(w-text_w)/2:y=240,"
        f"drawtext=text={cfg['title']}:fontcolor=white:fontsize=32:x=(w-text_w)/2:y=300,"
        f"drawtext=text={cfg['subtitle']}:fontcolor=yellow:fontsize=24:x=(w-text_w)/2:y=360,"
        f"drawtext=text=INITIALISATION DU JEU EN COURS...:fontcolor=white@0.9:fontsize=16:x=(w-text_w)/2:y=460,"
        f"fade=t=in:st=0:d=0.3,fade=t=out:st=2.5:d=0.5[v]"
    )
    
    cmd = [
        "ffmpeg", "-y",
        "-f", "lavfi", "-i", "color=c=black:s=1280x720:d=3.0:r=30",
        "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
        "-filter_complex", filter_str,
        "-map", "[v]",
        "-map", "1:a",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18",
        "-c:a", "aac", "-shortest",
        out_path
    ]
    
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if res.returncode == 0:
        print(f"  [OK] {out_path} ({os.path.getsize(out_path)} bytes)")
    else:
        print(f"  [ERR] {res.stderr.decode('utf-8', errors='ignore')[:300]}")

def main():
    for t in TRANSITIONS:
        generate_video(t)

if __name__ == "__main__":
    main()
