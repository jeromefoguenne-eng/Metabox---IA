"""
Suite Wan 2.1 14B FP8 Studio - Qui Veut Gagner des Millions
Ambiance Sombre, Oppressante, Henri Seul au Centre, Réactions du Public
Gestion Thermique Active RTX 4070 Ti (Pauses automatiques)
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
IMAGE_INPUT = "pixar_millionaire_dark_studio.jpg"

SCENES = [
    {
        "output_name": "tv_show_intro.mp4",
        "title": "1. Intro WWTBAM - Henri Seul dans le Halo Sombre",
        "prefix": "Wan14B_Milli_Intro",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri the handsome host standing alone in the center of the dark atmospheric TV studio in the style of Who Wants to Be a Millionaire, "
            "illuminated by a dramatic top-down spotlight cutting through midnight blue darkness, "
            "speaking calmly with charismatic facial animation, welcoming the contestant, gesturing smoothly with his hands towards the desk, "
            "audience sitting in the dark tiered background watching intently in anticipation, "
            "oppressive suspenseful game show ambiance, fluid natural motion, stable camera."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_pressure.mp4",
        "title": "2. Pression Psychologique - Henri se penche (Vous jouez gros)",
        "prefix": "Wan14B_Milli_Pressure",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri the host leaning forward over his illuminated desk putting psychological pressure on the player, "
            "serious intense expression, piercing eyes, hands clasped together firmly on the desk, "
            "speaking with grave focused authority, dramatic top-down spotlight beaming down into the dark moody studio, "
            "silent audience in dark shadows, tense high-stakes atmosphere, fluid motion, stable camera."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_suspense_intense.mp4",
        "title": "3. Suspense Ultime - Est-ce votre dernier mot ?",
        "prefix": "Wan14B_Milli_Suspense",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "extreme suspense moment, Henri the host scrutinizing the contestant with intense unwavering focus, "
            "asking the final crucial question, slight dramatic head tilt, mouth asking 'Is that your final answer?', "
            "the dark studio bathed in deep midnight-blue shadow, narrow bright spotlight on the host, "
            "audience holding breath in the background darkness, heart-pounding tension, fluid Pixar motion."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_focus.mp4",
        "title": "4. Écoute & Concentration - Question Intermédiaire",
        "prefix": "Wan14B_Milli_Focus",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri the host listening intently, nodding his head thoughtfully, hand on the wooden desk, "
            "calm but serious expression, dramatic spotlight in dark blue studio, audience watching quietly, "
            "fluid lifelike motion, stable camera."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_celebration.mp4",
        "title": "5. Bonne Réponse - Le Public Applaudit Debout",
        "prefix": "Wan14B_Milli_Correct",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri the host joyfully clapping his hands with big enthusiastic smile, laughing cheerfully, "
            "studio lighting suddenly beaming bright with golden and azure light beams, "
            "audience in the background standing up, cheering and applauding enthusiastically, "
            "exciting breakthrough moment, festive game show celebration, fluid motion."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_defeat.mp4",
        "title": "6. Défaite / Mauvaise Réponse - Déception Visible du Public",
        "prefix": "Wan14B_Milli_Defeat",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "dramatic defeat moment, Henri the host gravely closing eyes and shaking head slowly with compassionate sadness, "
            "in the background darkness, audience members expressing disappointment by holding their heads in hands and slumping shoulders, "
            "somber dark lighting, deep shadows, emotional loss in high-stakes game show, fluid motion."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_victoire.mp4",
        "title": "7. Sacre 60 ECTS - Triomphe Ultime et Ovation",
        "prefix": "Wan14B_Milli_Victory",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "supreme victory moment, Henri raising both arms high in triumphant celebration, euphoric smile, "
            "dazzling golden sparkles and confetti bursting across the dark studio, "
            "full standing ovation from the entire audience cheering passionately, "
            "spectacular lighting finale, 60 ECTS champion crowning moment, fluid Pixar motion."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_joker.mp4",
        "title": "8. Joker Avis Public - Henri invite la salle à voter",
        "prefix": "Wan14B_Milli_Joker",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Henri the host turning his body toward the audience in the shadows, extending his arm towards the tiered seats, "
            "inviting the audience to vote on their keypads, spotlights sweeping gently, "
            "audience members leaning forward and interacting, interactive TV moment, fluid motion."
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
        print(f"⏳ Pause de refroidissement active pour ménager la RTX 4070 Ti...")
        while temp > target_temp:
            time.sleep(8)
            temp = get_gpu_temp()
            print(f"   ❄️ Refroidissement en cours : {temp}°C...")
        print(f"✅ GPU refroidi à {temp}°C. Reprise du calcul.")
    else:
        print(f"✅ GPU déjà tempéré à {temp}°C.")

def render_scene(sc):
    wait_for_cool_gpu(target_temp=54)
    print(f"\n🎬 Lancement Génération 14B : {sc['title']} -> {sc['output_name']}")

    workflow = {
        "1": {
            "inputs": {
                "image": IMAGE_INPUT,
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
                "text": sc["prompt"],
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
                "filename_prefix": sc["prefix"],
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
                                dst = os.path.join(OUTPUT_DIR, sc["output_name"])
                                import shutil
                                shutil.copy2(src, dst)
                                print(f"🎉 Terminé ({elapsed}s) : {fname} -> {dst}")
                                return True
        except Exception:
            pass
        print(f"   ⏳ [{sc['output_name']}] {elapsed}s écoulées | GPU: {temp}°C")

if __name__ == "__main__":
    for sc in SCENES:
        render_scene(sc)
    print("\n🏁 Toutes les animations WWTBAM Wan 14B FP8 ont été générées avec succès !")
