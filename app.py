import streamlit as st
import pandas as pd
import urllib.parse
from tinyfish_engine import TinyFishEngine

# Page Configuration - Clean Minimal Dark Palette
st.set_page_config(
    page_title="TinyFish Career Scout",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Custom Claude / ChatGPT Dark Theme CSS - Monochromatic, zero harsh colors
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Geist', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    .stApp {
        background-color: #09090b;
        color: #ececec;
    }
    
    /* Clean minimal card */
    .job-card {
        background-color: #121214;
        border: 1px solid #27272a;
        border-radius: 8px;
        padding: 1.1rem;
        margin-bottom: 0.75rem;
        transition: border-color 0.15s ease;
    }
    .job-card:hover {
        border-color: #3f3f46;
    }
    
    .tag-badge {
        display: inline-block;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        background-color: #18181b;
        color: #a1a1aa;
        border: 1px solid #27272a;
        font-family: 'JetBrains Mono', monospace;
    }

    .match-pill {
        background: #052e16;
        color: #4ade80;
        border: 1px solid #166534;
        padding: 2px 7px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-family: 'JetBrains Mono', monospace;
    }
</style>
""", unsafe_allow_html=True)

engine = TinyFishEngine()

# Header
col1, col2 = st.columns([3, 1])
with col1:
    st.markdown('<span class="tag-badge">TinyFish x TechnoJam Drop 001</span> <span class="tag-badge">Career Scout</span>', unsafe_allow_html=True)
    st.title("Career Scout")
    st.caption("Live ATS job and internship discovery using TinyFish Search, Fetch, and Agent.")

with col2:
    status_label = "Ready" if engine.has_valid_api_key() else "No Key Configured"
    st.metric("TinyFish Engine", status_label, "3 Endpoints")

# Architecture Explainer
with st.expander("Architecture: How TinyFish Search, Fetch, and Agent are Used", expanded=False):
    st.markdown("""
    This application chains 3 core TinyFish endpoints:
    
    1. **TinyFish Search (`GET https://api.search.tinyfish.ai`)**: Scans live ATS platforms (Greenhouse, Lever, Ashby, Workday) using targeted parameters.
    2. **TinyFish Fetch (`POST https://api.fetch.tinyfish.ai`)**: Headless browser extraction that cleans DOM boilerplate, returning semantic Markdown.
    3. **TinyFish Agent (`POST https://agent.tinyfish.ai/v1/automation/run`)**: Semantic parsing, seniority matching, and match score calculation.
    4. **Pandas Engine**: Deduplication across companies and sorting by relevance score.
    """)

# Search Parameters
st.markdown("### Search Preferences")
c1, c2, c3, c4 = st.columns(4)
with c1:
    role = st.text_input("Role / Title", value="Software Engineer Intern")
with c2:
    location = st.text_input("Location", value="Remote")
with c3:
    seniority = st.selectbox("Seniority Level", ["Internship", "Entry-Level", "Junior", "Mid-Level"])
with c4:
    keywords = st.text_input("Keywords / Skills", value="Python, React")

portals = st.multiselect(
    "Target Career Portals",
    ["greenhouse.io", "lever.co", "ashbyhq.com", "myworkdayjobs.com"],
    default=["greenhouse.io", "lever.co", "ashbyhq.com"]
)

if st.button("Find Openings", type="primary", use_container_width=True):
    with st.status("Running TinyFish 3-Endpoint Pipeline...", expanded=True) as status:
        st.write("Step 1/3 (TinyFish Search): Discovering active URLs across target portals...")
        st.write("Step 2/3 (TinyFish Fetch): Rendering DOM into clean markdown...")
        st.write("Step 3/3 (TinyFish Agent): Extracting structured schema and scoring...")
        
        results = engine.execute_pipeline(
            role=role,
            location=location,
            keywords=keywords,
            seniority=seniority,
            portals=portals
        )
        status.update(label=f"Completed in {results.get('duration_ms', 0)}ms", state="complete", expanded=False)

    jobs = results.get("jobs", [])
    if jobs:
        st.write(f"**{len(jobs)} deduplicated positions found:**")
        for job in jobs:
            skills_html = " ".join([f"<span class='tag-badge'>{s}</span>" for s in job.get("skills", [])])
            st.markdown(f"""
            <div class="job-card">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <div style="font-size: 1rem; font-weight: 500; color: #fff;">{job['title']}</div>
                        <div style="color: #a1a1aa; font-size: 0.85rem; margin-top: 2px;">
                            {job['company']} &bull; {job['location']} &bull; <span style="font-family: monospace;">{job['source_portal']}</span>
                        </div>
                    </div>
                    <span class="match-pill">{job['match_score']}% match</span>
                </div>
                <div style="color: #71717a; font-size: 0.8rem; margin: 0.4rem 0;">{job.get('snippet', '')}</div>
                <div style="margin-top: 0.4rem; display: flex; justify-content: space-between; align-items: center;">
                    <div>{skills_html}</div>
                    <a href="{job['apply_url']}" target="_blank" style="background: #ffffff; color: #000; padding: 4px 10px; border-radius: 4px; font-weight: 500; text-decoration: none; font-size: 0.8rem;">Apply</a>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
        df = pd.DataFrame(jobs)
        csv = df.to_csv(index=False).encode('utf-8')
        st.download_button(
            "Export CSV",
            data=csv,
            file_name="tinyfish_openings.csv",
            mime="text/csv",
            use_container_width=True
        )

# Social Share Helper
st.markdown("---")
with st.expander("Social Submission Helper: LinkedIn & X Posts", expanded=False):
    post_text = (
        "Excited to share my build for the TinyFish x TechnoJam Bounty Drop 001.\n\n"
        "Built an AI-powered Career Scout chaining 3 TinyFish endpoints:\n"
        "• TinyFish Search for live ATS discovery (Greenhouse, Lever, Ashby)\n"
        "• TinyFish Fetch for clean DOM markdown extraction\n"
        "• TinyFish Agent for semantic matching and deduplication\n\n"
        "@TinyFish #TechnoJam #AIThatClicks #AIWebAgents #OpenSource"
    )
    st.text_area("Post text:", value=post_text, height=120)
    x_intent = f"https://twitter.com/intent/tweet?text={urllib.parse.quote(post_text)}"
    li_intent = f"https://www.linkedin.com/sharing/share-offsite/?url={urllib.parse.quote('https://tinyfish.ai')}"
    c_x, c_li = st.columns(2)
    with c_x:
        st.link_button("Post on X", x_intent, use_container_width=True)
    with c_li:
        st.link_button("Post on LinkedIn", li_intent, use_container_width=True)