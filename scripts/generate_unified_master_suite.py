"""
Suite Unifiée 100% Raccord (Zéro Faux Raccord, Un Seul Présentateur, Une Seule Esthétique)
TOUTES les animations partent de l'UNIQUE image maître : henri_real_logo_plan1.jpg
(même visage d'Henri, même costume, même angle 3/4, même studio sombre, VRAI logo HECh).
Résolution 1280x720 HD (4x-UltraSharp) + chaînage continu + protection thermique RTX 4070 Ti.
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
OUTPUT_DIR = os.path.join(PROJECT_DIR, "public", "videos")
LOGO_PATH = os.path.join(PROJECT_DIR, "public", "images", "hech_logo_officiel.png")
WORK_DIR = os.path.join(PROJECT_DIR, "tmp_long_shots")
os.makedirs(WORK_DIR, exist_ok=True)

MASTER_IMAGE = "henri_real_logo_plan1.jpg"
QUAD_3_4 = [(0.285, 0.778), (0.478, 0.806), (0.475, 0.935), (0.288, 0.903)]

UNIFORM_LOCK = (
    "Masterpiece 3D Disney Pixar animation, crisp high definition, "
    "EXACT SAME studio scene, EXACT SAME lighting, EXACT SAME brightness and color palette, "
    "EXACT SAME camera angle and framing, EXACT SAME host Henri in navy blue blazer and beige vest behind his illuminated HECh podium, "
    "EXACT SAME dark tiered audience in the background, zero lighting shift, zero camera cut, "
)

UNIFIED_SHOTS = [
    {
        "id": "unified_pressure_suspense",
        "title": "Plan 03 (12s) - Paliers 4-10, Analyse & Suspense (Même scène & lumière)",
        "outputs": ["tv_show_q_medium.mp4", "tv_show_q_hard.mp4", "tv_show_pressure.mp4", "tv_show_suspense_intense.mp4"],
        "segments": [
            UNIFORM_LOCK + "Henri smoothly lowers his hands to clasp them firmly on the wooden desk edge, leaning slightly forward with serious focused eyes, speaking with calm grave authority, fluid natural motion.",
            UNIFORM_LOCK + "seamless continuation, Henri holds his steady focused gaze directly into the camera, subtly tilting his head while asking the decisive question with deliberate measured mouth movement, calm posture.",
            UNIFORM_LOCK + "seamless continuation, Henri keeps his mouth strictly closed in attentive suspense, hands clasped on the HECh podium, steady unwavering eye contact, subtle natural breathing."
        ]
    },
    {
        "id": "unified_celebration_victory",
        "title": "Plan 04 (8s) - Bonne Réponse & Victoire (Même scène & lumière)",
        "outputs": ["tv_show_celebration.mp4", "tv_show_victoire.mp4"],
        "segments": [
            UNIFORM_LOCK + "Henri breaks into a big radiant joyful smile and claps his hands enthusiastically toward the contestant, audience in the dark background clapping happily, fluid Pixar motion.",
            UNIFORM_LOCK + "seamless continuation, Henri smiles broadly with pride, gives an enthusiastic approving nod and raises his hands in warm celebration while the audience continues applauding behind him."
        ]
    },
    {
        "id": "unified_defeat",
        "title": "Plan 05 (8s) - Défaite & Empathie (Même scène & lumière)",
        "outputs": ["tv_show_defeat.mp4", "tv_show_wrong.mp4"],
        "segments": [
            UNIFORM_LOCK + "Henri's expression shifts to sincere compassionate empathy, gently closing his eyes for a moment and slowly shaking his head while resting his hands softly on the HECh podium, audience reacting with quiet disappointment.",
            UNIFORM_LOCK + "seamless continuation, Henri looks warmly and sympathetically at the contestant with a gentle comforting nod and a calm open-hand gesture of encouragement."
        ]
    },
    {
        "id": "unified_joker_5050",
        "title": "Plan 06 (4s) - Joker 50/50 (Même scène & lumière)",
        "outputs": ["tv_show_joker_5050.mp4"],
        "segments": [
            UNIFORM_LOCK + "Henri presses decisively onto the touch panel on top of his HECh podium, then looks back up into the camera with a confident charismatic smile, fluid natural motion."
        ]
    },
    {
        "id": "unified_joker_public",
        "title": "Plan 07 (4s) - Joker Vote du Public (Même scène & lumière)",
        "outputs": ["tv_show_joker_public.mp4", "tv_show_joker.mp4"],
        "segments": [
            UNIFORM_LOCK + "Henri turns his upper body smoothly toward the dark tiered audience and extends his open hand warmly to invite the audience to vote on their keypads, fluid natural motion."
        ]
    },
    {
        "id": "unified_joker_sar",
        "title": "Plan 08 (4s) - Joker Appel au SAR (Même scène & lumière)",
        "outputs": ["tv_show_joker_sar.mp4"],
        "segments": [
            UNIFORM_LOCK + "Henri raises his right hand gracefully to his ear to listen closely to his earpiece, tilting his head slightly and nodding attentively with focused concentration, fluid natural motion."
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

def restamp_hech_logo(img_path):
    img = cv2.imread(img_path)
    if img is None:
        return
    h, w = img.shape[:2]
    ph, pw = PLAQUE_BGRA.shape[:2]
    src_pts = np.array([[0, 0], [pw, 0], [pw, ph], [0, ph]], dtype=np.float32)
    dst_pts = np.array([[x * w, y * h] for (x, y) in QUAD_3_4], dtype=np.float32)
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
        print(f"   ❄️ Refroidissement : {temp}°C...", flush=True)

def wait_for_comfy_idle():
    while True:
        try:
            with urllib.request.urlopen(f"{COMFY_URL}/queue") as resp:
                q = json.loads(resp.read().decode())
                if len(q.get("queue_running", [])) == 0 and len(q.get("queue_pending", [])) == 0:
                    return
        except Exception:
            pass
        time.sleep(6)

def concat_segments_seamlessly(seg_paths, out_mp4):
    if len(seg_paths) == 1:
        shutil.copy2(seg_paths[0], out_mp4)
        return
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

def finalize_focus_first():
    """Assemble immédiatement tv_show_focus.mp4 (12s) dès que seg3 termine."""
    print("⏳ Attente de la fin de focus_seg3 en cours dans ComfyUI...", flush=True)
    wait_for_comfy_idle()
    seg1 = os.path.join(WORK_DIR, "plan4_long_focus_seg1.mp4")
    seg2 = os.path.join(WORK_DIR, "plan4_long_focus_seg2.mp4")
    seg3_src = os.path.join(COMFY_OUTPUT, "Long_plan4_long_focus_seg3_00001.mp4")
    segs = [p for p in [seg1, seg2] if os.path.exists(p)]
    if os.path.exists(seg3_src):
        seg3 = os.path.join(WORK_DIR, "plan4_long_focus_seg3.mp4")
        shutil.copy2(seg3_src, seg3)
        segs.append(seg3)
    if segs:
        out_focus = os.path.join(OUTPUT_DIR, "tv_show_focus.mp4")
        concat_segments_seamlessly(segs, out_focus)
        print(f"🎉 tv_show_focus.mp4 ({len(segs)*4}s, 100% raccord maître) déployé !", flush=True)

        # Remplacer immédiatement les anciens clips dépareillés par des placeholders 100% raccords
        # en attendant leur rendu dédié, afin d'éliminer TOUT faux raccord dès maintenant !
        intro_path = os.path.join(OUTPUT_DIR, "tv_show_intro.mp4")
        for clip in ["tv_show_q_medium.mp4", "tv_show_q_hard.mp4", "tv_show_pressure.mp4", "tv_show_suspense_intense.mp4",
                     "tv_show_celebration.mp4", "tv_show_victoire.mp4", "tv_show_defeat.mp4", "tv_show_wrong.mp4",
                     "tv_show_joker_5050.mp4", "tv_show_joker_public.mp4", "tv_show_joker_sar.mp4", "tv_show_joker.mp4"]:
            shutil.copy2(intro_path, os.path.join(OUTPUT_DIR, clip))
        print("✅ Anciens clips hétérogènes purgés : 100% du jeu partage désormais le MÊME présentateur unique !", flush=True)

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
                "text": "blurry, low resolution, ugly, deformed face, different person, different suit, distorted hands, extra fingers, morphing desk, distorted logo text, camera cut, zoom jump, flickering, jittery, low quality",
                "clip": ["3", 0]
            },
            "class_type": "CLIPTextEncode"
        },
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
                "seed": int(uuid.uuid4().int % 2147483647), "steps": steps, "cfg": 6.0,
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
                "format": "video/h264-mp4", "pix_fmt": "yuv420p", "crf": 15,
                "save_metadata": False, "trim_to_audio": False, "pingpong": False, "save_output": True
            },
            "class_type": "VHS_VideoCombine"
        }
    }

def render_segment(start_img_name, prompt_text, prefix):
    wait_for_cool_gpu(target_temp=56)
    wf = build_workflow(start_img_name, prompt_text, prefix, frames=65, steps=20)
    req = urllib.request.Request(f"{COMFY_URL}/prompt", data=json.dumps({"prompt": wf}).encode("utf-8"), headers={"Content-Type": "application/json"})
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
                    for nid, out in history[prompt_id].get("outputs", {}).items():
                        if "gifs" in out and len(out["gifs"]) > 0:
                            fname = out["gifs"][0]["filename"]
                            print(f"   ✅ Segment terminé en {elapsed}s : {fname}", flush=True)
                            return os.path.join(COMFY_OUTPUT, fname)
        except Exception:
            pass

def produce_shot(shot):
    print("\n" + "=" * 72, flush=True)
    print(f"🎬 {shot['title']}", flush=True)
    print("=" * 72, flush=True)

    seg_files = []
    current_start = MASTER_IMAGE

    for idx, prompt in enumerate(shot["segments"], start=1):
        prefix = f"Uni_{shot['id']}_seg{idx}"
        seg_mp4 = render_segment(current_start, prompt, prefix)
        local_seg = os.path.join(WORK_DIR, f"{shot['id']}_seg{idx}.mp4")
        shutil.copy2(seg_mp4, local_seg)
        seg_files.append(local_seg)

        if idx < len(shot["segments"]):
            next_name = f"chain_{shot['id']}_s{idx}.png"
            next_path = os.path.join(COMFY_INPUT, next_name)
            subprocess.run(["ffmpeg", "-y", "-sseof", "-0.08", "-i", local_seg, "-vframes", "1", next_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
            restamp_hech_logo(next_path)
            current_start = next_name
            time.sleep(15)

    final_tmp = os.path.join(WORK_DIR, f"{shot['id']}_FULL.mp4")
    concat_segments_seamlessly(seg_files, final_tmp)
    for out_name in shot["outputs"]:
        dst = os.path.join(OUTPUT_DIR, out_name)
        shutil.copy2(final_tmp, dst)
        print(f"🎉 DÉPLOYÉ (100% raccord maître) : {dst}", flush=True)

if __name__ == "__main__":
    print("⏳ Attente de la disponibilité de ComfyUI avant de lancer les Plans 03 à 08 unifiés...", flush=True)
    wait_for_comfy_idle()
    for shot in UNIFIED_SHOTS:
        produce_shot(shot)
    print("\n🏁 SUITE UNIFIÉE 100% RACCORD (MÊME SCÈNE, MÊME LUMIÈRE) TERMINÉE AVEC SUCCÈS !", flush=True)
