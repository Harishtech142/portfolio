"""
Generates static, downloadable workflow diagram images for the Workflow Viewer page.
Run once at build/content-update time — these are static assets, not runtime-generated.
Node data here mirrors src/data/demoConfigs.js; if you add/edit a workflow there,
update the matching entry below and re-run this script.
"""
from PIL import Image, ImageDraw, ImageFont
import os

OUT_DIR = "public/workflows"
os.makedirs(OUT_DIR, exist_ok=True)

W = 1000
NODE_W, NODE_H = 640, 92
GAP_Y = 132
TOP_PAD = 170
SIDE_PAD = (W - NODE_W) // 2

FONT_DIR = "/usr/share/fonts/truetype/dejavu"
EMOJI_FONT = "/usr/share/fonts/truetype/noto/NotoColorEmoji.ttf"

f_title = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 34)
f_subtitle = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans.ttf", 18)
f_node_label = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 22)
f_node_desc = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans.ttf", 16)
f_step_num = ImageFont.truetype(f"{FONT_DIR}/DejaVuSans-Bold.ttf", 20)
try:
    f_emoji = ImageFont.truetype(EMOJI_FONT, 32)
except Exception:
    f_emoji = f_node_label

BG = (10, 10, 18)
GRID = (255, 255, 255, 10)


def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def draw_grid(draw, w, h):
    for x in range(0, w, 28):
        draw.line([(x, 0), (x, h)], fill=(255, 255, 255, 6), width=1)
    for y in range(0, h, 28):
        draw.line([(0, y), (w, y)], fill=(255, 255, 255, 6), width=1)


def render_workflow(filename, title, subtitle, nodes):
    """nodes: list of dicts with id, label, icon, color (hex), desc"""
    n = len(nodes)
    height = TOP_PAD + n * GAP_Y + 60

    img = Image.new("RGBA", (W, height), BG + (255,))
    draw = ImageDraw.Draw(img, "RGBA")

    # Subtle dot grid background, consistent with the in-app canvas style.
    for x in range(0, W, 24):
        for y in range(0, height, 24):
            draw.ellipse([x, y, x + 1, y + 1], fill=(255, 255, 255, 12))

    # Header
    draw.text((SIDE_PAD, 36), title, font=f_title, fill=(255, 255, 255))
    draw.text((SIDE_PAD, 84), subtitle, font=f_subtitle, fill=(150, 150, 165))
    draw.line([(SIDE_PAD, 124), (SIDE_PAD + NODE_W, 124)], fill=(255, 255, 255, 30), width=1)

    centers = []
    for i, node in enumerate(nodes):
        x0 = SIDE_PAD
        y0 = TOP_PAD + i * GAP_Y
        x1 = x0 + NODE_W
        y1 = y0 + NODE_H
        cx = (x0 + x1) // 2
        centers.append((cx, y0, y1))
        color = hex_to_rgb(node["color"])

        # Connector to previous node
        if i > 0:
            prev_cx, _, prev_y1 = centers[i - 1]
            mid_y = (prev_y1 + y0) // 2
            draw.line([(prev_cx, prev_y1), (prev_cx, mid_y)], fill=color + (120,), width=3)
            draw.line([(prev_cx, mid_y), (cx, mid_y)], fill=color + (120,), width=3)
            draw.line([(cx, mid_y), (cx, y0)], fill=color + (120,), width=3)
            # arrowhead
            draw.polygon([(cx - 6, y0 - 10), (cx + 6, y0 - 10), (cx, y0)], fill=color + (200,))

        # Node card background with colored top bar
        radius = 14
        draw.rounded_rectangle([x0, y0, x1, y1], radius=radius,
                                fill=color + (24,), outline=color + (120,), width=2)
        draw.rounded_rectangle([x0, y0, x1, y0 + 6], radius=radius, fill=color + (255,))

        # Step number badge
        badge_r = 16
        bx, by = x0 + 28, y0 + NODE_H // 2
        draw.ellipse([bx - badge_r, by - badge_r, bx + badge_r, by + badge_r],
                     fill=color + (50,), outline=color + (255,), width=2)
        num_text = str(i + 1)
        bbox = draw.textbbox((0, 0), num_text, font=f_step_num)
        draw.text((bx - (bbox[2]-bbox[0])/2, by - (bbox[3]-bbox[1])/2 - bbox[1]),
                  num_text, font=f_step_num, fill=(255, 255, 255))

        # Label + description
        tx = bx + badge_r + 18
        draw.text((tx, y0 + 16), node["label"], font=f_node_label, fill=(255, 255, 255))
        draw.text((tx, y0 + 46), node["desc"], font=f_node_desc, fill=tuple(min(255, c + 60) for c in color))

    # Footer watermark
    draw.text((SIDE_PAD, height - 36), "SmartFlow \u00b7 Automation Workflow", font=f_subtitle, fill=(255, 255, 255, 60))

    img.convert("RGB").save(f"{OUT_DIR}/{filename}", "PNG", optimize=True)
    print(f"saved {filename} ({W}x{height})")


# ── Workflow definitions (mirrors src/data/demoConfigs.js) ──────────────────

