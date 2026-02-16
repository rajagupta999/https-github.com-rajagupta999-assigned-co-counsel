# Local Sovereign Cloud: The "Assigned Co-Counsel Appliance"

This guide explains how to deploy the Assigned Co-Counsel platform on your own hardware to keep all client data physically in your office while retaining secure remote access.

**Works on:**
*   **Windows 10/11** (via WSL 2)
*   **macOS** (Apple Silicon recommended)
*   **Linux** (Ubuntu/Debian)

## Architecture: "The Vault"

Instead of trusting a cloud provider with your privileged client files, you run the entire stack on a dedicated machine (the "Appliance").

*   **Compute:** Your existing Office PC or a dedicated Mac Mini.
*   **Storage:** Your local hard drive (BitLocker/FileVault encrypted).
*   **AI Intelligence:** Local LLMs (Llama 3, Mistral) running on your hardware. No data leaves the machine.
*   **Remote Access:** **Tailscale** creates a private, encrypted mesh network. You can access `https://my-firm` from your iPhone in court, but the public internet cannot see it.

## Quick Start (Docker Compose)

We provide a pre-configured Docker stack that spins up the Application, Database, and Vector Store in one command.

### Prerequisites
1.  **Docker Desktop** (Windows/Mac) or Docker Engine (Linux).
2.  **Tailscale** installed and logged in.
3.  **Ollama** installed on the host machine for local AI.

### 1. Install the Stack
Create a folder `assigned-co-counsel` and save this `docker-compose.local.yml`:

```yaml
version: '3.8'

services:
  # The Main Application (Next.js)
  app:
    image: ghcr.io/rajagupta/assigned-co-counsel:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_PRACTICE_MODE=combined
      - DATABASE_URL=file:/data/db.sqlite
      - AI_PROVIDER=local
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
    volumes:
      - ./data:/data
      # Windows Path Example: c:/Users/Lawyer/Documents/Cases
      # Mac Path Example: ~/Documents/Cases
      - ${CASES_DIR:-~/Documents/Cases}:/mnt/cases:ro 

  # Vector Database for Local RAG (ChromaDB)
  vector-db:
    image: chromadb/chroma:latest
    ports:
      - "8000:8000"
    volumes:
      - ./data/chroma:/chroma/chroma

  # Tailscale Sidecar (Secure Remote Access)
  tailscale:
    image: tailscale/tailscale
    network_mode: host
    environment:
      - TS_AUTHKEY=${TS_AUTHKEY}
      - TS_HOSTNAME=my-legal-appliance
    volumes:
      - ./data/tailscale:/var/lib/tailscale
    cap_add:
      - NET_ADMIN
      - NET_RAW
```

### 2. Connect Local AI (The "Brain")
The application needs to talk to your GPU for free, private intelligence.
1.  Run Ollama on the host: `ollama serve`.
    *   **Windows:** Ensure Ollama is allowed through firewall.
    *   **Mac:** Just run the app.
2.  Pull a legal-optimized model: `ollama pull llama3:8b` (or `law-bert`).
3.  The Docker container communicates via `host.docker.internal` to use your hardware acceleration.

### 3. "Ingest" Your Files
The system includes a background worker that watches your Cases folder.
*   **Windows:** Point `CASES_DIR` to `c:/Users/YourName/Documents/Cases` in a `.env` file.
*   **Mac:** Defaults to `~/Documents/Cases`.

It uses the local LLM to OCR and summarize the document.
*   **Result:** You can ask "What happened in the Smith case?" and the AI answers instantly, citing your local files, without any data ever touching the cloud.

### 4. Remote Access
1.  Install Tailscale on your iPhone/iPad.
2.  Connect to your tailnet.
3.  Open `http://my-legal-appliance:3000` in your browser.
4.  You have full, fast access to your entire case file and local AI, anywhere in the world.

## Security Model
*   **Zero-Trust:** No ports are opened on your router.
*   **Data Sovereignty:** Physical possession of the hard drive.
*   **Encryption:** Disk encryption (BitLocker/FileVault) protects data at rest. Tailscale encrypts data in transit.
*   **Isolation:** The App runs in a container. It has read-only access to your files by default, preventing accidental deletions or ransomware spread from within the app.

This is the **Ultimate Private Practice** — on the hardware you already own.
