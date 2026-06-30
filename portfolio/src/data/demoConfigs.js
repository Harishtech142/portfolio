import { Bot, Zap, Brain, Mic, Globe, Database, Mail, ShoppingCart } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   WORKFLOW HELPERS
   ══════════════════════════════════════════════════════════════════════════ */

/** Build a vertical chain of nodes with auto-positioning */
function chain(defs, startX = 60, startY = 20, gapY = 110) {
  return defs.map((d, i) => ({ ...d, x: startX + (d.offsetX ?? 0), y: startY + i * gapY, animDelay: i * 0.1 }));
}
function chainConnections(nodes) {
  return nodes.slice(0, -1).map((n, i) => ({ from: n.id, to: nodes[i+1].id, color: nodes[i+1].color }));
}

/* ═══════════════════════════════════════════════════════════════════════════
   1 · AI GMAIL AUTOMATION
   ══════════════════════════════════════════════════════════════════════════ */
const gmailNodes = chain([
  { id:'trigger', label:'Gmail Trigger', icon:'📧', color:'#EA4335', desc:'New email received via OAuth' },
  { id:'agent',   label:'AI Agent',      icon:'🤖', color:'#3B82F6', desc:'LangGraph orchestration' },
  { id:'llm',     label:'GPT-4o',        icon:'⚡', color:'#8B5CF6', desc:'OpenRouter / OpenAI inference' },
  { id:'reply',   label:'Generate Reply',icon:'✍️', color:'#06B6D4', desc:'Professional draft created' },
  { id:'send',    label:'Gmail Send',    icon:'📤', color:'#22C55E', desc:'Email delivered to recipient' },
]);

/* ═══════════════════════════════════════════════════════════════════════════
   2 · AI SALES AUTOMATION
   ══════════════════════════════════════════════════════════════════════════ */
const salesNodes = chain([
  { id:'webhook',   label:'Webhook',          icon:'🔗', color:'#F59E0B', desc:'Lead form submitted' },
  { id:'agent',     label:'AI Agent',         icon:'🤖', color:'#3B82F6', desc:'Qualifies & scores lead' },
  { id:'llm',       label:'LLM',              icon:'🧠', color:'#8B5CF6', desc:'GPT-4o response generation' },
  { id:'memory',    label:'Memory',           icon:'💾', color:'#06B6D4', desc:'Conversation history stored' },
  { id:'crm',       label:'CRM Update',       icon:'📊', color:'#10B981', desc:'HubSpot / Salesforce sync' },
  { id:'gmail',     label:'Gmail',            icon:'📧', color:'#EA4335', desc:'Personalized email sent' },
  { id:'sheets',    label:'Google Sheets',    icon:'📋', color:'#34A853', desc:'Lead data logged' },
  { id:'respond',   label:'Respond to Hook',  icon:'✅', color:'#22C55E', desc:'Confirmation returned' },
]);

/* ═══════════════════════════════════════════════════════════════════════════
   3 · N8N AUTOMATION SUITE
   ══════════════════════════════════════════════════════════════════════════ */
const n8nNodes = chain([
  { id:'trigger',  label:'Trigger',           icon:'⚡', color:'#F59E0B', desc:'Webhook / Schedule / Email' },
  { id:'agent',    label:'AI Agent',          icon:'🤖', color:'#3B82F6', desc:'Decision orchestration' },
  { id:'router',   label:'Router',            icon:'🔀', color:'#8B5CF6', desc:'Route to correct workflow' },
  { id:'process',  label:'Data Process',      icon:'⚙️', color:'#06B6D4', desc:'Transform & clean data' },
  { id:'crm',      label:'CRM / DB',          icon:'🗄️', color:'#10B981', desc:'Persist to database' },
  { id:'notify',   label:'Notifications',     icon:'🔔', color:'#F97316', desc:'Slack / Email / SMS alert' },
  { id:'done',     label:'Complete',          icon:'✅', color:'#22C55E', desc:'Workflow finished' },
]);

