"""
Générateur Haute Définition (1280x720) Storyboard Wan 2.1 14B FP8 + 4x-UltraSharp
Pour 'Qui veut gagner des crédits'
Ambiance sombre, zéro flou, synchronisation des gestes par palier de questions.
Gestion thermique GPU RTX 4070 Ti (reprise <= 54°C).
"""

import os
import sys
import json
import time
import uuid
import shutil
import urllib.request
import subprocess

COMFY_URL = "http://127.0.0.1:8188"
OUTPUT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\videos"

SCENES = [
    {
        "image": "henri_hd_plan2.jpg",
        "output_name": "tv_show_q_medium.mp4",
        "title": "Plan 2 - Paliers 4 à 7 : Réflexion Analytique & Consignes Complexes",
        "prefix": "Wan14B_HD_Plan2",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, crisp high definition, Henri host resting elbow on desk, "
            "index finger on temple in deep thoughtful analytical reflection, pointing towards the invisible question screen with intellectual expression, "
            "subtle nodding, mouth speaking carefully with pedagogic clarity, dark studio background, fluid Pixar motion."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "image": "henri_hd_plan3.jpg",
        "output_name": "tv_show_q_hard.mp4",
        "title": "Plan 3 - Paliers 8 à 10 : Suspense Ultime & Sommet de la Pyramide",
        "prefix": "Wan14B_HD_Plan3",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, crisp high definition, extreme high stakes game show tension, "
            "Henri host leaning forward over desk with hands clasped firmly together, piercing intense gaze into the camera asking the decisive final question, "
            "serious grave mouth animation speaking crucial line, dark dramatic lighting with vertical blue beams, heart-pounding suspense, fluid motion."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "image": "henri_hd_plan4.jpg",
        "output_name": "tv_show_victoire.mp4",
        "title": "Plan 4 - Célébration Suprême & Victoire 60 ECTS",
        "prefix": "Wan14B_HD_Plan4",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, crisp high definition, euphoric victory celebration, "
            "Henri host laughing with huge joyful smile, triumphantly raising the golden HECh trophy high in both hands, "
            "golden confetti rain and bright sparkling spotlights, audience standing and cheering in celebration, fluid Pixar motion."
        ),
        "steps": 20,
        "frames": 33
    }
]

def get_gpu_temp():
    try:
        out = subprocess.check_output(
            ["nvidia-smi", "--query-gpu=temperature.gpu", "--format=csv,noheader,nounits"],
            encoding="utf-8"
        )
        return int(out.strip())
    except Exception:
        return 45

def wait_for_cool_gpu(target_temp=54):
    temp = get_gpu_temp()
    print(f"\n🌡️ Contrôle Thermique GPU : {temp}°C (Cible de reprise : <= {target_temp}°C)")
    if temp > target_temp:
        print(f"⏳ Pause de refroidissement active pour préserver la RTX 4070 Ti...")
        while temp > target_temp:
            time.sleep(10)
            temp = get_gpu_temp()
            print(f"   ❄️ Température actuelle : {temp}°C...")
        print(f"✅ GPU refroidi à {temp}°C. Reprise de la production.")
    else:
        print(f"✅ GPU déjà tempéré à {temp}°C.")

