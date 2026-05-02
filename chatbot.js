// Abby — Self-contained chatbot widget
// Include via <script src="chatbot.js" defer></script> on any page
(function() {
  // Prevent double-init
  if (document.getElementById('chatbotToggle')) return;

  // ── Inject CSS ──
  var style = document.createElement('style');
  style.textContent = `
/* ===== CHATBOT WIDGET — Robot Head ===== */
.chatbot-btn {
  position: fixed; bottom: 6rem; right: 1.5rem; z-index: 50;
  width: 3.8rem; height: 3.8rem; border-radius: 0.85rem;
  background: var(--gradient-neon); border: none;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px hsl(var(--primary) / 0.4);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  padding: 0;
}
.chatbot-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 30px hsl(var(--primary) / 0.6);
}
/* Robot face drawn with CSS */
.robot-face {
  width: 100%; height: 100%;
  position: relative;
  display: flex; align-items: center; justify-content: center;
}
/* Antenna */
.robot-face::before {
  content: '';
  position: absolute;
  top: -7px; left: 50%;
  transform: translateX(-50%);
  width: 4px; height: 8px;
  background: #fff;
  border-radius: 2px 2px 0 0;
}
.robot-face::after {
  content: '';
  position: absolute;
  top: -12px; left: 50%;
  transform: translateX(-50%);
  width: 8px; height: 8px;
  border-radius: 50%;
  background: hsl(var(--primary));
  border: 2px solid #fff;
  animation: antennaPulse 2s ease-in-out infinite;
}
@keyframes antennaPulse {
  0%, 100% { box-shadow: 0 0 4px hsl(var(--primary) / 0.4); }
  50% { box-shadow: 0 0 12px hsl(var(--primary) / 0.9), 0 0 20px hsl(var(--primary) / 0.3); }
}
/* Eyes */
.robot-eyes {
  display: flex; gap: 0.55rem;
  position: relative; z-index: 1;
}
.robot-eye {
  width: 10px; height: 10px;
  border-radius: 3px;
  background: #fff;
  animation: robotBlink 3s ease-in-out infinite;
  box-shadow: 0 0 6px rgba(255,255,255,0.5);
}
.robot-eye:nth-child(2) { animation-delay: 0.1s; }
@keyframes robotBlink {
  0%, 42%, 48%, 100% { transform: scaleY(1); }
  45% { transform: scaleY(0.1); }
}
/* Mouth */
.robot-mouth {
  position: absolute;
  bottom: 0.6rem; left: 50%;
  transform: translateX(-50%);
  width: 16px; height: 4px;
  border-radius: 0 0 4px 4px;
  background: rgba(255,255,255,0.7);
}
/* Ear bolts */
.robot-ear {
  position: absolute;
  top: 50%; width: 5px; height: 5px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  transform: translateY(-50%);
}
.robot-ear-l { left: 3px; }
.robot-ear-r { right: 3px; }

/* Active state — show X close */
.chatbot-btn .icon-close-wrap { display: none; }
.chatbot-btn.active .robot-face { display: none; }
.chatbot-btn.active .icon-close-wrap {
  display: flex; align-items: center; justify-content: center;
}
.chatbot-btn.active { border-radius: 9999px; }
.icon-close-wrap svg { width: 1.5rem; height: 1.5rem; stroke: #fff; stroke-width: 2; fill: none; }

/* Hello bubble */
.chatbot-hello {
  position: fixed; bottom: 10.5rem; right: 1.5rem; z-index: 49;
  background: hsl(var(--card) / 0.95);
  backdrop-filter: blur(16px);
  border: 1px solid hsl(var(--primary) / 0.25);
  border-radius: 1rem 1rem 0.25rem 1rem;
  padding: 0.6rem 1rem;
  font-size: 0.82rem; font-weight: 500;
  color: hsl(var(--foreground));
  box-shadow: 0 6px 24px rgba(0,0,0,0.25);
  white-space: nowrap;
  opacity: 0; visibility: hidden;
  transform: translateY(8px) scale(0.9);
  transition: opacity 0.35s, transform 0.35s, visibility 0s 0.35s;
  pointer-events: none;
  animation: helloEntry 0.5s 3s cubic-bezier(0.16,1,0.3,1) forwards;
}
.chatbot-hello.show {
  opacity: 1; visibility: visible;
  transform: translateY(0) scale(1);
  transition: opacity 0.35s, transform 0.35s, visibility 0s;
  pointer-events: auto;
}
.chatbot-hello.hide { display: none; }
/* Typing dots inside the bubble before text appears */
.chatbot-hello-dots {
  display: inline-flex; gap: 3px; align-items: center;
}
.chatbot-hello-dots span {
  width: 5px; height: 5px; border-radius: 50%;
  background: hsl(var(--primary));
  animation: dotBounce 1.2s ease-in-out infinite;
}
.chatbot-hello-dots span:nth-child(2) { animation-delay: 0.15s; }
.chatbot-hello-dots span:nth-child(3) { animation-delay: 0.3s; }
@keyframes dotBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-5px); opacity: 1; }
}
/* Close x on hello bubble */
.chatbot-hello-close {
  position: absolute; top: -6px; right: -6px;
  width: 18px; height: 18px; border-radius: 50%;
  background: hsl(var(--card)); border: 1px solid hsl(var(--border));
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; pointer-events: auto;
  font-size: 10px; line-height: 1; color: hsl(var(--muted-foreground));
  transition: all 0.2s;
}
.chatbot-hello-close:hover {
  background: hsl(var(--primary)); color: #fff; border-color: hsl(var(--primary));
}
html.light .chatbot-hello {
  background: #fff;
  border-color: hsl(220 18% 86%);
  box-shadow: 0 6px 24px rgba(0,0,0,0.1);
  color: #111;
}
.chatbot-panel {
  position: fixed; bottom: 10.5rem; right: 1.5rem; z-index: 50;
  width: 360px; max-height: 480px;
  border-radius: 1.25rem;
  background: hsl(var(--card) / 0.97);
  backdrop-filter: blur(24px);
  border: 1px solid hsl(var(--primary) / 0.2);
  box-shadow: 0 16px 50px rgba(0,0,0,0.4);
  display: flex; flex-direction: column;
  overflow: hidden;
  opacity: 0; visibility: hidden;
  transform: translateY(20px) scale(0.95);
  transition: opacity 0.3s, transform 0.3s, visibility 0s 0.3s;
}
.chatbot-panel.open {
  opacity: 1; visibility: visible;
  transform: translateY(0) scale(1);
  transition: opacity 0.3s, transform 0.3s, visibility 0s;
}
.chatbot-header {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: var(--gradient-neon);
  color: #fff;
}
.chatbot-avatar {
  width: 2.25rem; height: 2.25rem; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-display); font-weight: 800; font-size: 0.8rem;
}
.chatbot-header-info h4 {
  font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; line-height: 1.2;
}
.chatbot-header-info span {
  font-size: 0.7rem; opacity: 0.8;
}
.chatbot-body {
  flex: 1; overflow-y: auto;
  padding: 1.25rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  max-height: 300px;
}
.chat-msg {
  max-width: 85%; padding: 0.65rem 1rem;
  border-radius: 1rem; font-size: 0.82rem; line-height: 1.5;
}
.chat-msg-bot {
  background: hsl(var(--muted));
  color: hsl(var(--foreground));
  border-bottom-left-radius: 0.25rem;
  align-self: flex-start;
}
.chat-msg-user {
  background: hsl(var(--primary));
  color: #fff;
  border-bottom-right-radius: 0.25rem;
  align-self: flex-end;
}
.chat-typing {
  display: inline-flex; gap: 4px; align-items: center;
  padding: 0.85rem 1rem;
}
.chat-typing span {
  width: 6px; height: 6px; border-radius: 50%;
  background: hsl(var(--muted-foreground));
  animation: chatTypingDot 1.2s ease-in-out infinite;
}
.chat-typing span:nth-child(2) { animation-delay: 0.15s; }
.chat-typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes chatTypingDot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30% { transform: translateY(-4px); opacity: 1; }
}
.chatbot-input-wrap {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid hsl(var(--border));
}
.chatbot-input {
  flex: 1; padding: 0.6rem 0.85rem;
  border-radius: 100px;
  background: hsl(var(--muted) / 0.5);
  border: 1px solid hsl(var(--border));
  color: hsl(var(--foreground));
  font-size: 0.82rem; font-family: inherit;
  outline: none;
  transition: border-color 0.3s;
}
.chatbot-input:focus { border-color: hsl(var(--primary)); }
.chatbot-input::placeholder { color: hsl(var(--muted-foreground)); }
.chatbot-send {
  width: 2.25rem; height: 2.25rem;
  border-radius: 50%;
  background: hsl(var(--primary));
  border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.chatbot-send:hover { background: hsl(var(--primary) / 0.85); transform: scale(1.05); }
.chatbot-send svg { width: 1rem; height: 1rem; color: #fff; }
@media (max-width: 480px) {
  .chatbot-panel { width: calc(100vw - 2rem); right: 1rem; }
}
html.light .chatbot-panel {
  background: #fff;
  border-color: hsl(220 18% 88%);
  box-shadow: 0 16px 50px rgba(0,0,0,0.12);
}
html.light .chatbot-body { color: #111; }
html.light .chat-msg-bot { background: #f0f2f5; color: #111; }
html.light .chatbot-input { background: #f8f9fa; color: #111; border-color: hsl(220 18% 86%); }
html.light .chatbot-input::placeholder { color: #888; }
html.light .chatbot-input-wrap { border-top-color: hsl(220 18% 88%); }
html.light .chatbot-hello-close { background: #fff; border-color: hsl(220 18% 86%); color: #555; }
  `;
  document.head.appendChild(style);

  // ── Inject HTML (before </body>) ──
  var wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <!-- ===== CHATBOT HELLO BUBBLE ===== -->
  <div class="chatbot-hello" id="chatbotHello">
    <span class="chatbot-hello-close" id="chatbotHelloClose">&times;</span>
    <span id="chatbotHelloText"></span>
  </div>

  <!-- ===== CHATBOT WIDGET ===== -->
  <button class="chatbot-btn" id="chatbotToggle" aria-label="Chat with Abby">
    <div class="robot-face">
      <span class="robot-ear robot-ear-l"></span>
      <span class="robot-ear robot-ear-r"></span>
      <div class="robot-eyes">
        <span class="robot-eye"></span>
        <span class="robot-eye"></span>
      </div>
      <span class="robot-mouth"></span>
    </div>
    <div class="icon-close-wrap">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </div>
  </button>

  <div class="chatbot-panel" id="chatbotPanel">
    <div class="chatbot-header">
      <div class="chatbot-avatar">AB</div>
      <div class="chatbot-header-info">
        <h4>Abby</h4>
        <span>Usually replies instantly</span>
      </div>
    </div>
    <div class="chatbot-body" id="chatbotBody">
      <div class="chat-msg chat-msg-bot">Hi there! I'm Abby, Ronnie's virtual assistant. How can I help you today?</div>
    </div>
<div class="chatbot-input-wrap">
      <input type="text" class="chatbot-input" id="chatbotInput" placeholder="Type a message..." />
      <button class="chatbot-send" id="chatbotSend" aria-label="Send">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      </button>
    </div>
  </div>
  `;
  document.body.appendChild(wrapper);

  // ── Chatbot Logic ──
      var toggle = document.getElementById('chatbotToggle');
      var panel = document.getElementById('chatbotPanel');
      var body = document.getElementById('chatbotBody');
      var input = document.getElementById('chatbotInput');
      var sendBtn = document.getElementById('chatbotSend');
      var helloBubble = document.getElementById('chatbotHello');
      var helloText = document.getElementById('chatbotHelloText');
      var helloClose = document.getElementById('chatbotHelloClose');
      if (!toggle || !panel) return;

      // --- Hello bubble with typing animation ---
      var helloMessage = "Hey! Need help? Chat with me!";
      var helloShown = false;

      function typeHello() {
        if (helloShown || panel.classList.contains('open')) return;
        helloShown = true;
        // Show dots first
        helloText.innerHTML = '<span class="chatbot-hello-dots"><span></span><span></span><span></span></span>';
        helloBubble.classList.add('show');

        // After 1.2s replace dots with typed text
        setTimeout(function() {
          helloText.textContent = '';
          var i = 0;
          var timer = setInterval(function() {
            if (i < helloMessage.length) {
              helloText.textContent += helloMessage[i];
              i++;
            } else {
              clearInterval(timer);
            }
          }, 35);
        }, 1200);

        // Auto-hide after 8 seconds
        setTimeout(function() {
          if (helloBubble.classList.contains('show') && !panel.classList.contains('open')) {
            helloBubble.classList.remove('show');
          }
        }, 9000);
      }

      // Trigger hello after 3 seconds
      setTimeout(typeHello, 3000);

      // Close hello bubble
      if (helloClose) {
        helloClose.addEventListener('click', function(e) {
          e.stopPropagation();
          helloBubble.classList.remove('show');
          setTimeout(function() { helloBubble.classList.add('hide'); }, 350);
        });
      }

      toggle.addEventListener('click', function() {
        toggle.classList.toggle('active');
        panel.classList.toggle('open');
        // Hide hello when chat opens
        if (panel.classList.contains('open')) {
          helloBubble.classList.remove('show');
          setTimeout(function() { helloBubble.classList.add('hide'); }, 350);
          input.focus();
        }
      });

      // ── Smart NLP-like chatbot brain ──
      var L = function(s){return '<a href="'+s+'" style="color:hsl(var(--primary))">';};
      var La = function(s){return '<a href="'+s+'" target="_blank" rel="noopener noreferrer" style="color:hsl(var(--primary))">';};
      var E = '</a>';

      // Knowledge base: each intent has keywords (weighted), multiple response variants, and follow-ups
      var intents = [
        {
          name: 'greeting',
          keys: ['hi','hello','hey','good morning','good afternoon','good evening','sup','yo','howdy','greetings','whats up','what\'s up','wassup','hola','how are you','how r u','how do you do'],
          replies: [
            "Hey there! Welcome! I'm Abby, Ronnie's virtual assistant. How can I help you today?",
            "Hi! Great to have you here. I'm Abby! Want to know about Ronnie's services, portfolio, or how to get in touch?",
            "Hello! I'm Abby, here to help. Feel free to ask me anything about Ronnie's work!"
          ]
        },
        {
          name: 'farewell',
          keys: ['bye','goodbye','see you','see ya','later','take care','gtg','gotta go','ciao','night','goodnight','thanks bye','thank you bye'],
          replies: [
            "Goodbye! Thanks for visiting. Feel free to come back anytime!",
            "See you later! Don't hesitate to reach out if you need anything.",
            "Take care! If you need anything, Ronnie is just a message away."
          ]
        },
        {
          name: 'thanks',
          keys: ['thank','thanks','thx','thank you','ty','appreciate','helpful','great help','awesome','nice'],
          replies: [
            "You're welcome! Is there anything else I can help with?",
            "Glad I could help! Let me know if you have more questions.",
            "Anytime! Feel free to ask anything else."
          ]
        },
        {
          name: 'services',
          keys: ['service','services','what do you do','what you do','offer','offering','what can you do','skill','skills','specializ','expertise','capable','ability','abilities','speciali'],
          replies: [
            "Ronnie offers a wide range of creative services:\n\n• <b>UI/UX & Web Design</b> — Wireframes, prototypes, responsive websites\n• <b>Photography</b> — Product, portrait, lifestyle, events\n• <b>Video Editing</b> — Brand reels, social content, cinematic edits\n• <b>Social Media Management</b> — Strategy, content creation, analytics\n• <b>Graphic Design</b> — Branding, logos, print materials\n• <b>AI Workflows</b> — AI image generation, prompt engineering, automation\n\nWhich one interests you most?"
          ]
        },
        {
          name: 'uiux',
          keys: ['ui','ux','uiux','ui/ux','web design','website design','wireframe','prototype','figma','user interface','user experience','responsive','landing page','web page','webpage','frontend','front-end','app design','mobile design','dashboard'],
          replies: [
            "Ronnie specializes in UI/UX & Web Design! This includes:\n\n• Wireframing & prototyping in Figma\n• Responsive website design\n• Mobile app UI design\n• Landing page design\n• Dashboard & SaaS interfaces\n• User research & interaction design\n\nCheck out the " + L('/skill-uiux/') + "UIUX Portfolio" + E + " to see his work!"
          ]
        },
        {
          name: 'photography',
          keys: ['photo','photography','photographer','shoot','shooting','camera','portrait','product photo','headshot','event photo','studio','lifestyle photo','food photo'],
          replies: [
            "Ronnie is a skilled photographer covering:\n\n• Product photography\n• Portrait sessions\n• Lifestyle & brand shoots\n• Event coverage\n• Studio photography\n• Food & restaurant shoots\n\nSee his shots in the " + L('/skill-photography/') + "Photography Portfolio" + E + "!"
          ]
        },
        {
          name: 'video',
          keys: ['video','editing','premiere','reel','reels','cinematic','motion','film','footage','color grad','colour grad','short form','content creation','tiktok','youtube','vlog'],
          replies: [
            "Ronnie handles video editing with expertise in:\n\n• Brand promo reels\n• Social media short-form content (Reels, TikTok)\n• Product showcase videos\n• Corporate videos\n• Event highlights\n• Cinematic travel edits\n• Color grading in Premiere Pro\n\nExplore the " + L('/skill-video-editing/') + "Video Portfolio" + E + "!"
          ]
        },
        {
          name: 'social_media',
          keys: ['social media','social','instagram','facebook','tiktok content','content strat','engagement','followers','posting','content calendar','smm','community','brand presence','online presence','marketing'],
          replies: [
            "Ronnie manages social media end-to-end:\n\n• Content strategy & calendars\n• Post design & copywriting\n• Instagram, Facebook, TikTok management\n• Engagement & community building\n• Analytics & performance reporting\n• Brand voice development\n\nSee examples in the " + L('/skill-social-media/') + "Social Media Portfolio" + E + "!"
          ]
        },
        {
          name: 'graphic_design',
          keys: ['graphic','design','logo','brand','branding','identity','poster','flyer','brochure','print','business card','packaging','illustrat','vector','adobe','layout','visual identity','banner','signage'],
          replies: [
            "Ronnie creates bold visual designs:\n\n• Brand identity systems & logo design\n• Poster & print design\n• Business cards & stationery\n• Social media graphics & templates\n• Packaging design\n• Marketing collateral (brochures, flyers, banners)\n\nBrowse the " + L('/skill-graphic-design/') + "Graphic Design Portfolio" + E + "!"
          ]
        },
        {
          name: 'ai',
          keys: ['ai','artificial intelligence','midjourney','chatgpt','claude','kling','generative','prompt engineer','ai image','ai video','ai tool','machine learning','automation','gpt','dall-e','stable diffusion','ai art','ai design','ai assist'],
          replies: [
            "Ronnie leverages cutting-edge AI tools:\n\n• <b>Midjourney</b> — AI image generation for branding\n• <b>ChatGPT & Claude</b> — AI-assisted copywriting & strategy\n• <b>Kling AI</b> — AI video generation\n• <b>Prompt Engineering</b> — Crafting production-ready outputs\n• <b>AI Workflows</b> — End-to-end creative automation\n\nSee AI work in the " + L('/skill-artificial-intelligence/') + "AI Portfolio" + E + "!"
          ]
        },
        {
          name: 'portfolio',
          keys: ['portfolio','work','project','projects','sample','samples','example','examples','showcase','case study','previous work','past work','show me','see your'],
          replies: [
            "Here are all of Ronnie's portfolio pages:\n\n• " + L('/skill-uiux/') + "UIUX" + E + " — Web & app interfaces\n• " + L('/skill-photography/') + "Photography" + E + " — Shoots & sessions\n• " + L('/skill-video-editing/') + "Video" + E + " — Reels & edits\n• " + L('/skill-artificial-intelligence/') + "AI" + E + " — Generative & AI work\n• " + L('/skill-social-media/') + "SocialMedia" + E + " — Campaigns & strategy\n• " + L('/skill-graphic-design/') + "Graphic" + E + " — Branding & print\n\nWhich one would you like to explore?"
          ]
        },
        {
          name: 'contact',
          keys: ['contact','reach','email','mail','phone','call','message','get in touch','talk','connect','reach out','speak','dm','direct message'],
          replies: [
            "You can reach Ronnie through:\n\n• <b>Email:</b> " + L('mailto:ronniebalonon1996@gmail.com') + "ronniebalonon1996@gmail.com" + E + "\n• <b>Phone:</b> " + L('tel:+971543763091') + "+971 54 376 3091" + E + "\n• <b>WhatsApp:</b> " + La('https://wa.me/971543763091') + "Chat now" + E + "\n• <b>Contact form:</b> " + L('/contact/') + "Contact page" + E + "\n\nHe typically responds within a few hours!"
          ]
        },
        {
          name: 'whatsapp',
          keys: ['whatsapp','wa','chat now','text me','msg me'],
          replies: [
            "You can message Ronnie directly on WhatsApp!\n\n" + La('https://wa.me/971543763091') + "Click here to start a WhatsApp chat" + E + "\n\nHe's usually quick to respond!"
          ]
        },
        {
          name: 'price',
          keys: ['price','pricing','cost','rate','rates','charge','fee','fees','budget','how much','quote','estimate','affordable','cheap','expensive','pay','payment','invoice'],
          replies: [
            "Pricing varies depending on the project:\n\n• <b>UI/UX & Web Design:</b> Based on pages & complexity\n• <b>Photography:</b> Per session or per hour\n• <b>Video Editing:</b> Per project or per minute of final cut\n• <b>Graphic Design:</b> Per deliverable\n• <b>Social Media:</b> Monthly retainer packages\n\nFor a free custom quote, reach out via " + L('/contact/') + "Contact page" + E + " or " + La('https://wa.me/971543763091') + "WhatsApp" + E + "!"
          ]
        },
        {
          name: 'hire',
          keys: ['hire','hiring','freelance','freelancer','available','availability','book','booking','work together','collaborate','commission','engage','open for work','project start'],
          replies: [
            "Great news — Ronnie is currently <b>available for freelance projects</b>!\n\nHe works with clients in Dubai and remotely worldwide. To get started:\n\n1. Share your project brief\n2. Get a free quote\n3. Kick off the project!\n\n" + L('/contact/') + "Send a project inquiry" + E + " or " + La('https://wa.me/971543763091') + "chat on WhatsApp" + E + ""
          ]
        },
        {
          name: 'experience',
          keys: ['experience','background','about','story','bio','resume','cv','journey','career','history','who is','who are','about you','about ronnie','tell me about','yourself','introduction'],
          replies: [
            "Ronnie Balonon Jr. is a multi-disciplinary designer based in <b>Dubai, UAE</b> with:\n\n• <b>1 year</b> of professional experience\n• <b>50+ projects</b> completed\n• <b>20+ happy clients</b>\n\nHe specializes in UI/UX design, photography, video editing, graphic design, social media, and AI-powered creative workflows.\n\nLearn more on the " + L('/about/') + "About Me page" + E + "!"
          ]
        },
        {
          name: 'tools',
          keys: ['tool','tools','software','program','app','apps','tech','technology','stack','what do you use','workflow','platform'],
          replies: [
            "Ronnie's creative toolkit includes:\n\n<b>Design:</b> Figma, Adobe XD, Photoshop, Illustrator, InDesign\n<b>Video:</b> Premiere Pro\n<b>AI:</b> ChatGPT, Claude, Midjourney, Kling AI\n<b>Assets:</b> Freepik\n<b>Code:</b> Visual Studio Code, HTML, CSS, JS\n\nHe's always exploring new tools to stay ahead!"
          ]
        },
        {
          name: 'location',
          keys: ['location','where','based','city','country','office','address','dubai','uae','emirates','meet','in person','visit'],
          replies: [
            "Ronnie is based in <b>Dubai, UAE</b>.\n\nHe works with local clients in-person and also collaborates with clients worldwide remotely.\n\nWant to schedule a meeting? " + L('/contact/') + "Get in touch here" + E + "!"
          ]
        },
        {
          name: 'timeline',
          keys: ['timeline','how long','turnaround','deadline','delivery','when','duration','time frame','timeframe','rush','urgent','fast','quick delivery','eta'],
          replies: [
            "Typical turnaround times:\n\n• <b>Logo / Brand Identity:</b> 3–7 days\n• <b>Website Design:</b> 1–3 weeks\n• <b>Photography Session:</b> Same-day to 3 days editing\n• <b>Video Editing:</b> 3–7 days\n• <b>Social Media Package:</b> Weekly/monthly delivery\n\nRush projects are possible! Discuss your timeline via " + La('https://wa.me/971543763091') + "WhatsApp" + E + "."
          ]
        },
        {
          name: 'process',
          keys: ['process','how do you work','workflow','step','steps','method','approach','how does it work','start a project','get started','onboard','onboarding','kick off','begin'],
          replies: [
            "Ronnie's process is simple:\n\n<b>1. Discovery</b> — Understand your goals & vision\n<b>2. Proposal</b> — Scope, timeline & quote\n<b>3. Design</b> — Create, review & refine\n<b>4. Delivery</b> — Final files & handoff\n<b>5. Support</b> — Revisions & ongoing help\n\nReady to start? " + L('/contact/') + "Send a brief" + E + "!"
          ]
        },
        {
          name: 'revision',
          keys: ['revision','revisions','change','changes','edit','modify','feedback','adjust','adjustment','redo','update','tweak','iteration','round'],
          replies: [
            "Ronnie includes revision rounds in every project:\n\n• Most projects come with <b>2–3 revision rounds</b>\n• Additional revisions can be arranged\n• He values client feedback at every stage\n\nYour satisfaction is the priority!"
          ]
        },
        {
          name: 'clients',
          keys: ['client','clients','who have you worked','worked with','company','companies','brand','brands','partner','partners','testimonial','review','reference'],
          replies: [
            "Ronnie has worked with clients including:\n\n• <b>33 Degree Cafe</b> — Photography, Graphic Design, Social Media\n• <b>Power Media</b> — Photography, Graphic Design, Social Media\n• <b>MZ Cafe</b> — Photography\n• <b>Bloomfield Real Estate</b> — Photography\n• <b>Secure Visa Now</b> — Graphic Design\n\n...and many more across Dubai and beyond!"
          ]
        },
        {
          name: 'compliment',
          keys: ['cool','amazing','great','love','awesome','impressive','beautiful','stunning','fantastic','wonderful','excellent','brilliant','incredible','perfect','wow','sick','fire','dope','clean'],
          replies: [
            "Thank you so much! That means a lot. Ronnie puts his heart into every project. Want to see more of his work?",
            "Glad you like it! If you'd like to work with Ronnie, just reach out!",
            "Thanks! Ronnie would love to hear that. Is there anything specific I can help you with?"
          ]
        },
        {
          name: 'negative',
          keys: ['bad','ugly','terrible','hate','worst','horrible','awful','suck','poor','disappointing','boring','meh'],
          replies: [
            "I'm sorry to hear that! Ronnie is always open to feedback and improvement. If you'd like to discuss anything specific, feel free to " + L('/contact/') + "reach out directly" + E + ".",
            "Sorry you feel that way. Ronnie would love to understand your perspective better. " + La('https://wa.me/971543763091') + "Send him a message" + E + "!"
          ]
        },
        {
          name: 'who_built',
          keys: ['who built','who made','who created','who designed','built this','made this','designed this','developer','coded'],
          replies: [
            "This portfolio website was designed and built by Ronnie Balonon Jr. himself, with assistance from AI tools like Claude. Pretty cool, right?"
          ]
        },
        {
          name: 'fun',
          keys: ['joke','funny','laugh','humor','fun fact','tell me something','bored','entertain','surprise'],
          replies: [
            "Fun fact: Ronnie can go from designing a website wireframe to shooting a product photo to editing a reel — all in the same day! That's the power of being multi-disciplinary.",
            "Here's one: Ronnie once redesigned an entire brand identity during a coffee break. The client loved it!",
            "Did you know? Ronnie uses AI tools like Midjourney and Claude to speed up his creative process by 3x!"
          ]
        },
        {
          name: 'language',
          keys: ['language','speak','english','arabic','tagalog','filipino','translate'],
          replies: [
            "Ronnie speaks English and Tagalog (Filipino). He works with clients from all backgrounds and communicates clearly in English for all projects."
          ]
        },
        {
          name: 'robot',
          keys: ['are you a robot','are you real','are you human','are you ai','bot','chatbot','artificial','who are you','what are you'],
          replies: [
            "I'm Abby — Ronnie's virtual assistant built right into this website! I'm not a human, but I know everything about Ronnie's work. Think of me as his digital sidekick. Ask me anything!",
            "I'm Abby, an AI assistant created to help you learn about Ronnie and his services. I may not be human, but I'm pretty smart! What would you like to know?"
          ]
        }
      ];

      // Normalize text: lowercase, remove punctuation, trim
      function normalize(text) {
        return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
      }

      // Score an intent against user input
      // Substring matching only kicks in when both sides are long enough,
      // so 1–2 char noise like "lo" doesn't match "logo" / "workflow".
      var MIN_FUZZY_LEN = 4;
      function scoreIntent(input, intent) {
        var normInput = normalize(input);
        var words = normInput.split(' ');
        var score = 0;
        for (var i = 0; i < intent.keys.length; i++) {
          var key = normalize(intent.keys[i]);
          var keyWords = key.split(' ');
          // Multi-word key: check if all words appear in input
          if (keyWords.length > 1) {
            var allFound = true;
            for (var j = 0; j < keyWords.length; j++) {
              if (normInput.indexOf(keyWords[j]) === -1) { allFound = false; break; }
            }
            if (allFound) score += keyWords.length * 3;
          } else {
            // Single word: exact match, then guarded fuzzy match
            for (var w = 0; w < words.length; w++) {
              var word = words[w];
              if (word === key) {
                score += 3;
              } else if (word.length >= MIN_FUZZY_LEN && key.length >= MIN_FUZZY_LEN
                         && (word.indexOf(key) !== -1 || key.indexOf(word) !== -1)) {
                score += 1;
              }
            }
          }
        }
        return score;
      }

      // Variety of "I don't understand" replies so it doesn't feel canned
      var unknownReplies = [
        "Hmm, I didn't quite catch that. Could you rephrase it? You can ask me about Ronnie's <b>services</b>, <b>portfolio</b>, <b>pricing</b>, or how to <b>contact</b> him.",
        "Sorry, I'm not sure I understand. Try asking about Ronnie's <b>skills</b>, <b>past work</b>, <b>tools</b>, or <b>availability</b> — or " + La('https://wa.me/971543763091') + "message him directly" + E + ".",
        "I didn't get that one. I'm best at questions about Ronnie's <b>work</b>, <b>services</b>, <b>pricing</b>, and <b>contact info</b>. Could you try again?",
        "That one's outside what I know. Try keywords like <b>UI/UX</b>, <b>photography</b>, <b>video</b>, <b>pricing</b>, or <b>contact</b> — happy to help from there!"
      ];
      var tooShortReplies = [
        "Could you tell me a bit more? I can help with services, portfolio, pricing, tools, or how to contact Ronnie.",
        "I need a little more to go on — try asking about Ronnie's services, work, pricing, or contact details.",
        "Hmm, that's a bit short. What would you like to know — his services, portfolio, or how to reach him?"
      ];
      function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

      function getBotReply(text) {
        var lower = normalize(text);

        // Too short to be meaningful
        if (lower.length < 3 || lower.split(' ').every(function(w){ return w.length < 2; })) {
          return pick(tooShortReplies);
        }

        var bestScore = 0;
        var bestIntent = null;
        for (var i = 0; i < intents.length; i++) {
          var s = scoreIntent(text, intents[i]);
          if (s > bestScore) {
            bestScore = s;
            bestIntent = intents[i];
          }
        }

        // Require a confident match (exact-word hits = 3; fuzzy hits = 1).
        // Threshold of 3 means at least one real keyword match, not just noise.
        if (bestIntent && bestScore >= 3) {
          return pick(bestIntent.replies);
        }

        return pick(unknownReplies);
      }

      function addMessage(text, isUser) {
        var msg = document.createElement('div');
        msg.className = 'chat-msg ' + (isUser ? 'chat-msg-user' : 'chat-msg-bot');
        if (isUser) {
          msg.textContent = text;
        } else {
          msg.innerHTML = text.replace(/\n/g, '<br>');
        }
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
      }

      function showTyping() {
        var t = document.createElement('div');
        t.className = 'chat-msg chat-msg-bot chat-typing';
        t.innerHTML = '<span></span><span></span><span></span>';
        body.appendChild(t);
        body.scrollTop = body.scrollHeight;
        return t;
      }

      function botRespond(text) {
        var typing = showTyping();
        var delay = 2200 + Math.random() * 700;
        setTimeout(function() {
          typing.remove();
          addMessage(getBotReply(text), false);
        }, delay);
      }

      function handleSend() {
        var text = input.value.trim();
        if (!text) return;
        addMessage(text, true);
        input.value = '';
        botRespond(text);
      }

      sendBtn.addEventListener('click', handleSend);
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') handleSend();
      });
})();