/* ═══════════════════════════════════════════════════════════════════════════
   4 · RAG AUTOMATION
   ══════════════════════════════════════════════════════════════════════════ */
const ragNodes = chain([
  { id:'loader',   label:'Document Loader',   icon:'📄', color:'#F59E0B', desc:'PDF / Notion / Drive / Web' },
  { id:'embed',    label:'Embedding Model',   icon:'🧬', color:'#8B5CF6', desc:'text-embedding-3-large' },
  { id:'vector',   label:'Vector Database',   icon:'🗄️', color:'#3B82F6', desc:'Pinecone / Qdrant store' },
  { id:'retriever',label:'Retriever',         icon:'🔍', color:'#06B6D4', desc:'Top-k semantic search' },
  { id:'agent',    label:'AI Agent',          icon:'🤖', color:'#10B981', desc:'Context injection + chain' },
  { id:'llm',      label:'LLM',              icon:'🧠', color:'#8B5CF6', desc:'GPT-4o answer generation' },
  { id:'memory',   label:'Memory',           icon:'💾', color:'#F97316', desc:'Chat history stored' },
  { id:'response', label:'Response',         icon:'💬', color:'#22C55E', desc:'Cited answer returned' },
]);

/* ═══════════════════════════════════════════════════════════════════════════
   5 · SAAA AI AGENT
   ══════════════════════════════════════════════════════════════════════════ */
const saaaNodes = chain([
  { id:'input',    label:'User Input',        icon:'💬', color:'#3B82F6', desc:'Task or query received' },
  { id:'planner',  label:'Task Planner',      icon:'🗓️', color:'#8B5CF6', desc:'Breaks task into sub-goals' },
  { id:'agent',    label:'SAAA Agent',        icon:'🤖', color:'#06B6D4', desc:'Multi-tool orchestration' },
  { id:'tools',    label:'Tool Router',       icon:'🔧', color:'#F59E0B', desc:'Calendar / CRM / Search' },
  { id:'llm',      label:'LLM',              icon:'🧠', color:'#10B981', desc:'GPT-4o reasoning' },
  { id:'memory',   label:'Memory',           icon:'💾', color:'#F97316', desc:'Context & history' },
  { id:'response', label:'Smart Response',   icon:'✅', color:'#22C55E', desc:'Action taken + reply sent' },
]);

/* ═══════════════════════════════════════════════════════════════════════════
   6 · VOICE AI AGENT
   ══════════════════════════════════════════════════════════════════════════ */
const voiceNodes = chain([
  { id:'mic',      label:'Microphone',        icon:'🎤', color:'#EF4444', desc:'Audio stream captured' },
  { id:'stt',      label:'Speech Recognition',icon:'👂', color:'#F59E0B', desc:'Whisper STT transcription' },
  { id:'agent',    label:'AI Agent',          icon:'🤖', color:'#3B82F6', desc:'Intent & context analysis' },
  { id:'memory',   label:'Memory',            icon:'💾', color:'#8B5CF6', desc:'Conversation history' },
  { id:'llm',      label:'LLM',              icon:'🧠', color:'#06B6D4', desc:'GPT-4o response' },
  { id:'tts',      label:'Text-to-Speech',   icon:'🔊', color:'#10B981', desc:'OpenAI TTS synthesis' },
  { id:'audio',    label:'Audio Output',     icon:'🎵', color:'#22C55E', desc:'Voice played to user' },
]);

/* ═══════════════════════════════════════════════════════════════════════════
   7 · WEB SCRAPING PIPELINE
   ══════════════════════════════════════════════════════════════════════════ */