def build_workflow(sc):
    return {
        "1": {
            "inputs": {"image": sc["image"], "upload": "image"},
            "class_type": "LoadImage",
            "_meta": {"title": "Image Source"}
        },
        "2": {
            "inputs": {"unet_name": "wan2.1_i2v_480p_14B_fp8_e4m3fn.safetensors", "weight_dtype": "fp8_e4m3fn"},
            "class_type": "UNETLoader",
            "_meta": {"title": "Wan 2.1 14B"}
        },
        "3": {
            "inputs": {"clip_name": "umt5_xxl_fp8_e4m3fn_scaled.safetensors", "type": "wan"},
            "class_type": "CLIPLoader",
            "_meta": {"title": "Text Encoder"}
        },
        "4": {
            "inputs": {"vae_name": "wan_2.1_vae.safetensors"},
            "class_type": "VAELoader",
            "_meta": {"title": "Wan VAE"}
        },
        "5": {
            "inputs": {"clip_name": "clip_vision_h.safetensors"},
            "class_type": "CLIPVisionLoader",
            "_meta": {"title": "CLIP Vision"}
        },
        "6": {
            "inputs": {"clip_vision": ["5", 0], "image": ["1", 0], "crop": "center"},
            "class_type": "CLIPVisionEncode",
            "_meta": {"title": "CLIP Vision Encode"}
        },
        "7": {
            "inputs": {"text": sc["prompt"], "clip": ["3", 0]},
            "class_type": "CLIPTextEncode",
            "_meta": {"title": "Positive Prompt"}
        },
        "8": {
            "inputs": {
                "text": "blurry, low resolution, ugly, artifacts, 2d cartoon, flat, morphing, jittery, low quality, deformed hands, broken anatomy",
                "clip": ["3", 0]
            },
            "class_type": "CLIPTextEncode",
            "_meta": {"title": "Negative Prompt"}
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
                "length": sc["frames"],
                "batch_size": 1
            },
            "class_type": "WanImageToVideo",
            "_meta": {"title": "Wan 14B Latent"}
        },
        "10": {
            "inputs": {
                "model": ["2", 0],
                "positive": ["9", 0],
                "negative": ["9", 1],
                "latent_image": ["9", 2],
                "seed": int(uuid.uuid4().int % 2147483647),
                "steps": sc["steps"],
                "cfg": 6.0,
                "sampler_name": "uni_pc",
                "scheduler": "simple",
                "denoise": 1.0
            },
            "class_type": "KSampler",
            "_meta": {"title": "KSampler"}
        },
        "11": {
            "inputs": {
                "samples": ["10", 0],
                "vae": ["4", 0],
                "tile_size": 512,
                "overlap": 64,
                "temporal_size": 64,
                "temporal_overlap": 8
            },
            "class_type": "VAEDecodeTiled",
            "_meta": {"title": "Tiled VAE Decode"}
        },
        "12": {
            "inputs": {"model_name": "4x-UltraSharp.pth"},
            "class_type": "UpscaleModelLoader",
            "_meta": {"title": "Load 4x-UltraSharp"}
        },
        "13": {
            "inputs": {"upscale_model": ["12", 0], "image": ["11", 0]},
            "class_type": "ImageUpscaleWithModel",
            "_meta": {"title": "4x-UltraSharp Upscale"}
        },
        "14": {
            "inputs": {
                "image": ["13", 0],
                "upscale_method": "lanczos",
                "width": 1280,
                "height": 720,
                "crop": "disabled"
            },
            "class_type": "ImageScale",
            "_meta": {"title": "Scale to 720p HD"}
        },
        "15": {
            "inputs": {
                "images": ["14", 0],
                "frame_rate": 16.0,
                "loop_count": 0,
                "filename_prefix": sc["prefix"],
                "format": "video/h264-mp4",
                "pix_fmt": "yuv420p",
                "crf": 15,
                "save_metadata": True,
                "trim_to_audio": False,
                "pingpong": False,
                "save_output": True
            },
            "class_type": "VHS_VideoCombine",
            "_meta": {"title": "Encode HD Video"}
        }
    }

def render_scene(sc):
    wait_for_cool_gpu(target_temp=54)
    print(f"\n🎬 Lancement Génération HD : {sc['title']} -> {sc['output_name']}")

    wf = build_workflow(sc)
    req_data = json.dumps({"prompt": wf}).encode("utf-8")
    req = urllib.request.Request(f"{COMFY_URL}/prompt", data=req_data, headers={"Content-Type": "application/json"})

    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        prompt_id = res["prompt_id"]
    print(f"🚀 Prompt ComfyUI soumis : {prompt_id}")

    start = time.time()
    while True:
        time.sleep(5)
        elapsed = int(time.time() - start)
        temp = get_gpu_temp()
        try:
            with urllib.request.urlopen(f"{COMFY_URL}/history/{prompt_id}") as h_resp:
                history = json.loads(h_resp.read().decode())
                if prompt_id in history:
                    outputs = history[prompt_id].get("outputs", {})
                    for nid, out in outputs.items():
                        if "gifs" in out:
                            for item in out["gifs"]:
                                fname = item["filename"]
                                src = os.path.join(r"E:\ComfyUI\output", fname)
                                dst = os.path.join(OUTPUT_DIR, sc["output_name"])
                                shutil.copy2(src, dst)
                                print(f"🎉 Terminé ({elapsed}s) : {fname} -> {dst}")
                                
                                # Si c'est Plan 3, copier aussi comme suspense
                                if sc["output_name"] == "tv_show_q_hard.mp4":
                                    shutil.copy2(src, os.path.join(OUTPUT_DIR, "tv_show_suspense_intense.mp4"))
                                    shutil.copy2(src, os.path.join(OUTPUT_DIR, "tv_show_pressure.mp4"))
                                
                                return True
        except Exception:
            pass
        print(f"   ⏳ [{sc['output_name']}] {elapsed}s écoulées | GPU: {temp}°C")

if __name__ == "__main__":
    print("="*70)
    print(" Production Wan 2.1 14B FP8 HD (1280x720 + 4x-UltraSharp) - Storyboard WWTBAM")
    print("="*70)
    for sc in SCENES:
        render_scene(sc)
        print("\n❄️ Pause thermique inter-scènes de 20s...")
        time.sleep(20)
    print("\n🏁 Génération de la suite Storyboard HD terminée avec succès !")
