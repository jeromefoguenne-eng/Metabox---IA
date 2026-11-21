"""
PRODUCTION COMPLÈTE DES 21 PLANS DU STORYBOARD « QUI VEUT GAGNER DES CRÉDITS »
- Esthétique 100 % verrouillée sur master_wwtbam_hech_base.jpg (capture WWTBAM validée + VRAI logo HECh)
- Plans longs continus de 15 à 20 secondes (4 à 5 segments chaînés de 65 frames @ 16 fps)
- Synchronisation labiale calée sur la durée exacte de chaque fichier audio (storyboard_voice_durations.json) :
  segments pendant la voix = parole active ; segments après la voix = bouche STRICTEMENT fermée !
- Anti-flou mouvement : 28 steps, cfg 6.5, 4x-UltraSharp.pth -> 1280x720 Lanczos + FFmpeg unsharp + CRF 14
- Ré-ancrage du vrai logo officiel HECh à chaque jonction de segment
- Protection thermique active RTX 4070 Ti (cible <= 56°C) + reprise automatique si déjà généré
"""
import os
import json
import time
import uuid
import shutil
import urllib.request
import subprocess
import cv2
import numpy as np
from PIL import Image, ImageDraw

COMFY_URL = "http://127.0.0.1:8188"
COMFY_INPUT = r"E:\ComfyUI\input"
COMFY_OUTPUT = r"E:\ComfyUI\output"
PROJECT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA"
WWTBAM_VID_DIR = os.path.join(PROJECT_DIR, "public", "videos", "wwtbam")
MAIN_VID_DIR = os.path.join(PROJECT_DIR, "public", "videos")
LOGO_PATH = os.path.join(PROJECT_DIR, "public", "images", "hech_logo_officiel.png")
DURATIONS_JSON = os.path.join(PROJECT_DIR, "scripts", "storyboard_voice_durations.json")
WORK_DIR = os.path.join(PROJECT_DIR, "tmp_21_plans")
os.makedirs(WWTBAM_VID_DIR, exist_ok=True)
os.makedirs(WORK_DIR, exist_ok=True)

UNIFORM_PREFIX = (
    "Masterpiece 3D Disney Pixar animation, crisp sharp focus throughout, zero motion blur, "
    "EXACT SAME dark circular Who Wants to Be a Millionaire studio, EXACT SAME midnight-blue lighting and brightness, "
    "EXACT SAME symmetrical fixed camera, EXACT SAME host Henri in navy blazer and beige cable-knit sweater "
    "behind the curved wooden and frosted-glass podium bearing the heCh CHARLEMAGNE logo, "
    "smooth controlled cinematic gestures, high definition textures, "
)

NEG_PROMPT = (
    "motion blur, blurry, blurry face, blurry hands, out of focus, soft focus, smeared motion, "
    "low resolution, ugly, deformed face, distorted eyes, extra fingers, mutated hand, morphing podium, "
    "distorted logo text, different presenter, different lighting, brightness change, camera cut, zoom jump, "
    "flickering, jittery, 2d cartoon, anime, watermark"
)

