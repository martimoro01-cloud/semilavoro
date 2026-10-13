"""Import official RSS/Atom notices into Supabase as unpublished drafts.
Configuration: BANDI_FEEDS_JSON is a JSON array of feed descriptors:
[{"url":"https://official.example/rss","ente":"Ente ufficiale","tipo":"concorso","regione":"Nazionale","allowed_hosts":["official.example"]}]
Only use verified official feeds. Never put the service role key in frontend code.
"""
import json, os, re, sys, hashlib
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

def get_text(node, tags):
    for tag in tags:
        el = node.find(tag)
        if el is not None and el.text and el.text.strip():
            return el.text.strip()
    return ""

def parse_date(s):
    if not s: return None
    try: return parsedate_to_datetime(s).astimezone(timezone.utc).isoformat()
    except (TypeError, ValueError, IndexError):
        try: return datetime.fromisoformat(s.replace("Z","+00:00")).astimezone(timezone.utc).isoformat()
        except ValueError: return None

def load_entries(xml):
    root = ET.fromstring(xml)
    if root.tag.endswith("rss") or root.tag == "rss":
        for item in root.findall("./channel/item"):
            yield {"title":get_text(item,["title"]),"url":get_text(item,["link"]),
                   "date":get_text(item,["deadline","expirationDate","{http://purl.org/dc/elements/1.1/}date"]),
                   "summary":get_text(item,["description"])}
    else:
        atom="{http://www.w3.org/2005/Atom}"
        for item in root.findall(f"{atom}entry"):
            link=item.find(f"{atom}link")
            yield {"title":get_text(item,[f"{atom}title"]),
                   "url":link.get("href","") if link is not None else "",
                   "date":get_text(item,[f"{atom}deadline"]),
                   "summary":get_text(item,[f"{atom}summary"])}

def main():
    feeds=json.loads(os.environ.get("BANDI_FEEDS_JSON","[]"))
    base=os.environ["SUPABASE_URL"].rstrip("/")
    key=os.environ["SUPABASE_SERVICE_ROLE_KEY"]
    count=0
    for feed in feeds:
        try:
            url=feed["url"]
            host=urlparse(url).hostname
            allowed=set(feed["allowed_hosts"])
            if urlparse(url).scheme!="https" or host not in allowed:
                raise ValueError("Feed host not allowlisted")
            req=Request(url,headers={"User-Agent":"SEMI-Bandi-Importer/1.0"})
            with urlopen(req,timeout=20) as response:
                payload=response.read(2_000_001)
            if len(payload)>2_000_000: raise ValueError("Feed too large")
            for entry in load_entries(payload):
                title=re.sub("<[^>]+>","",entry["title"]).strip()[:240]
                target=entry["url"]
                target_host=urlparse(target).hostname
                # Import only source links from the same trusted host list.
                if len(title)<8 or urlparse(target).scheme!="https" or target_host not in allowed: continue
                deadline=parse_date(entry["date"])
                # Never invent deadlines; skip items without a structured explicit deadline.
                if not deadline or datetime.fromisoformat(deadline) <= datetime.now(timezone.utc): continue
                unique=hashlib.sha256((url+"|"+target).encode()).hexdigest()
                row={"titolo":title,"ente":feed["ente"],"tipo":feed["tipo"],
                     "regione":feed.get("regione","Nazionale"),"professione":"",
                     "descrizione":re.sub("<[^>]+>","",entry["summary"])[:1200],
                     "scadenza":deadline,"url_ufficiale":target,"fonte":"automatica",
                     "identificativo_fonte":unique,"verificato":False,"pubblicato":False}
                request=Request(base+"/rest/v1/bandi?on_conflict=identificativo_fonte",
                                data=json.dumps(row).encode(),method="POST",
                                headers={"apikey":key,"Authorization":"Bearer "+key,
                                         "Content-Type":"application/json","Prefer":"resolution=ignore-duplicates"})
                with urlopen(request,timeout=20) as response: response.read()
                count+=1
        except Exception as exc:
            print(f"Feed failed: {feed.get('url','?')}: {exc}",file=sys.stderr)
            continue
    print(f"Imported up to {count} draft notices; review required before publication.")

if __name__=="__main__": main()