WORKFLOWS = {
    "gmail-workflow.png": (
        "Gmail Automation Workflow", "N8N \u00b7 Gmail API \u00b7 GPT-4o",
        [
            {"label": "Gmail Trigger", "color": "#EA4335", "desc": "New email received via OAuth"},
            {"label": "AI Agent", "color": "#3B82F6", "desc": "LangGraph orchestration"},
            {"label": "GPT-4o", "color": "#8B5CF6", "desc": "OpenRouter / OpenAI inference"},
            {"label": "Generate Reply", "color": "#06B6D4", "desc": "Professional draft created"},
            {"label": "Gmail Send", "color": "#22C55E", "desc": "Email delivered to recipient"},
        ],
    ),
    "sales-workflow.png": (
        "Sales Automation Workflow", "N8N \u00b7 CRM \u00b7 Gmail \u00b7 GPT-4o",
        [
            {"label": "Webhook", "color": "#F59E0B", "desc": "Lead form submitted"},
            {"label": "AI Agent", "color": "#3B82F6", "desc": "Qualifies & scores lead"},
            {"label": "LLM", "color": "#8B5CF6", "desc": "GPT-4o response generation"},
            {"label": "Memory", "color": "#06B6D4", "desc": "Conversation history stored"},
            {"label": "CRM Update", "color": "#10B981", "desc": "HubSpot / Salesforce sync"},
            {"label": "Gmail", "color": "#EA4335", "desc": "Personalized email sent"},
            {"label": "Google Sheets", "color": "#34A853", "desc": "Lead data logged"},
            {"label": "Respond to Hook", "color": "#22C55E", "desc": "Confirmation returned"},
        ],
    ),
    "n8n-workflow.png": (
        "N8N Automation Suite", "N8N \u00b7 AI Agent \u00b7 Multi-workflow",
        [
            {"label": "Trigger", "color": "#F59E0B", "desc": "Webhook / Schedule / Email"},
            {"label": "AI Agent", "color": "#3B82F6", "desc": "Decision orchestration"},
            {"label": "Router", "color": "#8B5CF6", "desc": "Route to correct workflow"},
            {"label": "Data Process", "color": "#06B6D4", "desc": "Transform & clean data"},
            {"label": "CRM / DB", "color": "#10B981", "desc": "Persist to database"},
            {"label": "Notifications", "color": "#F97316", "desc": "Slack / Email / SMS alert"},
            {"label": "Complete", "color": "#22C55E", "desc": "Workflow finished"},
        ],
    ),
    "rag-workflow.png": (
        "RAG Pipeline Workflow", "LangChain \u00b7 Pinecone \u00b7 GPT-4o",
        [
            {"label": "Document Loader", "color": "#F59E0B", "desc": "PDF / Notion / Drive / Web"},
            {"label": "Embedding Model", "color": "#8B5CF6", "desc": "text-embedding-3-large"},
            {"label": "Vector Database", "color": "#3B82F6", "desc": "Pinecone / Qdrant store"},
            {"label": "Retriever", "color": "#06B6D4", "desc": "Top-k semantic search"},
            {"label": "AI Agent", "color": "#10B981", "desc": "Context injection + chain"},
            {"label": "LLM", "color": "#8B5CF6", "desc": "GPT-4o answer generation"},
            {"label": "Memory", "color": "#F97316", "desc": "Chat history stored"},
            {"label": "Response", "color": "#22C55E", "desc": "Cited answer returned"},
        ],
    ),
    "saaa-workflow.png": (
        "SAAA Agent Workflow", "LangGraph \u00b7 Multi-tool \u00b7 GPT-4o",
        [
            {"label": "User Input", "color": "#3B82F6", "desc": "Task or query received"},
            {"label": "Task Planner", "color": "#8B5CF6", "desc": "Breaks task into sub-goals"},
            {"label": "SAAA Agent", "color": "#06B6D4", "desc": "Multi-tool orchestration"},
            {"label": "Tool Router", "color": "#F59E0B", "desc": "Calendar / CRM / Search"},
            {"label": "LLM", "color": "#10B981", "desc": "GPT-4o reasoning"},
            {"label": "Memory", "color": "#F97316", "desc": "Context & history"},
            {"label": "Smart Response", "color": "#22C55E", "desc": "Action taken + reply sent"},
        ],
    ),
    "voice-workflow.png": (
        "Voice AI Agent Workflow", "Whisper \u00b7 GPT-4o \u00b7 TTS",
        [
            {"label": "Microphone", "color": "#EF4444", "desc": "Audio stream captured"},
            {"label": "Speech Recognition", "color": "#F59E0B", "desc": "Whisper STT transcription"},
            {"label": "AI Agent", "color": "#3B82F6", "desc": "Intent & context analysis"},
            {"label": "Memory", "color": "#8B5CF6", "desc": "Conversation history"},
            {"label": "LLM", "color": "#06B6D4", "desc": "GPT-4o response"},
            {"label": "Text-to-Speech", "color": "#10B981", "desc": "OpenAI TTS synthesis"},
            {"label": "Audio Output", "color": "#22C55E", "desc": "Voice played to user"},
        ],
    ),
    "scraping-workflow.png": (
        "Web Scraping Pipeline", "Playwright \u00b7 GPT-4o \u00b7 Export",
        [
            {"label": "URL Input", "color": "#3B82F6", "desc": "Target URLs provided"},
            {"label": "HTTP Request", "color": "#F59E0B", "desc": "Playwright headless browser"},
            {"label": "HTML Extractor", "color": "#8B5CF6", "desc": "DOM parsing & selection"},
            {"label": "AI Agent", "color": "#06B6D4", "desc": "Content classification"},
            {"label": "AI Parser", "color": "#10B981", "desc": "GPT-4o data extraction"},
            {"label": "Formatter", "color": "#F97316", "desc": "Clean & structure data"},
            {"label": "Export", "color": "#22C55E", "desc": "CSV / Sheets / Database"},
        ],
    ),
}

for filename, (title, subtitle, nodes) in WORKFLOWS.items():
    render_workflow(filename, title, subtitle, nodes)

print("\nAll workflow images generated in", OUT_DIR)
