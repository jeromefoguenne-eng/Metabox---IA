"""
Générateur de Plans-Séquences Longs Continus (16 à 20 secondes sans boucle courte)
Wan 2.1 14B FP8 + 4x-UltraSharp (1280x720 HD) + Chaînage Last-Frame -> Next-Frame
+ Ré-ancrage continu du VRAI logo officiel de la HECh sur le pupitre.
Protection thermique GPU RTX 4070 Ti active.
"""
import os
import sys
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
OUTPUT_DIR = os.path.join(PROJECT_DIR, "public", "videos")
LOGO_PATH = os.path.join(PROJECT_DIR, "public", "images", "hech_logo_officiel.png")
WORK_DIR = os.path.join(PROJECT_DIR, "tmp_long_shots")
os.makedirs(WORK_DIR, exist_ok=True)

# Coordonnées normalisées de la plaque du pupitre (pour garder le vrai logo HECh 100% net à chaque jonction)
QUAD_3_4 = [(0.285, 0.778), (0.478, 0.806), (0.475, 0.935), (0.288, 0.903)]
QUAD_FRONT = [(0.378, 0.836), (0.622, 0.836), (0.622, 0.985), (0.378, 0.985)]

LONG_SHOTS = [
    {
        "id": "plan1_long_intro_easy",
        "title": "Plan Long 1 (20s) - Ouverture & Questions Paliers 1-3 (Vrai Logo HECh)",
        "start_image": "henri_real_logo_plan1.jpg",
        "quad": QUAD_3_4,
        "outputs": ["tv_show_intro.mp4", "tv_show_q_easy.mp4"],
        "segments": [
            "Masterpiece 3D Disney Pixar animation, crisp high definition, Henri the charismatic host speaking warmly to camera, smiling generously with both hands gesturing open in a welcoming motion behind his illuminated HECh desk, dark TV studio audience watching in dim blue light, smooth continuous camera, fluid natural motion.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri gently brings his right hand down to rest on the wooden podium edge while gesturing smoothly with his left hand to explain the rules and question, natural head nods, expressive eyebrows, lively speaking mouth animation, stable studio camera.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri turns his upper torso slightly toward the dark tiered audience on the left with a warm encouraging smile and open palm gesture, then smoothly looks back into the main camera, fluid natural body language, stable camera.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri rests both forearms comfortably on the glowing HECh podium, leaning slightly forward with friendly curiosity and an inviting smile while finishing his question, natural breathing and eye contact, stable camera.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri softly closes his mouth with a reassuring warm smile, gives a gentle encouraging nod and a subtle open-hand gesture inviting the contestant to think and answer, calm attentive studio atmosphere, stable camera."
        ]
    },
    {
        "id": "plan4_long_focus",
        "title": "Plan Long 2 (16s) - Écoute Silencieuse Attentive (Bouche Fermée, Vrai Logo HECh)",
        "start_image": "henri_real_logo_plan1.jpg",
        "quad": QUAD_3_4,
        "outputs": ["tv_show_focus.mp4"],
        "segments": [
            "Masterpiece 3D Disney Pixar animation, crisp high definition, Henri listening silently with his mouth strictly closed, calm attentive expression, blinking naturally, gently resting his hands on the wooden HECh podium, dark dramatic TV studio, subtle slow breathing, stable camera.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri keeps his mouth completely closed in thoughtful silence, slowly tilts his head slightly to the right while observing the contestant with friendly focus, subtle shift of posture, dark suspenseful studio lighting.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri remains completely silent with closed lips, gives a very subtle slow nod of encouragement, clasps his hands gently on the podium, calm steady gaze into the camera, dark studio ambiance.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri keeps his mouth closed in quiet concentration, glances briefly down at his desk monitor then smoothly looks back up at the contestant with steady expectant eyes, dark studio spotlights."
        ]
    },
    {
        "id": "plan2_long_medium",
        "title": "Plan Long 3 (16s) - Paliers 4 à 7 : Analyse & Montée en Tension (Vrai Logo HECh)",
        "start_image": "henri_real_logo_plan2.jpg",
        "quad": QUAD_3_4,
        "outputs": ["tv_show_q_medium.mp4"],
        "segments": [
            "Masterpiece 3D Disney Pixar animation, crisp high definition, Henri resting his elbow on the HECh podium with index finger near his temple in analytical reflection, speaking calmly and clearly, subtle eyebrow movement, dark studio with blue and amber spotlights, fluid motion.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri lowers his hand from his temple and extends his open palm smoothly toward the side to emphasize the subtle nuance of the academic question, expressive speaking face, natural posture shift.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri brings both hands together in front of his beige vest, raising his eyebrows slightly with intellectual intrigue while addressing the contestant, steady dramatic studio lighting.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri leans gently onto the wooden edge of the HECh desk, softly closing his mouth as he finishes speaking, holding a calm thoughtful gaze while waiting for the player's reasoning."
        ]
    },
    {
        "id": "plan3_long_hard_suspense",
        "title": "Plan Long 4 (16s) - Paliers 8 à 10 & Suspense Ultime (Vrai Logo HECh)",
        "start_image": "henri_real_logo_plan3.jpg",
        "quad": QUAD_FRONT,
        "outputs": ["tv_show_q_hard.mp4", "tv_show_suspense_intense.mp4", "tv_show_pressure.mp4"],
        "segments": [
            "Masterpiece 3D Disney Pixar animation, crisp high definition, extreme game show suspense, Henri leaning forward over the illuminated HECh podium with hands clasped firmly together, piercing intense gaze directly into camera, speaking with grave serious authority, vertical midnight blue spotlights and gentle studio haze.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri slowly tilts his head slightly while scrutinizing the contestant with unwavering intense eyes, asking 'Is that your final answer?' with solemn deliberate mouth movement, heavy tense atmosphere.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, dead silence in the dark studio, Henri holds his mouth strictly closed, breathing calmly, intense focused eye contact without blinking much, dramatic blue spotlight beams softly shifting in the background haze.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri glances briefly down at his glowing desk monitor with furrowed brows, then smoothly raises his piercing gaze back to the contestant, gripping his clasped hands in dramatic anticipation."
        ]
    },
    {
        "id": "plan5_long_victory",
        "title": "Plan Long 5 (12s) - Sacre Suprême 60 ECTS (Vrai Logo HECh)",
        "start_image": "henri_real_logo_plan4.jpg",
        "quad": QUAD_3_4,
        "outputs": ["tv_show_victoire.mp4", "tv_show_celebration.mp4"],
        "segments": [
            "Masterpiece 3D Disney Pixar animation, crisp high definition, euphoric game show victory celebration, Henri laughing with a huge joyful smile, raising the gleaming golden trophy high in triumph while golden confetti falls across the studio and the audience stands cheering wildly, fluid Pixar motion.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri beams with pride and applauds enthusiastically toward the contestant and the cheering standing audience, shimmering golden light beams sweeping the arena, falling golden confetti.",
            "Masterpiece 3D Disney Pixar animation, crisp high definition, seamless continuation, Henri gestures warmly toward the cheering crowd with both arms open in triumphant celebration, radiant joyful smile, festive golden lighting finale."
        ]
    }
]

