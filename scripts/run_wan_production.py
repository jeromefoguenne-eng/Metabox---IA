"""
Robust Wan 2.1 Video Generation & Animation Pipeline for Métabox IA
Uses ComfyUI API with reliable HTTP history polling and FFmpeg web-optimization.
"""

import os
import sys
import json
import time
import uuid
import argparse
import urllib.request
import urllib.parse
import subprocess

try:
    if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

COMFY_URL = "http://127.0.0.1:8188"
SOURCES_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\videos\sources"
OUTPUT_DIR = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\public\videos"
FFMPEG_EXE = r"E:\ComfyUI\venv\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win64-v4.2.2.exe"

os.makedirs(OUTPUT_DIR, exist_ok=True)


def upload_image(filepath: str) -> str:
    filename = os.path.basename(filepath)
    boundary = "----WebKitFormBoundary" + uuid.uuid4().hex
    with open(filepath, "rb") as f:
        data = f.read()

    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="image"; filename="{filename}"\r\n'
        f"Content-Type: image/jpeg\r\n\r\n"
    ).encode("utf-8") + data + f"\r\n--{boundary}--\r\n".encode("utf-8")

    req = urllib.request.Request(
        f"{COMFY_URL}/upload/image",
        data=body,
        headers={
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Content-Length": str(len(body))
        },
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=15.0) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        return res.get("name", filename)


def build_workflow(image_name: str, prompt: str, neg_prompt: str, model_type: str = "1.3B", width: int = 832, height: int = 480, frames: int = 49, steps: int = 20):
    seed = int(uuid.uuid4().int % 2147483647)
    
    if model_type == "14B":
        unet_name = "wan2.1_i2v_480p_14B_fp8_e4m3fn.safetensors"
        weight_dtype = "fp8_e4m3fn"
        steps = max(steps, 20)
    else:
        unet_name = "wan2.1_i2v_1.3B_bf16.safetensors"
        weight_dtype = "default"
        steps = 18

    return {
        "1": {
            "inputs": {"image": image_name, "upload": "image"},
            "class_type": "LoadImage",
            "_meta": {"title": "Source Image"}
        },
        "2": {
            "inputs": {
                "unet_name": unet_name,
                "weight_dtype": weight_dtype
            },
            "class_type": "UNETLoader",
            "_meta": {"title": f"Wan Model ({model_type})"}
        },
        "3": {
            "inputs": {
                "clip_name": "umt5_xxl_fp8_e4m3fn_scaled.safetensors",
                "type": "wan"
            },
            "class_type": "CLIPLoader",
            "_meta": {"title": "UMT5 Text Encoder"}
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
            "inputs": {
                "clip_vision": ["5", 0],
                "image": ["1", 0],
                "crop": "center"
            },
            "class_type": "CLIPVisionEncode",
            "_meta": {"title": "CLIP Vision Encode"}
        },
        "7": {
            "inputs": {"text": prompt, "clip": ["3", 0]},
            "class_type": "CLIPTextEncode",
            "_meta": {"title": "Positive Prompt"}
        },
        "8": {
            "inputs": {"text": neg_prompt, "clip": ["3", 0]},
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
                "width": width,
                "height": height,
                "length": frames,
                "batch_size": 1
            },
            "class_type": "WanImageToVideo",
            "_meta": {"title": "Wan Latent Encode"}
        },
        "10": {
            "inputs": {
                "model": ["2", 0],
                "positive": ["9", 0],
                "negative": ["9", 1],
                "latent_image": ["9", 2],
                "seed": seed,
                "steps": steps,
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
            "_meta": {"title": "Tiled VAE Decoder"}
        },
        "12": {
            "inputs": {
                "images": ["11", 0],
                "frame_rate": 16,
                "loop_count": 0,
                "filename_prefix": f"Metabox_Wan_{model_type}",
                "format": "video/h264-mp4",
                "pix_fmt": "yuv420p",
                "crf": 17,
                "save_metadata": True,
                "trim_to_audio": False,
                "pingpong": False,
                "save_output": True
            },
            "class_type": "VHS_VideoCombine",
            "_meta": {"title": "Video Combine"}
        }
    }


