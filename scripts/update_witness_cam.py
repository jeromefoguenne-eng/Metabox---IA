path = r"C:\Users\TrendingPC\.gemini\antigravity\scratch\Metabox---IA\src\components\Courtroom3DCanvas.jsx"
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old_wit = """  WITNESS: {
    pos: [0.55, 1.85, -0.6],
    look: [0, 1.68, 0.72],
    fov: 32,
    label: "Plan Face Maxime"
  },"""

new_wit = """  WITNESS: {
    pos: [0.35, 2.24, -0.25],
    look: [0, 2.22, 0.72],
    fov: 32,
    label: "Plan Face Maxime"
  },"""

c = c.replace(old_wit, new_wit)
with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print("Updated witness preset successfully!")