def build_backlit_logo_plaque(logo_path, plaque_w=640, plaque_h=340):
    plaque = Image.new("RGBA", (plaque_w, plaque_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(plaque)
    draw.rounded_rectangle([8, 8, plaque_w - 8, plaque_h - 8], radius=44, fill=(246, 248, 252, 255), outline=(255, 226, 150, 255), width=6)
    logo = Image.open(logo_path).convert("RGBA")
    pad_x, pad_y = 64, 30
    scale = min((plaque_w - 2 * pad_x) / logo.width, (plaque_h - 2 * pad_y) / logo.height)
    logo_r = logo.resize((int(logo.width * scale), int(logo.height * scale)), Image.Resampling.LANCZOS)
    plaque.alpha_composite(logo_r, ((plaque_w - logo_r.width) // 2, (plaque_h - logo_r.height) // 2))
    return cv2.cvtColor(np.array(plaque), cv2.COLOR_RGBA2BGRA)

PLAQUE_BGRA = build_backlit_logo_plaque(LOGO_PATH)

def restamp_hech_logo(img_path, quad_norm):
    """Ré-ancre délicatement le vrai logo officiel HECh sur la plaque pour éviter toute dérive sur 20s."""
    img = cv2.imread(img_path)
    if img is None:
        return
    h, w = img.shape[:2]
    ph, pw = PLAQUE_BGRA.shape[:2]
    src_pts = np.array([[0, 0], [pw, 0], [pw, ph], [0, ph]], dtype=np.float32)
    dst_pts = np.array([[x * w, y * h] for (x, y) in quad_norm], dtype=np.float32)
    M = cv2.getPerspectiveTransform(src_pts, dst_pts)
    warped = cv2.warpPerspective(PLAQUE_BGRA, M, (w, h), flags=cv2.INTER_LANCZOS4, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
    alpha = warped[:, :, 3:4].astype(np.float32) / 255.0
    fg = warped[:, :, :3].astype(np.float32) * 0.93
    out = (fg * alpha + img.astype(np.float32) * (1.0 - alpha)).astype(np.uint8)
    cv2.imwrite(img_path, out)

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

def build_workflow(start_img_name, prompt_text, prefix, frames=65, steps=20):
    return {
        "1": {"inputs": {"image": start_img_name, "upload": "image"}, "class_type": "LoadImage"},
        "2": {"inputs": {"unet_name": "wan2.1_i2v_480p_14B_fp8_e4m3fn.safetensors", "weight_dtype": "fp8_e4m3fn"}, "class_type": "UNETLoader"},
        "3": {"inputs": {"clip_name": "umt5_xxl_fp8_e4m3fn_scaled.safetensors", "type": "wan"}, "class_type": "CLIPLoader"},
        "4": {"inputs": {"vae_name": "wan_2.1_vae.safetensors"}, "class_type": "VAELoader"},
        "5": {"inputs": {"clip_name": "clip_vision_h.safetensors"}, "class_type": "CLIPVisionLoader"},
        "6": {"inputs": {"clip_vision": ["5", 0], "image": ["1", 0], "crop": "center"}, "class_type": "CLIPVisionEncode"},
        "7": {"inputs": {"text": prompt_text, "clip": ["3", 0]}, "class_type": "CLIPTextEncode"},
        "8": {
            "inputs": {
                "text": "blurry, low resolution, ugly, deformed face, distorted hands, extra fingers, morphing desk, distorted logo text, flickering, jittery, low quality, 2d cartoon, anime",
                "clip": ["3", 0]
            },
            "class_type": "CLIPTextEncode"
        },
        "9": {
            "inputs": {
                "positive": ["7", 0],
                "negative": ["8", 0],
                "vae": ["4", 0],
                "start_image": ["1", 0],
                "clip_vision_output": ["6", 0],
                "width": 832,
                "height": 480,
                "length": frames,
                "batch_size": 1
            },
            "class_type": "WanImageToVideo"
        },
        "10": {
            "inputs": {
                "model": ["2", 0],
                "positive": ["9", 0],
                "negative": ["9", 1],
                "latent_image": ["9", 2],
                "seed": int(uuid.uuid4().int % 2147483647),
                "steps": steps,
                "cfg": 6.0,
                "sampler_name": "uni_pc",
                "scheduler": "simple",
                "denoise": 1.0
            },
            "class_type": "KSampler"
        },
        "11": {
            "inputs": {"samples": ["10", 0], "vae": ["4", 0], "tile_size": 512, "overlap": 64, "temporal_size": 64, "temporal_overlap": 8},
            "class_type": "VAEDecodeTiled"
        },
        "12": {"inputs": {"model_name": "4x-UltraSharp.pth"}, "class_type": "UpscaleModelLoader"},
        "13": {"inputs": {"upscale_model": ["12", 0], "image": ["11", 0]}, "class_type": "ImageUpscaleWithModel"},
        "14": {"inputs": {"image": ["13", 0], "upscale_method": "lanczos", "width": 1280, "height": 720, "crop": "disabled"}, "class_type": "ImageScale"},
        "15": {
            "inputs": {
                "images": ["14", 0],
                "frame_rate": 16.0,
                "loop_count": 0,
                "filename_prefix": prefix,
                "format": "video/h264-mp4",
                "pix_fmt": "yuv420p",
                "crf": 15,
                "save_metadata": False,
                "trim_to_audio": False,
                "pingpong": False,
                "save_output": True
            },
            "class_type": "VHS_VideoCombine"
        }
    }

def render_segment(start_img_name, prompt_text, prefix):
    wait_for_cool_gpu(target_temp=56)
    wf = build_workflow(start_img_name, prompt_text, prefix, frames=65, steps=20)
    req_data = json.dumps({"prompt": wf}).encode("utf-8")
    req = urllib.request.Request(f"{COMFY_URL}/prompt", data=req_data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:
        prompt_id = json.loads(resp.read().decode())["prompt_id"]
    print(f"   🚀 Segment soumis ({prefix}) : {prompt_id}", flush=True)

    start = time.time()
    while True:
        time.sleep(8)
        elapsed = int(time.time() - start)
        try:
            with urllib.request.urlopen(f"{COMFY_URL}/history/{prompt_id}") as h_resp:
                history = json.loads(h_resp.read().decode())
                if prompt_id in history:
                    outputs = history[prompt_id].get("outputs", {})
                    for nid, out in outputs.items():
                        if "gifs" in out and len(out["gifs"]) > 0:
                            fname = out["gifs"][0]["filename"]
                            src = os.path.join(COMFY_OUTPUT, fname)
                            print(f"   ✅ Segment terminé en {elapsed}s : {fname}", flush=True)
                            return src
        except Exception:
            pass
        if elapsed % 32 == 0:
            print(f"      ⏳ [{prefix}] {elapsed}s | GPU: {get_gpu_temp()}°C", flush=True)

def concat_segments_seamlessly(seg_paths, out_mp4):
    """Assemble les segments en retirant la 1re image dupliquée des segments 2..N (zéro saccade)."""
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

    fc = ";".join(filters) + f";{''.join(labels)}concat=n={len(seg_paths)}:v=1:a=0[outv]"
    subprocess.run(
        ["ffmpeg", "-y", *inputs, "-filter_complex", fc, "-map", "[outv]", "-c:v", "libx264", "-crf", "15", "-pix_fmt", "yuv420p", out_mp4],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
    )

def produce_long_shot(shot):
    print("\n" + "=" * 72, flush=True)
    print(f"🎬 PRODUCTION : {shot['title']}", flush=True)
    print("=" * 72, flush=True)

    seg_files = []
    current_start_img = shot["start_image"]

    for idx, prompt in enumerate(shot["segments"], start=1):
        prefix = f"Long_{shot['id']}_seg{idx}"
        seg_mp4 = render_segment(current_start_img, prompt, prefix)
        local_seg = os.path.join(WORK_DIR, f"{shot['id']}_seg{idx}.mp4")
        shutil.copy2(seg_mp4, local_seg)
        seg_files.append(local_seg)

        # Extraire la dernière image exacte pour le segment suivant + ré-ancrer le vrai logo HECh
        if idx < len(shot["segments"]):
            next_frame_name = f"chain_{shot['id']}_after_seg{idx}.png"
            next_frame_path = os.path.join(COMFY_INPUT, next_frame_name)
            subprocess.run(
                ["ffmpeg", "-y", "-sseof", "-0.08", "-i", local_seg, "-vframes", "1", next_frame_path],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True
            )
            restamp_hech_logo(next_frame_path, shot["quad"])
            current_start_img = next_frame_name
            time.sleep(15)

    # Concaténation continue sans coupure
    final_tmp = os.path.join(WORK_DIR, f"{shot['id']}_FULL.mp4")
    concat_segments_seamlessly(seg_files, final_tmp)

    # Déploiement immédiat vers public/videos/
    for out_name in shot["outputs"]:
        dst = os.path.join(OUTPUT_DIR, out_name)
        shutil.copy2(final_tmp, dst)
        print(f"🎉 PLAN LONG DÉPLOYÉ : {dst}", flush=True)

if __name__ == "__main__":
    for shot in LONG_SHOTS:
        produce_long_shot(shot)
    print("\n🏁 TOUS LES PLANS LONGS HD (12–20s) AVEC VRAI LOGO HECh SONT TERMINÉS !", flush=True)
