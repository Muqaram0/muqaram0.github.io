const { Plugin, ItemView, Notice, TFile } = require("obsidian");
const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");

const VIEW_TYPE = "hugo-publish-view";

function execGit(args, cwd) {
  return new Promise((resolve, reject) => {
    execFile("git", args, { cwd, windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error((stderr || stdout || error.message || "").trim()));
        return;
      }
      resolve((stdout || "").trim());
    });
  });
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontMatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const data = {};
  if (!match) {
    return { data, body: text };
  }
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return { data, body: text.slice(match[0].length) };
}

function titleFrom(data, file) {
  if (data.title) return data.title;
  return file.basename.replace(/-/g, " ");
}

class PublishView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType() {
    return VIEW_TYPE;
  }

  getDisplayText() {
    return "Publish writeup";
  }

  getIcon() {
    return "upload";
  }

  async onOpen() {
    this.draw();
  }

  draw() {
    const root = this.contentEl;
    root.empty();
    root.addClass("hugo-publish-view");
    root.createEl("h3", { text: "Publish writeup" });
    root.createEl("p", {
      text: "Duplicate the Writeup template, fill it in, choose a section, then push. Only you can publish, because this uses your local git login.",
    });

    root.createEl("label", { text: "Section", attr: { for: "hugo-dest" } });
    const input = root.createEl("select", {
      attr: { id: "hugo-dest" },
    });
    input.createEl("option", {
      text: "CTF Writeups",
      attr: { value: "ctf-writeups" },
    });
    input.createEl("option", {
      text: "Personal",
      attr: { value: "personal" },
    });
    input.value = this.plugin.settings.destination || "ctf-writeups";

    const button = root.createEl("button", { text: "Push to site" });
    button.addEventListener("click", async () => {
      button.disabled = true;
      button.setText("Pushing...");
      try {
        await this.plugin.publish(input.value);
      } finally {
        button.disabled = false;
        button.setText("Push to site");
      }
    });
  }
}

module.exports = class HugoPublishPlugin extends Plugin {
  async onload() {
    this.settings = Object.assign(
      { destination: "ctf-writeups" },
      await this.loadData()
    );

    this.registerView(VIEW_TYPE, (leaf) => new PublishView(leaf, this));
    this.addRibbonIcon("upload", "Publish writeup", () => this.activateView());
    this.addCommand({
      id: "publish-current-note",
      name: "Publish current note",
      callback: () => this.activateView(),
    });
  }

  async activateView() {
    const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (existing.length) {
      this.app.workspace.revealLeaf(existing[0]);
      return;
    }
    const leaf = this.app.workspace.getRightLeaf(false);
    await leaf.setViewState({ type: VIEW_TYPE, active: true });
    this.app.workspace.revealLeaf(leaf);
  }

  repoRoot() {
    return "C:\\Users\\muqar\\Desktop\\zon\\Portfolio\\0xfatcat";
  }

  async publish(rawDestination) {
    const destination = slugify(rawDestination);
    if (!destination || destination.includes("..")) {
      new Notice("Type a section name, like ctf-writeups or personal.");
      return;
    }

    const file = this.app.workspace.getActiveFile();
    if (!(file instanceof TFile) || file.extension !== "md") {
      new Notice("Open the writeup note first.");
      return;
    }
    if (file.path.startsWith("Templates/")) {
      new Notice("Duplicate the template into writeups, then publish that copy.");
      return;
    }

    const text = await this.app.vault.read(file);
    const parsed = parseFrontMatter(text);
    const title = titleFrom(parsed.data, file);
    const slug = slugify(parsed.data.slug || title);
    if (!slug) {
      new Notice("The note needs a title or slug.");
      return;
    }

    this.settings.destination = destination;
    await this.saveData(this.settings);

    const repo = this.repoRoot();
    const bundleDir = path.join(repo, "content", destination, slug);
    const indexPath = path.join(bundleDir, "index.md");
    fs.mkdirSync(bundleDir, { recursive: true });

    const vaultBase = this.app.vault.adapter.basePath;
    let body = text;
    const imagePattern = /!\[\[([^\]|#]+)(?:\|([^\]]+))?\]\]/g;
    body = body.replace(imagePattern, (full, target, alt) => {
      const name = path.basename(target.trim());
      const found = this.findFile(vaultBase, name);
      if (!found) return full;
      const dest = path.join(bundleDir, name);
      fs.copyFileSync(found, dest);
      const label = (alt || path.parse(name).name).trim();
      return `![${label}](${name})`;
    });

    if (!parsed.data.title) {
      body = `---\ntitle: "${title.replace(/"/g, '\\"')}"\ndate: ${new Date().toISOString().slice(0, 10)}\ndraft: false\ndescription: ""\ntags: []\ncategories: ["${destination === "personal" ? "Personal" : "CTF Writeups"}"]\nshowTableOfContents: true\n---\n\n${body}`;
    }

    fs.writeFileSync(indexPath, body.replace(/\r\n/g, "\n"), "utf8");
    this.ensureSectionIndex(repo, destination);

    const rel = path.posix.join("content", destination, slug);
    try {
      await execGit(["add", "--", rel], repo);
      await execGit(["commit", "-m", `Publish writeup: ${title}`], repo);
      await execGit(["push"], repo);
      new Notice(`Published ${title} to ${destination}.`);
    } catch (error) {
      const message = String(error.message || error);
      if (/nothing to commit/i.test(message)) {
        new Notice("Nothing new to commit.");
        return;
      }
      new Notice(`Saved the note, but git did not finish. ${message}`);
    }
  }

  ensureSectionIndex(repo, destination) {
    const index = path.join(repo, "content", destination, "_index.md");
    if (fs.existsSync(index)) return;
    const title = destination.replace(/-/g, " ");
    const contents = `---\ntitle: "${title}"\ndescription: ""\ndraft: false\ntype: ctf-writeups\ncascade:\n  type: ctf-writeups\n---\n`;
    fs.writeFileSync(index, contents, "utf8");
  }

  findFile(root, name) {
    const stack = [root];
    while (stack.length) {
      const current = stack.pop();
      let entries = [];
      try {
        entries = fs.readdirSync(current, { withFileTypes: true });
      } catch (e) {
        continue;
      }
      for (const entry of entries) {
        if (entry.name === ".obsidian" || entry.name === ".git") continue;
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) stack.push(full);
        else if (entry.name.toLowerCase() === name.toLowerCase()) return full;
      }
    }
    return null;
  }
};