def render_scene(scene_id: str, prompt: str, model_type: str = "1.3B", frames: int = 49, steps: int = 20):
    source_path = os.path.join(SOURCES_DIR, f"{scene_id}.jpg")
    output_path = os.path.join(OUTPUT_DIR, f"{scene_id}.mp4")
    
    if not os.path.exists(source_path):
        print(f"❌ Image source introuvable : {source_path}")
        return False
        
    print("=" * 70)
    print(f"🎬 Rendu Vidéo Wan 2.1 ({model_type}) : {scene_id}")
    print(f"📷 Source : {source_path}")
    print(f"🎯 Prompt : {prompt[:80]}...")
    print("=" * 70)
    
    uploaded_name = upload_image(source_path)
    neg_prompt = (
        "ugly, deformed face, distorted eyes, extra fingers, mutated hands, flickering, jittery, "
        "morphing architecture, warping background, melted objects, artifacts, watermark"
    )
    workflow = build_workflow(uploaded_name, prompt, neg_prompt, model_type=model_type, width=832, height=480, frames=frames, steps=steps)
    
    client_id = str(uuid.uuid4())
    req_data = json.dumps({"prompt": workflow, "client_id": client_id}).encode("utf-8")
    req = urllib.request.Request(f"{COMFY_URL}/prompt", data=req_data, headers={"Content-Type": "application/json"}, method="POST")

    with urllib.request.urlopen(req, timeout=10.0) as resp:
        p_res = json.loads(resp.read().decode("utf-8"))
        prompt_id = p_res.get("prompt_id")
        print(f"📋 Job soumis à ComfyUI (Prompt ID: {prompt_id})")

    # Resilient HTTP Polling
    start_t = time.time()
    video_filename = None
    subfolder = ""

    print("   ⏳ Traitement en cours sur RTX 4070 Ti...")
    while True:
        try:
            with urllib.request.urlopen(f"{COMFY_URL}/history/{prompt_id}", timeout=5.0) as resp:
                hist = json.loads(resp.read().decode("utf-8"))
                if prompt_id in hist:
                    data = hist[prompt_id]
                    outputs = data.get("outputs", {})
                    for node_id, n_out in outputs.items():
                        vids = n_out.get("gifs", []) or n_out.get("videos", [])
                        if vids:
                            video_filename = vids[0].get("filename")
                            subfolder = vids[0].get("subfolder", "")
                            break
                    break
        except Exception:
            pass
            
        elapsed = int(time.time() - start_t)
        print(f"\r   ⚡ Diffusion en cours sur GPU ({elapsed}s écoulées)...", end="", flush=True)
        time.sleep(3)

    elapsed_total = time.time() - start_t
    print(f"\n   ✅ Rendu terminé en {elapsed_total:.1f}s")

    if video_filename:
        video_url = f"{COMFY_URL}/view?filename={urllib.parse.quote(video_filename)}&subfolder={urllib.parse.quote(subfolder)}&type=output"
        temp_dest = os.path.join(OUTPUT_DIR, f"temp_{scene_id}.mp4")
        urllib.request.urlretrieve(video_url, temp_dest)
        
        # Optimize with FFmpeg for web streaming (faststart, CRF 15)
        if os.path.exists(FFMPEG_EXE):
            cmd = [
                FFMPEG_EXE, "-y", "-i", temp_dest,
                "-c:v", "libx264", "-crf", "15", "-preset", "medium",
                "-pix_fmt", "yuv420p", "-movflags", "+faststart",
                output_path
            ]
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(temp_dest):
                os.remove(temp_dest)
        else:
            if os.path.exists(output_path):
                os.remove(output_path)
            os.rename(temp_dest, output_path)
            
        size_mb = os.path.getsize(output_path) / (1024 * 1024)
        print(f"   💾 Vidéo finale prête : {output_path} ({size_mb:.2f} Mo)")
        return True
    else:
        print("❌ Aucune vidéo trouvée dans l'historique.")
        return False


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--scene", type=str, default="tribunal_silence")
    parser.add_argument("--model", type=str, default="1.3B", choices=["1.3B", "14B"])
    parser.add_argument("--prompt", type=str, default="")
    args = parser.parse_args()

    prompt = args.prompt
    if not prompt:
        prompt = (
            "Masterpiece 3D animated character in Disney Pixar style, dignified judge in black judicial robe "
            "striking wooden gavel firmly onto sound block, authoritative head nod, demanding quiet in courtroom, "
            "subtle breathing, expressive eyes, dramatic lighting, fluid Pixar animation."
        )

    render_scene(args.scene, prompt, model_type=args.model)