const scrapingNodes = chain([
  { id:'url',      label:'URL Input',         icon:'🌐', color:'#3B82F6', desc:'Target URLs provided' },
  { id:'http',     label:'HTTP Request',      icon:'📡', color:'#F59E0B', desc:'Playwright headless browser' },
  { id:'extract',  label:'HTML Extractor',    icon:'⛏️', color:'#8B5CF6', desc:'DOM parsing & selection' },
  { id:'agent',    label:'AI Agent',          icon:'🤖', color:'#06B6D4', desc:'Content classification' },
  { id:'parser',   label:'AI Parser',         icon:'🧠', color:'#10B981', desc:'GPT-4o data extraction' },
  { id:'format',   label:'Formatter',         icon:'📐', color:'#F97316', desc:'Clean & structure data' },
  { id:'export',   label:'Export',            icon:'📦', color:'#22C55E', desc:'CSV / Sheets / Database' },
]);

/* ═══════════════════════════════════════════════════════════════════════════
   REPLY GENERATORS  (keyword-based simulation)
   ══════════════════════════════════════════════════════════════════════════ */

function matchKey(text, ...keys) {
  const t = text.toLowerCase();
  return keys.some(k => t.includes(k));
}

export const demoConfigs = {

  /* ─── Gmail ─────────────────────────────────────────────────────────────── */
  'gmail-demo': {
    title: 'AI Gmail Assistant',
    subtitle: 'Online · Powered by GPT-4o',
    avatarIcon: Mail,
    accentColor: '#EA4335',
    accentColor2: '#F97316',
    projectId: 'gmail-demo',
    initialMessage: "👋 Hi! I'm your AI Gmail Assistant. Send me an email to reply to and I'll generate a professional response instantly.\n\nTry: \"Reply to: Hi, can we schedule a meeting tomorrow?\"",
    suggestions: ['Reply to: Hi, can we schedule a meeting?', 'Reply to: What is your pricing?', 'Draft a follow-up email'],
    getReply: (text) => {
      if (matchKey(text, 'meeting', 'schedule', 'call')) {
        return "✅ Email sent!\n\nHello,\n\nThank you for reaching out. Tomorrow works perfectly for me.\n\nPlease share your preferred time slot and I'll confirm immediately. Looking forward to our conversation.\n\nBest regards,\nSmartFlow Team";
      }
      if (matchKey(text, 'price', 'pricing', 'cost', 'quote')) {
        return "✅ Email sent!\n\nHello,\n\nThank you for your interest in our services.\n\nOur pricing is tailored to your specific automation needs. I'd love to schedule a quick call to understand your requirements and provide a custom quote.\n\nWould 15 minutes this week work for you?\n\nBest regards,\nSmartFlow Team";
      }
      if (matchKey(text, 'follow', 'followup', 'check')) {
        return "✅ Email sent!\n\nHello,\n\nI hope this message finds you well. I wanted to follow up on our previous conversation and see if you had any questions.\n\nI'm happy to provide any additional information you might need.\n\nLooking forward to hearing from you.\n\nBest regards,\nSmartFlow Team";
      }
      return "✅ Email sent!\n\nHello,\n\nThank you for your email. I've received your message and will respond with the appropriate information shortly.\n\nBest regards,\nSmartFlow Team";
    },
  },

  /* ─── Sales ─────────────────────────────────────────────────────────────── */
  'sales-demo': {
    title: 'AI Sales Agent',
    subtitle: 'Online · Lead Qualification Active',
    avatarIcon: ShoppingCart,
    accentColor: '#F59E0B',
    accentColor2: '#EF4444',
    projectId: 'sales-demo',
    initialMessage: "👋 Hi! I'm your AI Sales Agent. I can qualify leads, recommend products, book appointments, and update your CRM automatically.\n\nWhat can I help you with today?",
    suggestions: ['Qualify this lead: John, 50 employees, looking for automation', 'Book a demo call', 'What products do you offer?', 'Update CRM for lead #1042'],
    getReply: (text) => {
      if (matchKey(text, 'qualify', 'lead', 'prospect')) {
        return "🎯 Lead Qualification Complete!\n\n✅ Name: John\n✅ Company Size: 50 employees\n✅ Interest: Automation\n✅ Score: 87/100 (Hot Lead)\n\n📊 CRM Updated: Lead moved to \"High Priority\"\n📧 Follow-up email: Scheduled for tomorrow 9AM\n📅 Demo: Booked for this Friday 2PM\n\nAction: I've added this lead to your sales pipeline and scheduled all touchpoints automatically.";
      }
      if (matchKey(text, 'book', 'demo', 'appointment', 'call', 'schedule')) {
        return "📅 Appointment Booked!\n\n✅ Demo scheduled: This Friday, 2:00 PM\n✅ Confirmation email: Sent to lead\n✅ Calendar invite: Added to your calendar\n✅ Reminder: Set for 1 hour before\n\nCalendar link: meet.smartflow.ai/demo-friday\n\nCRM updated with appointment details.";
      }
      if (matchKey(text, 'product', 'offer', 'service', 'what')) {
        return "🚀 SmartFlow Products:\n\n1. AI Sales Automation — $299/mo\n   → Qualifies leads, sends emails, books demos\n\n2. N8N Automation Suite — $199/mo\n   → 20+ business automation workflows\n\n3. RAG Knowledge Base — $399/mo\n   → Chat with your documents\n\n4. Voice AI Agent — $499/mo\n   → Handles phone calls automatically\n\nWhich one matches your needs? I can book a personalized demo!";
      }
      if (matchKey(text, 'crm', 'update', 'record')) {
        return "📊 CRM Updated Successfully!\n\n✅ Contact record: Updated\n✅ Last interaction: Logged\n✅ Stage: Moved to \"Interested\"\n✅ Next action: Follow-up in 3 days\n✅ Notes: Added from conversation\n\nYour sales pipeline is always up to date — automatically.";
      }
      return "Great question! As your AI Sales Agent, I can:\n\n• Qualify leads instantly\n• Book demo calls automatically\n• Send personalized follow-ups\n• Update your CRM in real-time\n• Generate proposals on demand\n\nWhat would you like me to handle for you?";
    },
  },

  /* ─── N8N Suite ──────────────────────────────────────────────────────────── */
  'n8n-demo': {
    title: 'N8N Automation Assistant',
    subtitle: 'Online · 20+ Workflows Ready',
    avatarIcon: Zap,
    accentColor: '#F59E0B',
    accentColor2: '#EA5834',
    projectId: 'n8n-demo',
    initialMessage: "⚡ Hi! I'm your N8N Automation Assistant. I can help you automate any business workflow.\n\nAsk me about email automation, lead management, CRM sync, data processing, or any other automation.",
    suggestions: ['Automate my email marketing', 'Set up lead management', 'Sync my CRM automatically', 'Process invoices with AI'],
    getReply: (text) => {
      if (matchKey(text, 'email', 'marketing', 'newsletter')) {
        return "📧 Email Automation Workflow Created!\n\nWorkflow: Email Marketing Automation\n\n✅ Node 1: Schedule Trigger (every Monday 9AM)\n✅ Node 2: Fetch subscribers from database\n✅ Node 3: AI Agent — personalize content\n✅ Node 4: Gmail — send personalized emails\n✅ Node 5: Track opens & clicks\n✅ Node 6: Update CRM with engagement\n\nStatus: Active & running\nEstimated time saved: 8 hours/week";
      }
      if (matchKey(text, 'lead', 'management', 'prospect')) {
        return "🎯 Lead Management Workflow Active!\n\n✅ Capture: Form submissions → N8N webhook\n✅ Enrich: Apollo.io API for company data\n✅ Score: AI Agent scores 0-100\n✅ Route: Hot → Sales, Warm → Nurture\n✅ CRM: Auto-create contact in HubSpot\n✅ Email: Personalized outreach sent\n✅ Slack: Alert sales team instantly\n\nTime to first contact: < 2 minutes";
      }
      if (matchKey(text, 'crm', 'sync', 'salesforce', 'hubspot')) {
        return "🔄 CRM Sync Workflow Running!\n\n✅ Source: Your database / spreadsheet\n✅ Transform: Clean & standardize data\n✅ Deduplicate: Remove duplicate contacts\n✅ Sync: Bidirectional CRM update\n✅ Notify: Slack alert on conflicts\n✅ Log: All changes tracked\n\nLast sync: 2 minutes ago\nRecords processed: 1,247\nErrors: 0";
      }
      if (matchKey(text, 'invoice', 'billing', 'payment')) {
        return "🧾 Invoice Automation Workflow!\n\n✅ Trigger: New order in Shopify/WooCommerce\n✅ AI Agent: Extract order details\n✅ Generate: PDF invoice with your branding\n✅ Send: Email to customer automatically\n✅ Record: Log in QuickBooks/Xero\n✅ Follow-up: Payment reminder after 7 days\n\nTime saved: 3 hours/day";
      }
      return "⚡ I can automate that for you!\n\nN8N Automation Suite covers:\n• Email marketing & campaigns\n• Lead capture & management\n• CRM sync & updates\n• Data processing & ETL\n• Invoice & billing automation\n• Slack/Teams notifications\n• Database synchronization\n\nWhich workflow would you like to set up?";
    },
  },

  /* ─── RAG ────────────────────────────────────────────────────────────────── */
  'rag-demo': {
    title: 'RAG Knowledge Assistant',
    subtitle: 'Online · Knowledge Base Active',
    avatarIcon: Brain,
    accentColor: '#8B5CF6',
    accentColor2: '#3B82F6',
    projectId: 'rag-demo',
    initialMessage: "🧠 Hi! I'm your RAG AI Assistant. I can search your business knowledge base and give context-aware answers with citations.\n\nAsk me anything about your documents, policies, or knowledge base.",
    suggestions: ['What is our refund policy?', 'Summarize the Q3 report', 'Find information about product X', 'Search for pricing guidelines'],
    getReply: (text) => {
      if (matchKey(text, 'refund', 'return', 'policy')) {
        return "🔍 Knowledge Retrieved!\n\n📄 Source: company-policies/refund-policy.pdf (Page 3)\n📊 Similarity: 94.7%\n\n**Refund Policy Summary:**\n\nCustomers may request a full refund within 30 days of purchase. Refunds are processed within 5-7 business days.\n\n• Digital products: 14-day refund window\n• Annual subscriptions: Pro-rated refund\n• Enterprise plans: Contact support\n\n*Based on document last updated: Jan 2024*";
      }
      if (matchKey(text, 'q3', 'report', 'quarterly', 'revenue', 'summary')) {
        return "🔍 Document Retrieved!\n\n📄 Source: reports/q3-2024-report.pdf\n📊 Similarity: 91.2%\n\n**Q3 2024 Highlights:**\n\n• Revenue: $2.4M (+34% YoY)\n• New customers: 127\n• Churn rate: 2.1%\n• NPS Score: 72\n• Top product: AI Sales Automation\n\nKey insight: Enterprise tier grew 58% — focus for Q4.\n\n*Source: Executive Summary, Page 1*";
      }
      if (matchKey(text, 'price', 'pricing', 'cost', 'plan')) {
        return "🔍 Knowledge Retrieved!\n\n📄 Source: sales/pricing-guidelines.pdf\n📊 Similarity: 96.3%\n\n**Current Pricing Tiers:**\n\n• Starter: $99/mo — 3 workflows\n• Professional: $299/mo — unlimited workflows\n• Enterprise: Custom pricing\n\nDiscount authority:\n• Up to 10%: Sales rep\n• Up to 25%: Sales manager\n• Above 25%: Requires VP approval\n\n*Guidelines updated: March 2024*";
      }
      return "🔍 Searching knowledge base...\n\n📄 Found 3 relevant documents\n📊 Avg similarity: 88.4%\n\nBased on your question, I found related information in your knowledge base. The most relevant context suggests:\n\nYour knowledge base contains information across policies, reports, product docs, and procedures. For best results, ask specific questions about topics you've uploaded.\n\n💡 Tip: Upload your PDFs, Notion pages, or Google Docs to get precise answers with citations.";
    },
  },

  /* ─── SAAA ───────────────────────────────────────────────────────────────── */
  'saaa-demo': {
    title: 'SAAA — Smart AI Agent',
    subtitle: 'Online · Multi-task Mode',
    avatarIcon: Bot,
    accentColor: '#06B6D4',
    accentColor2: '#3B82F6',
    projectId: 'saaa-demo',
    initialMessage: "🤖 Hi! I'm SAAA — your Smart AI Automation Assistant Agent. I can handle multiple business tasks autonomously.\n\nTask automation, scheduling, customer queries, decisions — just tell me what you need.",
    suggestions: ['Schedule a team meeting for Friday', 'Analyze my sales data', 'Handle this customer complaint', 'Create a weekly report'],
    getReply: (text) => {
      if (matchKey(text, 'schedule', 'meeting', 'calendar', 'book')) {
        return "📅 Task Complete: Meeting Scheduled\n\n✅ Analyzed team availability\n✅ Found optimal slot: Friday 2PM\n✅ Sent calendar invites to all attendees\n✅ Created Zoom/Meet link\n✅ Set reminder: 1 hour before\n✅ Added agenda template\n✅ Slack notification sent to team\n\nMeeting ID: SF-2024-1089\nAll 5 attendees confirmed ✓";
      }
      if (matchKey(text, 'analyze', 'analysis', 'data', 'sales', 'report')) {
        return "📊 Analysis Complete!\n\n✅ Pulled data from CRM (1,247 records)\n✅ Cleaned and normalized dataset\n✅ Applied AI pattern recognition\n\n**Key Insights:**\n• Best performing product: AI Sales Agent (+42%)\n• Top region: Mumbai & Bangalore\n• Conversion rate: 23% (↑ from 18%)\n• Avg deal size: ₹85,000\n• Pipeline at risk: 3 deals (₹2.1L)\n\n📧 Full report emailed to you";
      }
      if (matchKey(text, 'complaint', 'issue', 'problem', 'customer', 'support')) {
        return "🛠️ Customer Issue Handled!\n\n✅ Analyzed complaint sentiment: Frustrated\n✅ Checked customer history: 2-year client\n✅ Identified root cause: Billing error\n✅ Generated resolution plan\n✅ Drafted apology + solution email\n✅ Issued 15% discount code: SF-SORRY-15\n✅ Escalated to support: Ticket #4892\n✅ Follow-up scheduled: 48 hours\n\nCustomer satisfaction prediction: 87%";
      }
      return "🤖 SAAA Agent Ready!\n\nI can autonomously handle:\n\n• 📅 Scheduling & calendar management\n• 📊 Data analysis & reporting\n• 💬 Customer query resolution\n• 🔧 Task automation & delegation\n• 📋 Decision support with reasoning\n• 🎯 Smart business recommendations\n• 📧 Email drafting & sending\n\nWhat task should I tackle first?";
    },
  },

  /* ─── Voice ──────────────────────────────────────────────────────────────── */
  'voice-demo': {
    title: 'Voice AI Agent',
    subtitle: 'Online · Voice Processing Ready',
    avatarIcon: Mic,
    accentColor: '#EF4444',
    accentColor2: '#F97316',
    projectId: 'voice-demo',
    initialMessage: "🎤 Voice AI Agent active! In production this handles real phone calls — here you can type to simulate voice interactions.\n\nI understand natural language and respond like a human assistant.",
    suggestions: ['Hi, I want to know your pricing', 'Book a meeting for tomorrow', 'What services do you offer?', 'I need help with my account'],
    getReply: (text) => {
      if (matchKey(text, 'price', 'pricing', 'cost', 'how much')) {
        return "🎤 [Voice Response Transcribed]\n\n\"Hello! Thank you for calling SmartFlow.\n\nOur AI automation solutions start from ₹15,000 per month for the Starter package, which includes 3 custom workflows.\n\nThe Professional plan at ₹25,000 per month gives you unlimited workflows and priority support.\n\nWould you like me to schedule a free demo call where I can walk you through everything in detail?\"\n\n🔊 Response sent via TTS\n⏱ Latency: 280ms";
      }
      if (matchKey(text, 'book', 'meeting', 'demo', 'call', 'schedule', 'tomorrow')) {
        return "🎤 [Voice Response Transcribed]\n\n\"Absolutely! I'd love to set up a demo for you.\n\nI have availability tomorrow at 10 AM, 2 PM, and 4 PM. Which time works best for you?\"\n\n[User selects 2 PM]\n\n\"Perfect! I've booked your demo for tomorrow at 2 PM. You'll receive a confirmation email with the meeting link shortly. Is there anything specific you'd like us to cover?\"\n\n🔊 Response sent via TTS\n📅 Calendar: Updated automatically";
      }
      if (matchKey(text, 'service', 'offer', 'what', 'do you')) {
        return "🎤 [Voice Response Transcribed]\n\n\"Great question! SmartFlow specializes in AI automation solutions.\n\nWe build AI agents that automate your sales process, handle customer support calls just like I'm doing now, manage your email communications, and create intelligent workflows that save your team hours every day.\n\nOur clients typically save 20-40 hours per week. Would you like to hear a specific use case relevant to your business?\"\n\n🔊 Response sent via TTS\n⏱ Latency: 245ms";
      }
      return "🎤 [Voice Response Transcribed]\n\n\"Thank you for calling SmartFlow! I'm your AI voice assistant.\n\nI can help you with pricing information, booking demos, answering product questions, or connecting you with our team.\n\nIn a real deployment, I handle these conversations completely autonomously — 24/7, in 12 languages, with under 300ms response time.\n\nHow can I assist you today?\"\n\n🔊 Response sent via TTS";
    },
  },

  /* ─── Scraping ───────────────────────────────────────────────────────────── */
  'scraping-demo': {
    title: 'Web Scraping AI Agent',
    subtitle: 'Online · Extraction Engine Ready',
    avatarIcon: Globe,
    accentColor: '#10B981',
    accentColor2: '#06B6D4',
    projectId: 'scraping-demo',
    initialMessage: "🌐 Hi! I'm your Web Scraping AI Agent. Give me any website URL and I'll extract, clean, and structure the data automatically.\n\nI can export to CSV, Google Sheets, or any database.",
    suggestions: ['Scrape product prices from amazon.com', 'Extract leads from LinkedIn', 'Get all emails from a website', 'Scrape competitor data'],
    getReply: (text) => {
      if (matchKey(text, 'amazon', 'product', 'price', 'ecommerce', 'shop')) {
        return "🌐 Scraping Complete!\n\nURL: amazon.com/search?q=automation\n\n✅ Pages scraped: 5\n✅ Products extracted: 127\n✅ Data cleaned by AI\n✅ Duplicates removed: 12\n\n**Sample Data:**\n• Product: N8N Pro License — $299\n• Product: Zapier Business — $149/mo\n• Product: Make.com Pro — $9/mo\n\n📊 Exported to: Google Sheets\n📁 CSV download: Ready\n🗄️ Database: Saved to Supabase\n\nTotal time: 43 seconds";
      }
      if (matchKey(text, 'linkedin', 'lead', 'contact', 'email')) {
        return "🌐 Lead Extraction Complete!\n\n✅ Profile data extracted\n✅ AI filtered: Decision makers only\n✅ Emails enriched via Apollo.io\n✅ Phone numbers verified\n\n**Extracted (Sample):**\n• John Smith, CTO — john@company.com\n• Sarah Lee, VP Sales — sarah@firm.com\n• Raj Kumar, Founder — raj@startup.in\n\n📊 Total leads: 234\n✅ Verified emails: 189 (81%)\n📁 Exported to Google Sheets + CRM";
      }
      if (matchKey(text, 'competitor', 'competitor data', 'monitor')) {
        return "🌐 Competitor Analysis Complete!\n\n✅ Websites monitored: 5 competitors\n✅ Data points extracted: 1,847\n✅ AI analysis applied\n\n**Insights:**\n• Competitor A raised prices 12% this month\n• Competitor B launched new feature (detected)\n• Your pricing: 8% below market average\n• Market gap: No competitor offers Voice AI\n\n📧 Weekly report: Emailed to you\n🔔 Alert: Set for price changes\n📊 Dashboard: Updated";
      }
      return "🌐 Ready to scrape!\n\nI can extract data from:\n\n• E-commerce sites (prices, products)\n• Business directories (leads, contacts)\n• News sites (articles, headlines)\n• Job boards (postings, companies)\n• Social profiles (public data)\n• Any website with public data\n\nWhat would you like me to scrape?\n\nJust give me a URL or describe what data you need!";
    },
  },
};

