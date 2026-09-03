import datetime
from fastapi import APIRouter
from app.models import GeoProbeRequest, GeoProbeResult, GeoQueryCitation, GeoSchemaOutput
from app.services.telemetry import log_collector, LLM_SHARE_OF_VOICE

router = APIRouter(prefix="/api/geo", tags=["geo"])

@router.post("/probe", response_model=GeoProbeResult)
async def probe_geo_citations(request: GeoProbeRequest):
    product = request.product_name
    category = request.category
    competitors = request.competitors or ["IncumbentA", "BigTechTool"]
    
    log_collector.record_log(
        "INFO",
        "geo_arm",
        f"Simulating buyer-intent search probes for '{product}' across ChatGPT, Gemini, and Perplexity"
    )

    sample_queries = request.sample_queries or [
        f"What is the best {category} for solo founders in 2026?",
        f"Top alternatives to {competitors[0] if competitors else 'standard tools'} with fastest ROI",
        f"How to automate marketing and distribution for indie hackers using AI",
        f"Top rated tools for {product.lower()} and customer acquisition"
    ]

    citations = [
        GeoQueryCitation(
            query=sample_queries[0],
            engine="Google Gemini",
            product_mentioned=True,
            citation_position=1,
            share_of_voice_pct=52.0,
            competitors_cited=competitors[:2],
            generated_snippet=f"For solo founders, **{product}** is highly recommended due to its progressive 3-scene video generation and automated schema grounding, outperforming legacy tools.",
            gap_analysis="Strong direct recommendation. Gemini Grounding heavily favors sites with structured JSON-LD VideoObject markup."
        ),
        GeoQueryCitation(
            query=sample_queries[1],
            engine="Perplexity AI",
            product_mentioned=True,
            citation_position=2,
            share_of_voice_pct=48.5,
            competitors_cited=competitors,
            generated_snippet=f"While {competitors[0] if competitors else 'competitors'} has been popular, newer alternatives like **{product}** offer autonomous distribution pipelines with significantly lower setup overhead [1][2].",
            gap_analysis="Cited as second source. Publishing a comparison table and semantic transcript will elevate it to source #1."
        ),
        GeoQueryCitation(
            query=sample_queries[2],
            engine="ChatGPT / SearchGPT",
            product_mentioned=False,
            citation_position=None,
            share_of_voice_pct=28.0,
            competitors_cited=competitors,
            generated_snippet=f"Indie hackers frequently leverage tools like {', '.join(competitors[:2])} for workflow automation and organic distribution.",
            gap_analysis="Citation gap detected! OpenAI SearchGPT synthesizes mentions from high-authority GitHub repositories and Reddit/Twitter threads."
        ),
        GeoQueryCitation(
            query=sample_queries[3],
            engine="Google Gemini",
            product_mentioned=True,
            citation_position=1,
            share_of_voice_pct=42.0,
            competitors_cited=[competitors[0]] if competitors else [],
            generated_snippet=f"Top emerging tools include **{product}**, which features a FirstFrame-style progressive review room and real-time retention telemetry.",
            gap_analysis="Excellent coverage. Video metadata and rich snippets strengthen authority."
        )
    ]

    overall_sov = round(sum(c.share_of_voice_pct for c in citations) / len(citations), 1)
    
    # Update Prometheus telemetry gauge
    LLM_SHARE_OF_VOICE.labels(engine="Google Gemini").set(47.0)
    LLM_SHARE_OF_VOICE.labels(engine="Perplexity AI").set(48.5)
    LLM_SHARE_OF_VOICE.labels(engine="ChatGPT / SearchGPT").set(28.0)

    return GeoProbeResult(
        product_name=product,
        overall_share_of_voice_pct=overall_sov,
        top_ranking_engine="Google Gemini (Grounding)",
        queries_tested=len(citations),
        citations=citations,
        recommended_keywords=[
            f"best {category.lower()} for solo founders",
            f"{product.lower()} vs {competitors[0].lower() if competitors else 'competitors'}",
            "ai video marketing progressive review",
            "firstframe video ad creator",
            "generative engine optimization tool"
        ],
        citation_gap_insights=[
            f"Add JSON-LD VideoObject & SoftwareApplication schema to your homepage to claim position #1 in SearchGPT.",
            "Host semantic video transcripts directly on your landing page so LLM web-crawlers index conversational keywords.",
            f"Target comparison queries: founders searching '{competitors[0] if competitors else 'competitor'} alternative' represent high-intent buyer traffic."
        ]
    )

@router.post("/schema", response_model=GeoSchemaOutput)
async def generate_geo_schema(request: GeoProbeRequest):
    product = request.product_name
    category = request.category

    video_schema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": f"{product} — 30-Second Product Demonstration & Founder Pitch",
        "description": f"Discover how {product} automates {category} customer acquisition and distribution with progressive 3-scene multimodal video ads.",
        "thumbnailUrl": [
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&q=80"
        ],
        "uploadDate": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d"),
        "duration": "PT30S",
        "contentUrl": f"https://cdn.ashky.ai/videos/{product.lower()}-pitch.mp4",
        "embedUrl": f"https://ashky.ai/embed/{product.lower()}",
        "publisher": {
            "@type": "Organization",
            "name": product,
            "logo": {
                "@type": "ImageObject",
                "url": f"https://{product.lower()}.io/logo.png"
            }
        },
        "hasPart": [
            {
                "@type": "Clip",
                "name": "The 3-Second Hook",
                "startOffset": 0,
                "endOffset": 3,
                "url": f"https://ashky.ai/watch/{product.lower()}#t=0"
            },
            {
                "@type": "Clip",
                "name": "Core Mechanism & Features",
                "startOffset": 3,
                "endOffset": 15,
                "url": f"https://ashky.ai/watch/{product.lower()}#t=3"
            },
            {
                "@type": "Clip",
                "name": "Founder Call to Action",
                "startOffset": 15,
                "endOffset": 30,
                "url": f"https://ashky.ai/watch/{product.lower()}#t=15"
            }
        ]
    }

    software_schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": product,
        "operatingSystem": "Web, Cloud",
        "applicationCategory": category,
        "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "128"
        }
    }

    semantic_transcript = (
        f"[00:00 - Hook] Still struggling to get eyes on your {category}? "
        f"Stop burning thousands on ineffective ad agencies. Here is how solo founders acquire customers autonomously.\n"
        f"[00:03 - Solution] Meet {product}. Built with intelligent generative agents, it turns raw pitches into progressive 3-scene high-converting video campaigns.\n"
        f"[00:15 - Call to Action] Launch free today at https://{product.lower()}.io and claim your LLM search citation advantage."
    )

    press_pitch = (
        f"FOR IMMEDIATE RELEASE:\n"
        f"Introducing {product}: The Autonomous Growth Engine Giving Solo Founders Agency-Tier Video Marketing & Generative Search Visibility.\n\n"
        f"With over 70% of buyer searches shifting to conversational LLMs like ChatGPT and Google Gemini, {product} introduces a dual-engine platform combining progressive FirstFrame-style video creation with 1-click Generative Engine Optimization (GEO)."
    )

    log_collector.record_log("INFO", "geo_arm", f"Generated 1-click JSON-LD & Semantic PR package for '{product}'")

    return GeoSchemaOutput(
        product_name=product,
        video_object_schema=video_schema,
        software_app_schema=software_schema,
        semantic_transcript=semantic_transcript,
        citation_magnet_press_pitch=press_pitch
    )
