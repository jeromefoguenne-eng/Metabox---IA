"""
Générateur Batch Wan 2.1 14B FP8 Studio Haute Fidélité
Rendu des Réactions du Plateau TV (Célébration, Erreur, Victoire, Joker)
Avec Contrôle Thermique Actif du GPU RTX 4070 Ti (Pauses automatiques)
"""

import os
import sys
import json
import time
import uuid
import urllib.request
import subprocess

COMFY_URL = "http://127.0.0.1:8188"
OUTPUT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\videos"

REACTIONS_QUEUE = [
    {
        "output_name": "tv_show_celebration.mp4",
        "title": "Bonne Réponse / Célébration Joyeuse",
        "prefix": "Wan14B_TV_Celebration",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri the host joyfully clapping his hands with big enthusiastic smile, laughing cheerfully, "
            "background curved LED screen flashing bright golden sparks and stars, "
            "audience in tiered stadium seating on left and right enthusiastically raising hands, cheering and applauding, "
            "festive glowing studio celebration, Pixar movie climax, fluid motion, stable camera."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_wrong.mp4",
        "title": "Mauvaise Réponse / Empathie & Encouragement",
        "prefix": "Wan14B_TV_Wrong",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri the host showing warm compassionate empathy, smiling supportively, nodding head gently with open hands, "
            "audience in stadium reacting with soft sympathetic gestures, warm soft studio lighting, "
            "Pixar feature film emotion, fluid motion, stable camera."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_victoire.mp4",
        "title": "Grande Victoire 60 ECTS / Sacre Ultime",
        "prefix": "Wan14B_TV_Victoire",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri the host raising both arms high in triumphant celebration, ecstatic victory, "
            "golden sparkles and confetti bursting across the TV studio, "
            "standing ovation from the audience, radiant studio lighting, champion moment, fluid Pixar motion."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_joker.mp4",
        "title": "Joker Avis du Public / Consultation Gradins",
        "prefix": "Wan14B_TV_Joker",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri pointing to screen, turning toward audience to ask for their vote, "
            "audience members looking engaged and raising hands, studio spotlights glowing, "
            "interactive quiz show moment, fluid Pixar motion."
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

def wait_for_cool_gpu(target_temp=52):
    temp = get_gpu_temp()
    print(f"\n🌡️ Contrôle Thermique GPU : {temp}°C (Cible de reprise : <= {target_temp}°C)")
    if temp > target_temp:
        print(f"⏳ Pause de refroidissement active pour ménager le GPU...")
        while temp > target_temp:
            time.sleep(10)
            temp = get_gpu_temp()
            print(f"   ❄️ Refroidissement en cours : {temp}°C...")
        print(f"✅ GPU refroidi à {temp}°C. Prêt pour la génération suivante.")
    else:
        print(f"✅ GPU déjà tempéré à {temp}°C.")

def generate_scene(scene):
    wait_for_cool_gpu(target_temp=55)
    print(f"\n🎬 Lancement Génération 14B : {scene['title']} -> {scene['output_name']}")

    workflow = {
        "1": {
            "inputs": {
                "image": "pixar_studio_official_preview.jpg",
                "upload": "image"
            },
            "class_type": "LoadImage",
            "_meta": {"title": "Image Source"}
        },
        "2": {
            "inputs": {
                "unet_name": "wan2.1_i2v_480p_14B_fp8_e4m3fn.safetensors",
                "weight_dtype": "fp8_e4m3fn"
            },
            "class_type": "UNETLoader",
            "_meta": {"title": "Wan 2.1 14B Model (FP8)"}
        },
        "3": {
            "inputs": {
                "clip_name": "umt5_xxl_fp8_e4m3fn_scaled.safetensors",
                "type": "wan"
            },
            "class_type": "CLIPLoader",
            "_meta": {"title": "UMT5 XXL Text Encoder"}
        },
        "4": {
            "inputs": {
                "vae_name": "wan_2.1_vae.safetensors"
            },
            "class_type": "VAELoader",
            "_meta": {"title": "Wan VAE"}
        },
        "5": {
            "inputs": {
                "clip_name": "clip_vision_h.safetensors"
            },
            "class_type": "CLIPVisionLoader",
            "_meta": {"title": "CLIP Vision"}
        },
        "6": {
            "inputs": {
                "clip_vision": ["5", 0],
                "image": ["1", 0],
                "crop": "center"
            },
            "class_type": "CLIPVisionEncode",
            "_meta": {"title": "CLIP Vision Encode"}
        },
        "7": {
            "inputs": {
                "text": scene["prompt"],
                "clip": ["3", 0]
            },
            "class_type": "CLIPTextEncode",
            "_meta": {"title": "Positive Prompt"}
        },
        "8": {
            "inputs": {
                "text": (
                    "ugly, deformed face, distorted eyes, extra fingers, mutated hand, morphing clothes, melting body, "
                    "flickering, jittery, distorted set, broken architecture, low quality, artifacts, watermark, "
                    "2d drawing, cartoon outline, anime, flat shading, primitive 3d, polygon shapes"
                ),
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
                "length": scene["frames"],
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
                "steps": scene["steps"],
                "cfg": 6.0,
                "sampler_name": "uni_pc",
                "scheduler": "simple",
                "denoise": 1.0
            },
            "class_type": "KSampler",
            "_meta": {"title": "KSampler 14B"}
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
            "inputs": {
                "images": ["11", 0],
                "frame_rate": 16.0,
                "loop_count": 0,
                "filename_prefix": scene["prefix"],
                "format": "video/h264-mp4",
                "pix_fmt": "yuv420p",
                "crf": 16,
                "save_metadata": True,
                "trim_to_audio": False,
                "pingpong": False,
                "save_output": True
            },
            "class_type": "VHS_VideoCombine",
            "_meta": {"title": "Video Combine MP4"}
        }
    }

    req_data = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(f"{COMFY_URL}/prompt", data=req_data, headers={"Content-Type": "application/json"})

    with urllib.request.urlopen(req) as resp:
        res = json.loads(resp.read().decode())
        prompt_id = res["prompt_id"]

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
                                dst = os.path.join(OUTPUT_DIR, scene["output_name"])
                                import shutil
                                shutil.copy2(src, dst)
                                print(f"🎉 Terminé ({elapsed}s) : {fname} -> {dst}")
                                return True
        except Exception:
            pass
        print(f"   ⏳ [{scene['output_name']}] {elapsed}s écoulées | GPU: {temp}°C")

if __name__ == "__main__":
    for sc in REACTIONS_QUEUE:
        generate_scene(sc)
    print("\n🏁 Toutes les animations Wan 14B FP8 ont été générées avec succès !")
