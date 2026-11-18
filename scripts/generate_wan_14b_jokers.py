"""
Génération Wan 2.1 14B FP8 des 3 Jokers Officiels WWTBAM
1. 50/50 : Henri appuie sur le pupitre, deux faisceaux lumineux éliminent 2 choix
2. Vote du Public : Henri invite la salle, les gradins s'illuminent et le public vote
3. Appel SAR : Henri met une oreillette/écouteur, écoute le professeur et hoche la tête
Protection thermique active RTX 4070 Ti (<= 54°C)
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

JOKERS_SCENES = [
    {
        "output_name": "tv_show_joker_5050.mp4",
        "title": "Joker 1 : 50/50 - Henri appuie sur le pupitre et scinde l'écran",
        "prefix": "Wan14B_Joker_5050",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "lifeline fifty-fifty in Who Wants to Be a Millionaire dark studio, "
            "Henri the handsome host pressing a luminous neon button on his sleek curved wooden desk with a sharp decisive hand gesture, "
            "two dramatic bright azure light beams strike across the dark arena with glowing digital sparks, "
            "Henri looking up with a confident smile and reassuring nod, audience watching in silent suspense, "
            "fluid lifelike motion, stable camera, cinematic lighting."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_joker_public.mp4",
        "title": "Joker 2 : Vote du Public - Henri se tourne vers la foule en gradins",
        "prefix": "Wan14B_Joker_Public",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Ask the Audience lifeline in Who Wants to Be a Millionaire, "
            "Henri the host turning his body towards the darkened tiered audience in the background, "
            "raising his right arm inviting the crowd to vote, "
            "ambient blue spotlights gently illuminate the audience rows as spectators actively press buttons on electronic keypads, "
            "Henri smiling warmly and turning back to the desk, fluid character and crowd animation, stable camera."
        ),
        "steps": 20,
        "frames": 33
    },
    {
        "output_name": "tv_show_joker_sar.mp4",
        "title": "Joker 3 : Appel au SAR - Henri met son oreillette et écoute le professeur",
        "prefix": "Wan14B_Joker_SAR",
        "prompt": (
            "Masterpiece 3D Disney Pixar animation, stylised animated character, Pixar feature film, "
            "Phone a Friend lifeline in Who Wants to Be a Millionaire, "
            "Henri the host putting a discreet wireless earpiece into his ear with his right hand, "
            "listening with extreme concentration to the academic mentor professor on the live line, "
            "nodding thoughtfully with understanding eyes and slight encouraging smile, "
            "dramatic top-down spotlight beaming into the dark midnight-blue studio, fluid hand and facial motion, stable camera."
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

def render_joker_scene(sc):
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
            "_meta": {"title": "Video Combine H.264"}
        }
    }

    # Queue Prompt to ComfyUI
    payload = json.dumps({"prompt": workflow}).encode("utf-8")
    req = urllib.request.Request(
        f"{COMFY_URL}/prompt",
        data=payload,
        headers={"Content-Type": "application/json"}
    )
    res = urllib.request.urlopen(req)
    prompt_id = json.loads(res.read())["prompt_id"]
    print(f"🚀 Prompt ComfyUI soumis : {prompt_id}")

    # Polling & Cooldown Monitor
    start_time = time.time()
    while True:
        time.sleep(5)
        elapsed = int(time.time() - start_time)
        temp = get_gpu_temp()
        print(f"   ⏳ [{sc['output_name']}] {elapsed}s écoulées | GPU: {temp}°C")

        # Check history
        h_req = urllib.request.Request(f"{COMFY_URL}/history/{prompt_id}")
        h_res = urllib.request.urlopen(h_req)
        h_data = json.loads(h_res.read())

        if prompt_id in h_data:
            outputs = h_data[prompt_id].get("outputs", {})
            for node_id, node_out in outputs.items():
                if "gifs" in node_out and len(node_out["gifs"]) > 0:
                    video_info = node_out["gifs"][0]
                    video_fn = video_info["filename"]
                    sub = video_info.get("subfolder", "")
                    src = os.path.join(r"E:\ComfyUI\output", sub, video_fn)
                    dst = os.path.join(OUTPUT_DIR, sc["output_name"])
                    
                    # Copier la vidéo finale
                    import shutil
                    shutil.copyfile(src, dst)
                    print(f"🎉 Terminé ({elapsed}s) : {video_fn} -> {dst}")
                    return True
        
        if elapsed > 600:
            print(f"⚠️ Timeout pour {sc['output_name']}")
            return False

def main():
    print("======================================================================")
    print(" Génération Wan 2.1 14B FP8 - 3 Jokers Officiels WWTBAM")
    print("======================================================================")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for sc in JOKERS_SCENES:
        success = render_joker_scene(sc)
        if not success:
            print(f"❌ Échec lors du rendu de {sc['output_name']}")
            break
        # Pause de repos thermique obligatoire
        print("\n❄️ Pause thermique inter-scènes de 20s...")
        time.sleep(20)

    print("\n🏁 Génération des 3 Jokers WWTBAM Wan 14B terminée avec succès !")

if __name__ == "__main__":
    main()