# Définition complète des 21 Plans validés (avec start_image approuvé, nombre de segments de 4s, actions parole & silence)
PLANS = [
    # 1. Présentation (20s = 5 segments)
    {
        "id": "plan01_presentation",
        "start_image": "sb_plan01_presentation.jpg",
        "num_segments": 5,
        "legacy_aliases": ["tv_show_intro.mp4"],
        "speak_actions": [
            "Henri welcomes the audience warmly with open arms, big charismatic smile, clear natural speaking lip movement, welcoming gestures.",
            "seamless continuation, Henri brings his right hand gently to the wooden podium while gesturing warmly with his left hand explaining the game rules, lively natural lip movement.",
            "seamless continuation, Henri turns slightly toward the dark tiered audience with a friendly gesture and warm smile, then faces the camera again while speaking clearly.",
            "seamless continuation, Henri rests both hands lightly on the podium edge with an encouraging smile, finishing his opening presentation clearly."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed in a warm reassuring smile, calm breathing, subtle welcoming nod toward the contestant."
    },
    # 2. Écoute silencieuse (20s = 5 segments, 100% bouche fermée — prioritaire pour tout le jeu !)
    {
        "id": "plan15_ecoute",
        "start_image": "master_wwtbam_hech_base.jpg",
        "num_segments": 5,
        "legacy_aliases": ["tv_show_focus.mp4"],
        "force_silent": True,
        "speak_actions": [],
        "silent_action": "Henri listening silently with his mouth strictly closed, calm attentive eyes blinking naturally, subtle slow breathing, gentle micro-shifts of posture behind the HECh podium, zero lip movement."
    },
    # 3 à 12. Les 10 Plans de Questions (16s = 4 segments chacun, génériques)
    {
        "id": "plan02_q1",
        "start_image": "sb_plan02_q1.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_q_easy.mp4"],
        "speak_actions": [
            "Henri speaks warmly and cheerfully introducing the first question, right hand gesturing open toward the player, friendly relaxed smile, clear lip movement.",
            "seamless continuation, Henri smoothly lowers his hand to the wooden podium edge as he finishes introducing the first question with an encouraging nod."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, calm friendly smile, blinking naturally and waiting attentively for the player."
    },
    {
        "id": "plan03_q2",
        "start_image": "master_wwtbam_hech_base.jpg",
        "num_segments": 4,
        "legacy_aliases": [],
        "speak_actions": [
            "Henri raises his left hand dynamically in an upbeat announcing gesture, warm encouraging smile, clear natural speaking mouth animation.",
            "seamless continuation, Henri brings both hands gently onto the wooden podium edge while finishing his announcement with a positive nod."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, attentive encouraging gaze, subtle breathing and natural eye blinks."
    },
    {
        "id": "plan04_q3",
        "start_image": "sb_plan04_q3.jpg",
        "num_segments": 4,
        "legacy_aliases": [],
        "speak_actions": [
            "Henri holds a dignified upright posture, raising his right index finger pedagogically to emphasize the first safety tier question, clear articulate lip movement.",
            "seamless continuation, Henri gently lowers his hand onto the HECh podium, maintaining a solemn encouraging expression as he finishes speaking."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, steady focused gaze waiting for the player to secure the safety tier."
    },
    {
        "id": "plan05_q4",
        "start_image": "sb_plan05_q4.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_q_medium.mp4"],
        "speak_actions": [
            "Henri leans slightly forward with his hands resting on the wooden rim of the HECh podium, speaking with curious attentive warmth and clear lip movement.",
            "seamless continuation, Henri gives a small measured gesture with one hand inviting careful reading, then settles calmly back onto the podium."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, curious attentive expression watching the player think."
    },
    {
        "id": "plan06_q5",
        "start_image": "master_wwtbam_hech_base.jpg",
        "num_segments": 4,
        "legacy_aliases": [],
        "speak_actions": [
            "Henri lifts both palms open in front of his beige sweater in a balanced analytical gesture, raising his eyebrows slightly while speaking clearly.",
            "seamless continuation, Henri smoothly lowers his hands to rest on the podium as he finishes announcing the halfway question."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, calm poised listening posture."
    },
    {
        "id": "plan07_q6",
        "start_image": "sb_plan07_q6.jpg",
        "num_segments": 4,
        "legacy_aliases": [],
        "speak_actions": [
            "Henri rests his hand thoughtfully near his chin with a curious analytical look, speaking calmly as the studio tension rises, clear lip movement.",
            "seamless continuation, Henri lowers his hand smoothly to the podium with a subtle knowing nod as he completes his sentence."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, thoughtful attentive gaze, subtle breathing."
    },
    {
        "id": "plan08_q7",
        "start_image": "sb_plan08_q7.jpg",
        "num_segments": 4,
        "legacy_aliases": [],
        "speak_actions": [
            "Henri clasps his hands firmly on the wooden HECh podium, serious dignified expression announcing the second safety tier, deliberate clear lip movement.",
            "seamless continuation, Henri holds his steady focused gaze into the camera with a slight solemn nod as he finishes speaking."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, hands clasped calmly on the podium in tense quiet focus."
    },
    {
        "id": "plan09_q8",
        "start_image": "sb_plan09_q8.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_q_hard.mp4"],
        "speak_actions": [
            "Henri leans forward over the HECh podium with both palms pressed on the wood, grave intense eyes speaking slowly and clearly.",
            "seamless continuation, Henri slightly tilts his head with quiet intensity as he finishes introducing this high-stakes question."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, intense unwavering gaze in dead studio silence."
    },
    {
        "id": "plan10_q9",
        "start_image": "sb_plan10_q9.jpg",
        "num_segments": 4,
        "legacy_aliases": [],
        "speak_actions": [
            "Henri extends his right hand in a slow measured gesture, penetrating focused gaze announcing the penultimate question, deliberate lip movement.",
            "seamless continuation, Henri lowers his hand softly onto the podium with grave concentration as he concludes his sentence."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, intense focused stillness."
    },
    {
        "id": "plan11_q10",
        "start_image": "sb_plan11_q10.jpg",
        "num_segments": 4,
        "legacy_aliases": [],
        "speak_actions": [
            "Henri holds his hands clasped solemnly in front of his chest, magnetic serious gaze announcing the tenth and final question for 60 ECTS, deliberate clear lip movement.",
            "seamless continuation, Henri rests his clasped hands slowly onto the wooden HECh podium as he finishes his dramatic announcement."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, supreme dramatic focus in the silent arena."
    },
    # 13 à 15. Les 3 Interludes de Pression (16s = 4 segments chacun)
    {
        "id": "plan12_pression1",
        "start_image": "master_wwtbam_hech_base.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_pressure.mp4"],
        "speak_actions": [
            "Henri leans forward deliberately, pressing his right index finger gently onto the wooden podium to stress how crucial this question is, serious clear lip movement.",
            "seamless continuation, Henri clasps his hands together with grave authority as he finishes warning the contestant."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, intense watchful gaze."
    },
    {
        "id": "plan13_pression2",
        "start_image": "sb_plan13_pression2.jpg",
        "num_segments": 4,
        "legacy_aliases": [],
        "speak_actions": [
            "Henri holds his hands clasped firmly in front of his vest with focused eyebrows, speaking calmly about the high stakes in the silent studio.",
            "seamless continuation, Henri lowers his clasped hands slowly to the podium edge as he finishes speaking."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, steady high-stakes concentration."
    },
    {
        "id": "plan14_pression3",
        "start_image": "master_wwtbam_hech_base.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_suspense_intense.mp4"],
        "speak_actions": [
            "Henri subtly tilts his head, scrutinizing the contestant directly in the eyes with unwavering intensity while asking 'Is that your final answer?', deliberate lip movement.",
            "seamless continuation, Henri leans slightly closer over the HECh podium with calm dramatic gravity as he finishes the question."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, piercing silent scrutiny without blinking much."
    },
    # 16 à 18. Les 3 Jokers (16s = 4 segments chacun)
    {
        "id": "plan16_joker_5050",
        "start_image": "sb_plan16_joker_5050.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_joker_5050.mp4"],
        "speak_actions": [
            "Henri presses firmly on the illuminated desk panel to trigger the 50/50 computer elimination, looking up with a lively charismatic smile and clear lip movement.",
            "seamless continuation, Henri opens both hands toward the contestant showing only two choices remain, warm encouraging expression."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, friendly encouraging smile waiting for the player's decision."
    },
    {
        "id": "plan17_joker_public",
        "start_image": "master_wwtbam_hech_base.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_joker_public.mp4", "tv_show_joker.mp4"],
        "speak_actions": [
            "Henri pivots his upper body warmly toward the dark tiered audience, extending his open arm to invite the audience to vote on their keypads, clear speaking lip movement.",
            "seamless continuation, Henri smoothly turns back toward the camera with an engaged smile as audience members lean forward in the dark tiers."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, glancing attentively at the podium screen and back at the player."
    },
    {
        "id": "plan18_joker_sar",
        "start_image": "master_wwtbam_hech_base.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_joker_sar.mp4"],
        "speak_actions": [
            "Henri gracefully raises his right hand to his earpiece, tilting his head slightly while introducing the live phone link to the SAR professor, clear speaking lip movement.",
            "seamless continuation, Henri keeps his hand lightly near his ear, listening intently and nodding slowly as the professor speaks."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth strictly closed, attentive nodding while listening carefully on his earpiece."
    },
    # 19 à 21. Réactions & Dénouements (16s = 4 segments chacun)
    {
        "id": "plan19_bonne_reponse",
        "start_image": "sb_plan19_bonne_reponse.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_celebration.mp4"],
        "speak_actions": [
            "Henri breaks into a huge joyful smile, clapping his hands warmly while congratulating the player with clear enthusiastic lip movement, audience in the dark tiers applauding happily.",
            "seamless continuation, Henri gestures warmly toward the cheering audience and beams with pride as he finishes congratulating the contestant."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth closed in a broad proud smile, nodding warmly while the audience applause settles."
    },
    {
        "id": "plan20_defaite",
        "start_image": "sb_plan20_defaite.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_defeat.mp4", "tv_show_wrong.mp4"],
        "speak_actions": [
            "Henri shows genuine compassionate empathy, gently shaking his head with open comforting hands while announcing the wrong answer, disappointed audience in the dark background holding their heads.",
            "seamless continuation, Henri looks warmly and sympathetically at the player, thanking them sincerely for their run with clear gentle lip movement."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth closed in a kind empathetic expression, gentle respectful nod."
    },
    {
        "id": "plan21_victoire",
        "start_image": "sb_plan19_bonne_reponse.jpg",
        "num_segments": 4,
        "legacy_aliases": ["tv_show_victoire.mp4"],
        "speak_actions": [
            "Henri raises both arms high in euphoric triumph with a radiant smile announcing the supreme 60 ECTS victory, clear joyful lip movement, entire audience in the dark tiers standing and cheering wildly.",
            "seamless continuation, Henri applauds enthusiastically and beams with immense pride toward the champion while the standing ovation continues."
        ],
        "silent_action": "seamless continuation, Henri has finished speaking, mouth closed in a beaming triumphant smile, clapping warmly for the 60 ECTS champion."
    }
]

def build_podium_logo_overlay(w, h):
    x1, x2 = int(w * 0.436), int(w * 0.564)
    y1, y2 = int(h * 0.678), int(h * 0.806)
    pw, ph = x2 - x1, y2 - y1
    plaque = Image.new("RGBA", (pw, ph), (0, 0, 0, 0))
    draw = ImageDraw.Draw(plaque)
    draw.rounded_rectangle([0, 0, pw - 1, ph - 1], radius=14, fill=(238, 244, 252, 232), outline=(185, 210, 240, 210), width=2)
    logo = Image.open(LOGO_PATH).convert("RGBA")
    pad_x, pad_y = int(pw * 0.08), int(ph * 0.08)
    scale = min((pw - 2 * pad_x) / logo.width, (ph - 2 * pad_y) / logo.height)
    logo_r = logo.resize((int(logo.width * scale), int(logo.height * scale)), Image.Resampling.LANCZOS)
    plaque.alpha_composite(logo_r, ((pw - logo_r.width) // 2, (ph - logo_r.height) // 2))
    bgra = cv2.cvtColor(np.array(plaque), cv2.COLOR_RGBA2BGRA)
    return x1, y1, x2, y2, bgra

def restamp_hech_logo(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return
    h, w = img.shape[:2]
    x1, y1, x2, y2, bgra = build_podium_logo_overlay(w, h)
    alpha = bgra[:, :, 3:4].astype(np.float32) / 255.0
    fg = bgra[:, :, :3].astype(np.float32) * 0.86
    roi = img[y1:y2, x1:x2].astype(np.float32)
    img[y1:y2, x1:x2] = (fg * alpha + roi * (1.0 - alpha)).astype(np.uint8)
    cv2.imwrite(img_path, img)

def get_gpu_temp():
    try:
        out = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=temperature.gpu", "--format=csv,noheader,nounits"],
            encoding="utf-8"
        )
        return int(out.strip())
    except Exception:
        return 45

def wait_for_cool_gpu(target_temp=56):
    temp = get_gpu_temp()
    print(f"🌡️ GPU : {temp}°C (cible <= {target_temp}°C)", flush=True)
    while temp > target_temp:
        time.sleep(10)
        temp = get_gpu_temp()
        print(f"   ❄️ Refroidissement actif : {temp}°C...", flush=True)

def wait_for_comfy_ready():
    print("⏳ Attente de la disponibilité de ComfyUI (127.0.0.1:8188)...", flush=True)
    while True:
        try:
            with urllib.request.urlopen(f"{COMFY_URL}/queue", timeout=3) as resp:
                if resp.status == 200:
                    print("✅ ComfyUI prêt !", flush=True)
                    return
        except Exception:
            pass
        time.sleep(3)

def build_workflow(start_img_name, prompt_text, prefix, frames=65, steps=28):
    return {
        "1": {"inputs": {"image": start_img_name, "upload": "image"}, "class_type": "LoadImage"},
        "2": {"inputs": {"unet_name": "wan2.1_i2v_480p_14B_fp8_e4m3fn.safetensors", "weight_dtype": "fp8_e4m3fn"}, "class_type": "UNETLoader"},
        "3": {"inputs": {"clip_name": "umt5_xxl_fp8_e4m3fn_scaled.safetensors", "type": "wan"}, "class_type": "CLIPLoader"},
        "4": {"inputs": {"vae_name": "wan_2.1_vae.safetensors"}, "class_type": "VAELoader"},
        "5": {"inputs": {"clip_name": "clip_vision_h.safetensors"}, "class_type": "CLIPVisionLoader"},
        "6": {"inputs": {"clip_vision": ["5", 0], "image": ["1", 0], "crop": "center"}, "class_type": "CLIPVisionEncode"},
        "7": {"inputs": {"text": prompt_text, "clip": ["3", 0]}, "class_type": "CLIPTextEncode"},
        "8": {"inputs": {"text": NEG_PROMPT, "clip": ["3", 0]}, "class_type": "CLIPTextEncode"},
        "9": {
            "inputs": {
                "positive": ["7", 0], "negative": ["8", 0], "vae": ["4", 0],
                "start_image": ["1", 0], "clip_vision_output": ["6", 0],
                "width": 832, "height": 480, "length": frames, "batch_size": 1
            },
            "class_type": "WanImageToVideo"
        },
        "10": {
            "inputs": {
                "model": ["2", 0], "positive": ["9", 0], "negative": ["9", 1], "latent_image": ["9", 2],
                "seed": int(uuid.uuid4().int % 2147483647), "steps": steps, "cfg": 6.5,
                "sampler_name": "uni_pc", "scheduler": "simple", "denoise": 1.0
            },
            "class_type": "KSampler"
        },
        "11": {"inputs": {"samples": ["10", 0], "vae": ["4", 0], "tile_size": 512, "overlap": 64, "temporal_size": 64, "temporal_overlap": 8}, "class_type": "VAEDecodeTiled"},
        "12": {"inputs": {"model_name": "4x-UltraSharp.pth"}, "class_type": "UpscaleModelLoader"},
        "13": {"inputs": {"upscale_model": ["12", 0], "image": ["11", 0]}, "class_type": "ImageUpscaleWithModel"},
        "14": {"inputs": {"image": ["13", 0], "upscale_method": "lanczos", "width": 1280, "height": 720, "crop": "disabled"}, "class_type": "ImageScale"},
        "15": {
            "inputs": {
                "images": ["14", 0], "frame_rate": 16.0, "loop_count": 0, "filename_prefix": prefix,
                "format": "video/h264-mp4", "pix_fmt": "yuv420p", "crf": 14,
                "save_metadata": False, "trim_to_audio": False, "pingpong": False, "save_output": True
            },
            "class_type": "VHS_VideoCombine"
        }
    }

def render_segment(start_img_name, prompt_text, prefix):
    wait_for_cool_gpu(target_temp=56)
    wf = build_workflow(start_img_name, prompt_text, prefix, frames=65, steps=28)
    req = urllib.request.Request(f"{COMFY_URL}/prompt", data=json.dumps({"prompt": wf}).encode("utf-8"), headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        prompt_id = json.loads(resp.read().decode())["prompt_id"]
    print(f"   🚀 Segment soumis ({prefix}, 28 steps HD) : {prompt_id}", flush=True)

    start = time.time()
    while True:
        time.sleep(8)
        elapsed = int(time.time() - start)
        try:
            with urllib.request.urlopen(f"{COMFY_URL}/history/{prompt_id}") as h_resp:
                history = json.loads(h_resp.read().decode())
                if prompt_id in history:
                    for nid, out in history[prompt_id].get("outputs", {}).items():
                        if "gifs" in out and len(out["gifs"]) > 0:
                            fname = out["gifs"][0]["filename"]
                            print(f"   ✅ Segment terminé en {elapsed}s : {fname}", flush=True)
                            return os.path.join(COMFY_OUTPUT, fname)
        except Exception:
            pass
        if elapsed % 48 == 0:
            print(f"      ⏳ [{prefix}] {elapsed}s | GPU: {get_gpu_temp()}°C", flush=True)

def concat_and_sharpen(seg_paths, out_mp4):
    """Assemble sans coupure (retrait frame 0 dupliquée) + filtre anti-flou unsharp + CRF 14."""
    inputs = []
    filters = []
    labels = []
    for i, p in enumerate(seg_paths):
        inputs.extend(["-i", p])
        if i == 0:
            filters.append(f"[{i}:v]setpts=PTS-STARTPTS[v{i}]")
        else:
            filters.append(f"[{i}:v]trim=start_frame=1,setpts=PTS-STARTPTS[v{i}]")
        labels.append(f"[v{i}]")

    fc = (
        ";".join(filters)
        + f";{''.join(labels)}concat=n={len(seg_paths)}:v=1:a=0,unsharp=5:5:0.55:5:5:0.0[outv]"
    )
    subprocess.run(
        ["ffmpeg", "-y", *inputs, "-filter_complex", fc, "-map", "[outv]",
         "-c:v", "libx264", "-crf", "14", "-preset", "slow", "-pix_fmt", "yuv420p", out_mp4],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
    )

def produce_plan(plan, voice_durations):
    pid = plan["id"]
    final_wwtbam = os.path.join(WWTBAM_VID_DIR, f"{pid}.mp4")
    if os.path.exists(final_wwtbam) and os.path.getsize(final_wwtbam) > 1_000_000:
        print(f"⏭️ {pid}.mp4 déjà généré ({os.path.getsize(final_wwtbam)//1024} Ko), ignoré.", flush=True)
        return

    voice_dur = 0.0 if plan.get("force_silent") else voice_durations.get(pid, 6.0)
    num_segs = plan["num_segments"]
    print("\n" + "=" * 76, flush=True)
    print(f"🎬 PRODUCTION {pid.upper()} ({num_segs*4}s | Voix: {voice_dur:.2f}s | Frame-0: {plan['start_image']})", flush=True)
    print("=" * 76, flush=True)

    seg_files = []
    current_start = plan["start_image"]
    speak_idx = 0

    for s in range(num_segs):
        seg_start_sec = s * 4.0
        local_seg = os.path.join(WORK_DIR, f"{pid}_seg{s+1}.mp4")
        if os.path.exists(local_seg) and os.path.getsize(local_seg) > 500_000:
            print(f"   ⏭️ Segment {s+1}/{num_segs} déjà en cache local.", flush=True)
        else:
            if not plan.get("force_silent") and seg_start_sec < voice_dur and speak_idx < len(plan["speak_actions"]):
                action = plan["speak_actions"][speak_idx]
                speak_idx += 1
                mode_lbl = "PAROLE"
            else:
                action = plan["silent_action"]
                mode_lbl = "BOUCHE FERMÉE"

            print(f"   🗣️ Segment {s+1}/{num_segs} ({seg_start_sec:.0f}s-{(s+1)*4:.0f}s) [{mode_lbl}]", flush=True)
            prompt = UNIFORM_PREFIX + action
            seg_src = render_segment(current_start, prompt, f"SB21_{pid}_s{s+1}")
            shutil.copy2(seg_src, local_seg)
            time.sleep(12)

        seg_files.append(local_seg)

        if s < num_segs - 1:
            next_frame_name = f"sb21_chain_{pid}_s{s+1}.png"
            next_frame_path = os.path.join(COMFY_INPUT, next_frame_name)
            subprocess.run(
                ["ffmpeg", "-y", "-sseof", "-0.08", "-i", local_seg, "-vframes", "1", next_frame_path],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
            )
            restamp_hech_logo(next_frame_path)
            current_start = next_frame_name

    # Compilation HD anti-flou
    concat_and_sharpen(seg_files, final_wwtbam)
    print(f"🎉 DÉPLOYÉ : {final_wwtbam} ({os.path.getsize(final_wwtbam)//1024} Ko)", flush=True)

    for alias in plan.get("legacy_aliases", []):
        shutil.copy2(final_wwtbam, os.path.join(MAIN_VID_DIR, alias))
        print(f"   ↳ Alias synchronisé : public/videos/{alias}", flush=True)

if __name__ == "__main__":
    wait_for_comfy_ready()
    durations = {}
    if os.path.exists(DURATIONS_JSON):
        with open(DURATIONS_JSON, "r", encoding="utf-8") as f:
            durations = json.load(f)
    for p in PLANS:
        produce_plan(p, durations)
    print("\n🏁 LES 21 PLANS LONGS HD (16–20s, ANTI-FLOU, VRAI LOGO HECh) SONT TERMINÉS !", flush=True)