/* ─── Workflow node definitions (exported for WorkflowViewerModal + WorkflowPage) ─── */
function toSteps(nodes) {
  return nodes.map((n, i) => ({ n: i + 1, label: n.label, desc: n.desc, color: n.color }));
}

export const workflowConfigs = {
  'gmail-workflow':    { title:'Gmail Automation Workflow', subtitle:'N8N · Gmail API · GPT-4o', nodes: gmailNodes,    connections: chainConnections(gmailNodes), downloadImage: '/workflows/gmail-workflow.png', steps: toSteps(gmailNodes) },
  'sales-workflow':   { title:'Sales Automation Workflow', subtitle:'N8N · CRM · Gmail · GPT-4o', nodes: salesNodes,   connections: chainConnections(salesNodes), downloadImage: '/workflows/sales-workflow.png', steps: toSteps(salesNodes) },
  'n8n-workflow':     { title:'N8N Automation Suite',      subtitle:'N8N · AI Agent · Multi-workflow', nodes: n8nNodes,  connections: chainConnections(n8nNodes), downloadImage: '/workflows/n8n-workflow.png', steps: toSteps(n8nNodes) },
  'rag-workflow':     { title:'RAG Pipeline Workflow',      subtitle:'LangChain · Pinecone · GPT-4o', nodes: ragNodes,  connections: chainConnections(ragNodes), downloadImage: '/workflows/rag-workflow.png', steps: toSteps(ragNodes) },
  'saaa-workflow':    { title:'SAAA Agent Workflow',        subtitle:'LangGraph · Multi-tool · GPT-4o', nodes: saaaNodes, connections: chainConnections(saaaNodes), downloadImage: '/workflows/saaa-workflow.png', steps: toSteps(saaaNodes) },
  'voice-workflow':   { title:'Voice AI Agent Workflow',   subtitle:'Whisper · GPT-4o · TTS · Twilio', nodes: voiceNodes, connections: chainConnections(voiceNodes), downloadImage: '/workflows/voice-workflow.png', steps: toSteps(voiceNodes) },
  'scraping-workflow':{ title:'Web Scraping Pipeline',     subtitle:'Playwright · GPT-4o · Supabase', nodes: scrapingNodes, connections: chainConnections(scrapingNodes), downloadImage: '/workflows/scraping-workflow.png', steps: toSteps(scrapingNodes) },
};
